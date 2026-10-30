-- GitHub Pages + Supabase Auth: keep the singleton ERP snapshot behind RLS.
-- The browser never receives service_role credentials or direct write grants.

ALTER TABLE public.workspace_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.workspace_state FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, state, version) ON TABLE public.workspace_state TO authenticated;
DROP POLICY IF EXISTS workspace_state_approved_read ON public.workspace_state;
CREATE POLICY workspace_state_approved_read
  ON public.workspace_state
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', ''))
      IN ('admin', 'gestor', 'gerente')
  );

-- Do not allow browser clients to bypass the guarded save wrapper. Preserve the
-- service_role path used by trusted server-side code.
REVOKE ALL PRIVILEGES ON FUNCTION public.save_workspace_state(jsonb, bigint)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_workspace_state(jsonb, bigint) TO service_role;

CREATE OR REPLACE FUNCTION public.save_workspace_state_guarded(
  p_state jsonb,
  p_expected_version bigint
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  profile text;
  current_state jsonb;
  current_version bigint;
  next_version bigint;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  profile := lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', ''));
  IF profile NOT IN ('admin', 'gestor', 'gerente') THEN
    RAISE EXCEPTION 'WORKSPACE_ROLE_FORBIDDEN' USING ERRCODE = '42501';
  END IF;
  IF p_state IS NULL OR pg_catalog.jsonb_typeof(p_state) <> 'object' THEN
    RAISE EXCEPTION 'Invalid workspace state' USING ERRCODE = '22023';
  END IF;

  SELECT ws.state, ws.version
    INTO current_state, current_version
    FROM public.workspace_state AS ws
    WHERE ws.id = 1
    FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workspace state is not initialized' USING ERRCODE = 'P0002';
  END IF;
  IF p_expected_version IS DISTINCT FROM current_version THEN
    RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001';
  END IF;

  -- Ordinary snapshot saves cannot create, remove, or alter protected OP
  -- authorization fields. That transition is available only via the dedicated
  -- authorize_production_order RPC below.
  IF EXISTS (
    SELECT 1
    FROM pg_catalog.jsonb_array_elements(
      coalesce(current_state -> 'productionOrders', '[]'::jsonb)
    ) AS old_order(item)
    LEFT JOIN LATERAL (
      SELECT new_order.item
      FROM pg_catalog.jsonb_array_elements(
        coalesce(p_state -> 'productionOrders', '[]'::jsonb)
      ) AS new_order(item)
      WHERE lower(coalesce(new_order.item ->> 'number', ''))
          = lower(coalesce(old_order.item ->> 'number', ''))
      LIMIT 1
    ) AS matched ON true
    WHERE (matched.item IS NULL AND (
         old_order.item ->> 'authorizationStatus' = 'Autorizada'
         OR old_order.item -> 'materialSeparated' = 'true'::jsonb
         OR old_order.item -> 'suppliesSeparated' = 'true'::jsonb
         OR old_order.item -> 'productionReleased' = 'true'::jsonb
       ))
       OR (matched.item IS NOT NULL AND (
         old_order.item -> 'authorizationStatus' IS DISTINCT FROM matched.item -> 'authorizationStatus'
         OR old_order.item -> 'materialSeparated' IS DISTINCT FROM matched.item -> 'materialSeparated'
         OR old_order.item -> 'suppliesSeparated' IS DISTINCT FROM matched.item -> 'suppliesSeparated'
         OR old_order.item -> 'productionReleased' IS DISTINCT FROM matched.item -> 'productionReleased'
       ))
  ) THEN
    RAISE EXCEPTION 'Production authorization fields require the dedicated authorization action'
      USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_catalog.jsonb_array_elements(
      coalesce(p_state -> 'productionOrders', '[]'::jsonb)
    ) AS new_order(item)
    WHERE NOT EXISTS (
      SELECT 1
      FROM pg_catalog.jsonb_array_elements(
        coalesce(current_state -> 'productionOrders', '[]'::jsonb)
      ) AS old_order(item)
      WHERE lower(coalesce(old_order.item ->> 'number', ''))
          = lower(coalesce(new_order.item ->> 'number', ''))
    )
      AND (
        new_order.item ->> 'authorizationStatus' = 'Autorizada'
        OR new_order.item -> 'materialSeparated' = 'true'::jsonb
        OR new_order.item -> 'suppliesSeparated' = 'true'::jsonb
        OR new_order.item -> 'productionReleased' = 'true'::jsonb
      )
  ) THEN
    RAISE EXCEPTION 'New production orders cannot start in an authorized state'
      USING ERRCODE = '42501';
  END IF;

  IF profile <> 'admin'
     AND p_state -> 'publicTrackingSettings'
         IS DISTINCT FROM current_state -> 'publicTrackingSettings' THEN
    RAISE EXCEPTION 'Only administrators may change public tracking settings'
      USING ERRCODE = '42501';
  END IF;

  SELECT saved.version
    INTO next_version
    FROM public.save_workspace_state(p_state, p_expected_version) AS saved;
  RETURN next_version;
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.save_workspace_state_guarded(jsonb, bigint)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_workspace_state_guarded(jsonb, bigint)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.authorize_production_order(
  p_number text,
  p_expected_version bigint
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  profile text;
  current_state jsonb;
  current_version bigint;
  target_order jsonb;
  next_orders jsonb;
  next_state jsonb;
  next_version bigint;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  profile := lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', ''));
  IF profile NOT IN ('gestor', 'gerente') THEN
    RAISE EXCEPTION 'PRODUCTION_AUTHORIZATION_FORBIDDEN' USING ERRCODE = '42501';
  END IF;
  IF p_number IS NULL OR pg_catalog.length(pg_catalog.btrim(p_number)) = 0
     OR pg_catalog.length(p_number) > 128 THEN
    RAISE EXCEPTION 'Invalid production order number' USING ERRCODE = '22023';
  END IF;

  SELECT ws.state, ws.version
    INTO current_state, current_version
    FROM public.workspace_state AS ws
    WHERE ws.id = 1
    FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workspace state is not initialized' USING ERRCODE = 'P0002';
  END IF;
  IF p_expected_version IS DISTINCT FROM current_version THEN
    RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001';
  END IF;

  SELECT item
    INTO target_order
    FROM pg_catalog.jsonb_array_elements(
      coalesce(current_state -> 'productionOrders', '[]'::jsonb)
    ) AS orders(item)
    WHERE lower(coalesce(item ->> 'number', '')) = lower(pg_catalog.btrim(p_number))
    LIMIT 1;
  IF target_order IS NULL THEN
    RAISE EXCEPTION 'Production order not found' USING ERRCODE = 'P0002';
  END IF;
  IF target_order ->> 'authorizationStatus' = 'Autorizada'
     OR target_order ->> 'status' IN ('Concluída', 'Cancelada') THEN
    RAISE EXCEPTION 'Production order cannot be authorized in its current state'
      USING ERRCODE = '22023';
  END IF;

  SELECT pg_catalog.jsonb_agg(
    CASE
      WHEN lower(coalesce(item ->> 'number', '')) = lower(pg_catalog.btrim(p_number))
      THEN item || pg_catalog.jsonb_build_object(
        'authorizationStatus', 'Autorizada',
        'materialSeparated', true,
        'suppliesSeparated', true,
        'productionReleased', true,
        'status', 'Em produção'
      )
      ELSE item
    END
    ORDER BY ordinal
  )
    INTO next_orders
    FROM pg_catalog.jsonb_array_elements(
      coalesce(current_state -> 'productionOrders', '[]'::jsonb)
    ) WITH ORDINALITY AS orders(item, ordinal);

  next_state := pg_catalog.jsonb_set(
    current_state,
    ARRAY['productionOrders'],
    coalesce(next_orders, '[]'::jsonb),
    false
  );
  SELECT saved.version
    INTO next_version
    FROM public.save_workspace_state(next_state, p_expected_version) AS saved;
  RETURN next_version;
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.authorize_production_order(text, bigint)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.authorize_production_order(text, bigint)
  TO authenticated;
