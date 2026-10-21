# Testes de rotas e lógica

Os registros abaixo descrevem verificações anteriores da interface e não comprovam conexão com Supabase. O parâmetro `?preview=1` não concede mais sessão privilegiada; o login de produção requer uma conta criada no Supabase Auth.

A revisão responsiva anterior cobriu larguras de 1280px, 768px, 390px e 375px. O menu móvel, a topbar, formulários e modais foram verificados visualmente. A cobertura detalhada de rotas está em [`MAPEAMENTO_ORIGINAL.md`](./MAPEAMENTO_ORIGINAL.md).

## Verificações da integração Supabase

Execute `pnpm check`, `pnpm test` e `pnpm build` depois de configurar `.env.local`. A migration SQL deve ser executada no projeto Supabase, e o deploy do GitHub Pages depende das variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas no repositório. Sem essas etapas, um build local não comprova persistência compartilhada entre contas.

A tela usa Postgres/RLS e deve ser verificada com pelo menos duas contas autorizadas: criar um registro com a primeira conta, aguardar a sincronização e confirmar sua aparição na segunda; testar simultaneamente uma alteração concorrente e confirmar que conflito não substitui silenciosamente o estado mais novo.
