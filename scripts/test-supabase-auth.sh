#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

: "${VITE_SUPABASE_URL:?Defina VITE_SUPABASE_URL no ambiente}"
: "${VITE_SUPABASE_ANON_KEY:?Defina VITE_SUPABASE_ANON_KEY no ambiente}"

if [[ ! -t 0 ]]; then
  echo "Execute este script em um terminal interativo; a senha será lida sem eco." >&2
  exit 2
fi

read -r -p "Email de uma conta Supabase Auth autorizada: " SUPABASE_TEST_EMAIL
read -r -s -p "Senha (não será exibida): " SUPABASE_TEST_PASSWORD
printf '\n'
export SUPABASE_TEST_EMAIL SUPABASE_TEST_PASSWORD
trap 'unset SUPABASE_TEST_EMAIL SUPABASE_TEST_PASSWORD' EXIT

node --input-type=module <<'NODE'
import { createClient } from "@supabase/supabase-js";

const client = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

let signedIn = false;
try {
  const { data, error } = await client.auth.signInWithPassword({
    email: process.env.SUPABASE_TEST_EMAIL,
    password: process.env.SUPABASE_TEST_PASSWORD,
  });
  if (error || !data.user) {
    console.error(`Falha no login Supabase Auth${error?.code ? ` (${error.code})` : "."}`);
    process.exitCode = 1;
  } else {
    signedIn = true;
    const { data: row, error: readError } = await client
      .from("workspace_state")
      .select("id,version")
      .eq("id", 1)
      .single();
    if (readError || !row) {
      console.error("Login concluído, mas a leitura RLS foi negada. Confirme app_metadata.profile e as policies/grants.");
      process.exitCode = 1;
    } else {
      console.log("PASS: login Supabase Auth concluído e leitura RLS mínima de workspace_state permitida; nenhum dado operacional foi exibido ou alterado.");
    }
  }
} catch {
  console.error(signedIn ? "Falha na verificação de leitura RLS." : "Não foi possível alcançar o Supabase Auth.");
  process.exitCode = 1;
} finally {
  if (signedIn) await client.auth.signOut().catch(() => {});
}
NODE