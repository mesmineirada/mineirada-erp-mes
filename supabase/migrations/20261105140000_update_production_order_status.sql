CREATE OR REPLACE FUNCTION public.update_production_order_status(
  p_number text,
  p_status text,
  p_expected_version bigint
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  profile text;
  current_version bigint;
  next_version bigint;
  updated_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  profile := lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', ''));
  IF profile NOT IN ('admin', 'gestor', 'gerente') THEN
    RAISE EXCEPTION 'WORKSPACE_ROLE_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  IF nullif(pg_catalog.btrim(coalesce(p_number, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Production order number is required' USING ERRCODE = '22023';
  END IF;
  IF p_status NOT IN ('Planejada', 'Em produção', 'Concluída', 'Pausada', 'Cancelada') THEN
    RAISE EXCEPTION 'Invalid production order status' USING ERRCODE = '22023';
  END IF;
  IF p_expected_version IS NULL OR p_expected_version < 0 THEN
    RAISE EXCEPTION 'Expected version must be zero or greater' USING ERRCODE = '22023';
  END IF;

  SELECT version
    INTO current_version
    FROM public.workspace_state
    WHERE id = 1
    FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workspace state is not initialized' USING ERRCODE = 'P0002';
  END IF;
  IF p_expected_version IS DISTINCT FROM current_version THEN
    RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001';
  END IF;

  UPDATE public.workspace_state
  SET state = pg_catalog.jsonb_set(
    state,
    '{productionOrders}',
    (
      SELECT coalesce(
        pg_catalog.jsonb_agg(
          CASE
            WHEN lower(coalesce(item ->> 'number', '')) = lower(p_number)
              THEN pg_catalog.jsonb_set(item, '{status}', pg_catalog.to_jsonb(p_status), true)
            ELSE item
          END
          ORDER BY ordinal
        ),
        '[]'::jsonb
      )
      FROM pg_catalog.jsonb_array_elements(coalesce(state -> 'productionOrders', '[]'::jsonb))
        WITH ORDINALITY AS orders(item, ordinal)
    ),
    true
  ),
  version = version + 1,
  updated_by = coalesce(auth.jwt() ->> 'email', auth.uid()::text),
  updated_at = now()
  WHERE id = 1
    AND version = p_expected_version
    AND EXISTS (
      SELECT 1
      FROM pg_catalog.jsonb_array_elements(coalesce(state -> 'productionOrders', '[]'::jsonb)) AS orders(item)
      WHERE lower(coalesce(item ->> 'number', '')) = lower(p_number)
    );

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count = 0 THEN
    IF EXISTS (SELECT 1 FROM public.workspace_state WHERE id = 1 AND version <> p_expected_version) THEN
      RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001';
    END IF;
    RAISE EXCEPTION 'Production order not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT version INTO next_version FROM public.workspace_state WHERE id = 1;
  RETURN next_version;
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.update_production_order_status(text, text, bigint)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_production_order_status(text, text, bigint)
  TO authenticated;
