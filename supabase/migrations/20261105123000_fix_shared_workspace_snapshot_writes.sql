CREATE OR REPLACE FUNCTION public.save_workspace_state(
  p_state jsonb,
  p_expected_version bigint
)
RETURNS TABLE(version bigint, updated_by text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  saved_version bigint;
  actor text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  IF p_state IS NULL OR pg_catalog.jsonb_typeof(p_state) <> 'object' THEN RAISE EXCEPTION 'Workspace state must be a JSON object' USING ERRCODE = '22023'; END IF;
  IF p_expected_version IS NULL OR p_expected_version < 0 THEN RAISE EXCEPTION 'Expected version must be zero or greater' USING ERRCODE = '22023'; END IF;
  actor := coalesce(auth.jwt() ->> 'email', auth.uid()::text);
  INSERT INTO public.workspace_state AS current_state (id, state, version, updated_by, updated_at)
  VALUES (1, p_state, 1, actor, now())
  ON CONFLICT (id) DO UPDATE
    SET state = excluded.state, version = current_state.version + 1, updated_by = actor, updated_at = now()
    WHERE current_state.version = p_expected_version
  RETURNING current_state.version, current_state.updated_by INTO saved_version, actor;
  IF NOT FOUND THEN RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001'; END IF;
  RETURN QUERY SELECT saved_version, actor;
END;
$function$;

CREATE OR REPLACE FUNCTION public.save_workspace_state_guarded(p_state jsonb, p_expected_version bigint)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE profile text; current_version bigint; next_version bigint;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  profile := lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'profile', ''));
  IF profile NOT IN ('admin', 'gestor', 'gerente') THEN RAISE EXCEPTION 'WORKSPACE_ROLE_FORBIDDEN' USING ERRCODE = '42501'; END IF;
  IF p_state IS NULL OR pg_catalog.jsonb_typeof(p_state) <> 'object' THEN RAISE EXCEPTION 'Invalid workspace state' USING ERRCODE = '22023'; END IF;
  SELECT version INTO current_version FROM public.workspace_state WHERE id = 1 FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workspace state is not initialized' USING ERRCODE = 'P0002'; END IF;
  IF p_expected_version IS DISTINCT FROM current_version THEN RAISE EXCEPTION 'WORKSPACE_VERSION_CONFLICT' USING ERRCODE = '40001'; END IF;
  SELECT saved.version INTO next_version FROM public.save_workspace_state(p_state, p_expected_version) AS saved;
  RETURN next_version;
END;
$function$;
