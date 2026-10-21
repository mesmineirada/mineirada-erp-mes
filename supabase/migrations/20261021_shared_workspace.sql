-- Aplicar uma única vez no SQL Editor do projeto Supabase.
-- O estado operacional inteiro é compartilhado por todos os usuários autenticados.
create table public.workspace_state (
  id smallint primary key check (id = 1),
  state jsonb not null,
  version bigint not null default 1 check (version > 0),
  updated_by text not null,
  updated_at timestamptz not null default now()
);

alter table public.workspace_state enable row level security;

revoke all on table public.workspace_state from anon, authenticated;
grant select on table public.workspace_state to authenticated;

create policy "Authenticated users can read the shared workspace"
  on public.workspace_state
  for select
  to authenticated
  using (auth.uid() is not null);

create or replace function public.save_workspace_state(
  p_state jsonb,
  p_expected_version bigint
)
returns table(version bigint, updated_by text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_version bigint;
  actor text;
  previous_state jsonb;
  actor_profile text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_state is null or jsonb_typeof(p_state) <> 'object' then
    raise exception 'Workspace state must be a JSON object' using errcode = '22023';
  end if;

  if p_expected_version is null or p_expected_version < 0 then
    raise exception 'Expected version must be zero or greater' using errcode = '22023';
  end if;

  -- Serializa primeiro a validação de permissões e depois o compare-and-swap.
  perform pg_advisory_xact_lock(20261021, 1);
  select state into previous_state
    from public.workspace_state
    where id = 1
    for update;

  actor_profile := lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', 'user'));
  if actor_profile not in ('gestor', 'gerente', 'admin')
    and previous_state is not null
    and coalesce(previous_state -> 'publicTrackingSettings', '{}'::jsonb)
      is distinct from coalesce(p_state -> 'publicTrackingSettings', '{}'::jsonb) then
    raise exception 'WORKSPACE_ROLE_FORBIDDEN' using errcode = '42501';
  end if;

  if actor_profile not in ('gestor', 'gerente', 'admin') then
    if exists (
      select 1
      from jsonb_array_elements(coalesce(previous_state -> 'productionOrders', '[]'::jsonb)) as old_order(item)
      left join lateral (
        select candidate.item
        from jsonb_array_elements(coalesce(p_state -> 'productionOrders', '[]'::jsonb)) as candidate(item)
        where candidate.item ->> 'number' = old_order.item ->> 'number'
        limit 1
      ) as new_order on true
      where coalesce(new_order.item ->> 'authorizationStatus', '') <> coalesce(old_order.item ->> 'authorizationStatus', '')
         or coalesce(new_order.item ->> 'materialSeparated', 'false') <> coalesce(old_order.item ->> 'materialSeparated', 'false')
         or coalesce(new_order.item ->> 'suppliesSeparated', 'false') <> coalesce(old_order.item ->> 'suppliesSeparated', 'false')
         or coalesce(new_order.item ->> 'productionReleased', 'false') <> coalesce(old_order.item ->> 'productionReleased', 'false')
         or (new_order.item ->> 'status' = 'Em produção' and old_order.item ->> 'status' is distinct from 'Em produção')
    ) or exists (
      select 1
      from jsonb_array_elements(coalesce(p_state -> 'productionOrders', '[]'::jsonb)) as new_order(item)
      left join lateral (
        select candidate.item
        from jsonb_array_elements(coalesce(previous_state -> 'productionOrders', '[]'::jsonb)) as candidate(item)
        where candidate.item ->> 'number' = new_order.item ->> 'number'
        limit 1
      ) as old_order on true
      where old_order.item is null
        and (new_order.item ->> 'authorizationStatus' = 'Autorizada'
          or new_order.item ->> 'materialSeparated' = 'true'
          or new_order.item ->> 'suppliesSeparated' = 'true'
          or new_order.item ->> 'productionReleased' = 'true'
          or new_order.item ->> 'status' = 'Em produção')
    ) then
      raise exception 'WORKSPACE_ROLE_FORBIDDEN' using errcode = '42501';
    end if;
  end if;

  actor := coalesce(auth.jwt() ->> 'email', auth.uid()::text);

  insert into public.workspace_state as current_state
    (id, state, version, updated_by, updated_at)
  values
    (1, p_state, 1, actor, now())
  on conflict (id) do update
    set state = excluded.state,
        version = current_state.version + 1,
        updated_by = actor,
        updated_at = now()
    where current_state.version = p_expected_version
  returning current_state.version, current_state.updated_by
    into saved_version, actor;

  if not found then
    raise exception 'WORKSPACE_VERSION_CONFLICT' using errcode = '40001';
  end if;

  return query select saved_version, actor;
end;
$$;

revoke all on function public.save_workspace_state(jsonb, bigint) from public, anon, authenticated;
grant execute on function public.save_workspace_state(jsonb, bigint) to authenticated;

-- Consulta de pedido para QR/página pública. Não retorna o workspace nem os
-- campos comerciais/operacionais que não foram explicitamente habilitados.
create or replace function public.public_lookup_order(p_number text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  workspace jsonb;
  settings jsonb;
  visibility jsonb;
  order_record jsonb;
  production_record jsonb;
  latest_entry jsonb;
  order_result jsonb;
  linked_result jsonb;
  progress_result jsonb;
  stage_label text;
  location_label text;
begin
  if p_number is null or length(btrim(p_number)) = 0 or length(p_number) > 64 then
    return null;
  end if;

  select state into workspace from public.workspace_state where id = 1;
  if workspace is null then
    return null;
  end if;

  select item into order_record
    from jsonb_array_elements(coalesce(workspace -> 'orders', '[]'::jsonb)) as records(item)
    where lower(coalesce(item ->> 'number', '')) = lower(btrim(p_number))
    limit 1;
  if order_record is null then
    return null;
  end if;

  settings := coalesce(workspace -> 'publicTrackingSettings', '{}'::jsonb);
  visibility := jsonb_build_object(
    'showOrderStatus', coalesce(settings ->> 'showOrderStatus' = 'true', true),
    'showDelivery', coalesce(settings ->> 'showDelivery' = 'true', true),
    'showProductionStage', coalesce(settings ->> 'showProductionStage' = 'true', true),
    'showLinkedProductionOrder', coalesce(settings ->> 'showLinkedProductionOrder' = 'true', true),
    'showLastUpdate', coalesce(settings ->> 'showLastUpdate' = 'true', true),
    'showLocation', coalesce(settings ->> 'showLocation' = 'true', true),
    'showTotal', coalesce(settings ->> 'showTotal' = 'true', false)
  );

  order_result := jsonb_build_object(
    'number', order_record ->> 'number',
    'client', order_record ->> 'client',
    'status', case when visibility -> 'showOrderStatus' = 'true'::jsonb then order_record ->> 'status' else null end,
    'delivery', case when visibility -> 'showDelivery' = 'true'::jsonb then order_record ->> 'delivery' else null end,
    'total', case when visibility -> 'showTotal' = 'true'::jsonb then order_record ->> 'total' else null end
  );

  select item into production_record
    from jsonb_array_elements(coalesce(workspace -> 'productionOrders', '[]'::jsonb)) as records(item)
    where lower(coalesce(item ->> 'linkedOrder', '')) = lower(coalesce(order_record ->> 'number', ''))
    limit 1;

  if production_record is not null then
    select item into latest_entry
      from jsonb_array_elements(coalesce(workspace -> 'productionEntries', '[]'::jsonb)) as records(item)
      where lower(coalesce(item ->> 'orderNumber', '')) = lower(coalesce(production_record ->> 'number', ''))
      order by item ->> 'date' desc
      limit 1;
  end if;

  if latest_entry is not null then
    stage_label := case latest_entry ->> 'sector'
      when 'separacao_mp' then 'Separação MP'
      when 'cozinha' then 'Cozinha'
      when 'corte' then 'Corte'
      when 'tunel' then 'Túnel'
      when 'envasadora' then 'Envasadora'
      when 'camara_fria' then 'Câmara Fria'
      when 'expedicao' then 'Expedição'
      else null
    end;
  end if;
  location_label := case
    when production_record ->> 'status' = 'Concluída' then 'Câmara Fria'
    when stage_label is not null then stage_label
    when production_record ->> 'authorizationStatus' = 'Autorizada' then 'Aguardando início da produção'
    else 'Planejamento'
  end;

  if production_record is not null and visibility -> 'showLinkedProductionOrder' = 'true'::jsonb then
    linked_result := jsonb_build_object('number', production_record ->> 'number');
  end if;
  progress_result := jsonb_build_object(
    'stage', case when visibility -> 'showProductionStage' = 'true'::jsonb and stage_label is not null then jsonb_build_object('label', stage_label) else null end,
    'location', case when visibility -> 'showLocation' = 'true'::jsonb then location_label else null end,
    'latest', case when visibility -> 'showLastUpdate' = 'true'::jsonb and latest_entry is not null then jsonb_build_object('date', latest_entry ->> 'date', 'sent', latest_entry ->> 'sent') else null end
  );

  return jsonb_build_object(
    'order', order_result,
    'linkedProductionOrder', linked_result,
    'progress', progress_result,
    'publicTrackingSettings', visibility
  );
end;
$$;

revoke all on function public.public_lookup_order(text) from public, anon, authenticated;
grant execute on function public.public_lookup_order(text) to anon, authenticated;
