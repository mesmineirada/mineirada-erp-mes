-- Keep the legacy user catalog in the database without storing plaintext passwords.
-- Supabase Auth remains the browser authentication authority; these rows preserve
-- the username/profile mapping used by trusted server-side paths.
INSERT INTO public.users (
  open_id, username, password_hash, profile, name, email, login_method, role
)
VALUES
  (
    'legacy:SOUSA', 'SOUSA',
    'scrypt$cc1f54b4caaa0c9f6d89c83b613129d1$deed49351800647451b5d844964d8bdf0b7c60800d607511724c8db38e3305504ecc67384d5b3b61107c67fb8fb54462a548d45b4e89b5dd3e900f1fbfe91cdd',
    'gestor', 'Sousa', 'sousa@mineirada.local', 'supabase_auth', 'admin'
  ),
  (
    'legacy:FELIPE', 'FELIPE',
    'scrypt$7bbafecfcbd184cea465d412c47fdb0c$7258231b425921da50464f93dedf0c2935809ce3874d1afae2d9ba8e5cfc11e158d1e0a9fdc547139f19bcbf9b8faec1934ba9f716ef9020ae556f5efb80462f',
    'admin', 'Felipe', 'felipe@mineirada.local', 'supabase_auth', 'admin'
  ),
  (
    'legacy:KARITA', 'KARITA',
    'scrypt$ce02a2dcc507b59689873109f0186290$8012ecfe26d7c0f53a62a5c6020521e0e19d3781bd570de5df54a28c154501571d02ee045b6c44a21b387f17f230681977cc66a460562f1171d1d38c0f5a9f53',
    'admin', 'Karita', 'karita@mineirada.local', 'supabase_auth', 'admin'
  )
ON CONFLICT (open_id) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  profile = EXCLUDED.profile,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  login_method = EXCLUDED.login_method,
  role = EXCLUDED.role,
  updated_at = now();
