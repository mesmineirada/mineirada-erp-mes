-- Keep the raw-material master unit aligned with the BOM and historical stock movements.
-- The recipe consumes PODIUM 2600 in SACO, so the material must use SACO too.
UPDATE public.workspace_state
SET state = jsonb_set(
  jsonb_set(
    state,
    '{materials}',
    (
      SELECT jsonb_agg(
        CASE WHEN material->>'code' = '001'
          THEN material || jsonb_build_object('unit', 'SACO')
          ELSE material
        END
      )
      FROM jsonb_array_elements(COALESCE(state->'materials', '[]'::jsonb)) AS material
    )
  ),
  '{recipes}',
  (
    SELECT jsonb_agg(
      CASE WHEN recipe->>'code' = '001'
        THEN recipe || jsonb_build_object(
          'product', 'PÃO DE QUEIJO MINEIRADA 1KG',
          'productName', 'PÃO DE QUEIJO MINEIRADA 1KG'
        )
        ELSE recipe
      END
    )
    FROM jsonb_array_elements(COALESCE(state->'recipes', '[]'::jsonb)) AS recipe
  )
),
version = version + 1,
updated_at = now()
WHERE id = 1;
