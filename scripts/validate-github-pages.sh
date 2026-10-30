#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

: "${VITE_SUPABASE_URL:?Defina VITE_SUPABASE_URL no ambiente antes de executar}"
: "${VITE_SUPABASE_ANON_KEY:?Defina VITE_SUPABASE_ANON_KEY (chave pública anon/publishable) no ambiente antes de executar}"

case "$VITE_SUPABASE_URL" in
  https://*) ;;
  *) echo "VITE_SUPABASE_URL deve usar HTTPS." >&2; exit 1 ;;
esac

echo "[1/4] Instalando dependências travadas pelo lockfile..."
pnpm install --frozen-lockfile

echo "[2/4] Verificando TypeScript..."
pnpm check

echo "[3/4] Executando testes com valores locais descartáveis..."
env JWT_SECRET="local-only-not-a-production-secret" VITE_APP_ID="mineirada-pages-test" pnpm test

echo "[4/4] Gerando build estático e verificando o bundle..."
pnpm build

node --input-type=module <<'NODE'
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const dir = "dist/public/assets";
const files = readdirSync(dir).filter((name) => name.endsWith(".js"));
if (!files.length) throw new Error("Nenhum bundle JavaScript foi gerado.");
const bundle = files.map((name) => readFileSync(join(dir, name), "utf8")).join("\n");
const required = [
  "signInWithPassword",
  "save_workspace_state_guarded",
  "public_lookup_order",
  "authorize_production_order",
];
const forbidden = ["/api/trpc", "AUTH_USERS", "service_role"];
for (const marker of required) {
  if (!bundle.includes(marker)) throw new Error(`Bundle incompleto: marcador ausente (${marker}).`);
}
for (const marker of forbidden) {
  if (bundle.includes(marker)) throw new Error(`Bundle contém referência não permitida (${marker}).`);
}
console.log("Bundle OK: Auth/RPCs incluídos; tRPC e credenciais estáticas ausentes.");
NODE

echo "Build validado em dist/public. Nenhum push foi feito. Para publicar, faça push da branch main; o GitHub Actions executará o deploy."