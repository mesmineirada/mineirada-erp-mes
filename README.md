# Mineirada ERP + MES

Aplicação web do Mineirada ERP + MES. O frontend é publicado no GitHub Pages; autenticação, leitura e gravação do snapshot operacional usam Supabase Auth e a Data API protegida por RLS. As tabelas normalizadas permanecem sem acesso direto do navegador.

## Requisitos e teste local

Use Node.js 22 e pnpm. Exporte a URL e a chave pública do projeto Supabase no terminal local; não use `service_role` nem `DATABASE_URL` no frontend:

```bash
export VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
export VITE_SUPABASE_ANON_KEY="<anon-ou-publishable-publica>"
bash scripts/validate-github-pages.sh
```

O script instala as dependências travadas, executa `pnpm check`, os testes com segredo descartável de teste, o build estático e verificações do bundle. Para abrir a SPA local como no Pages (sem iniciar o servidor tRPC):

```bash
pnpm exec vite --host 0.0.0.0 --port 5173
```

Abra `http://localhost:5173/login` para testar a interface. Para verificar o login Auth e a leitura RLS sem escrever ou exibir registros, use `bash scripts/test-supabase-auth.sh`; ele solicita email e senha no terminal, sem ecoar a senha, e lê somente `id,version` da linha singleton. Use uma conta existente com `app_metadata.profile` aprovado. Não coloque a senha em arquivos, comandos versionados ou variáveis do build.

A interface principal está em `client/src/App.tsx`; a inicialização do cliente Supabase fica em `client/src/lib/supabase.ts`. O servidor Express/tRPC e os artefatos PostgreSQL/Drizzle permanecem no repositório para usos server-side, mas o bundle do GitHub Pages não os chama.

## Configuração do Supabase

O frontend precisa destas variáveis durante o build:

- `VITE_SUPABASE_URL`: URL do projeto Supabase.
- `VITE_SUPABASE_ANON_KEY`: chave pública `anon` legada ou chave `publishable`.

Esses valores públicos podem estar no bundle porque o banco aplica grants e RLS. **Nunca** coloque uma chave `service_role`/secret ou `DATABASE_URL` em variável `VITE_`, no GitHub Pages, no navegador ou neste repositório. O `.env.example` contém apenas marcadores, não credenciais reais.

Para autenticar, a tela usa email e senha do Supabase Auth. Os usuários precisam ter `app_metadata.profile` atribuído por uma operação administrativa confiável como `admin`, `gestor` ou `gerente`; não use `user_metadata` para autorização. Novos cadastros sem perfil aprovado são recusados. Se este ERP for fechado, desabilite o signup público em **Authentication → Providers → Email** e mantenha a criação de contas apenas por administrador.

A Data API deve estar habilitada para o projeto. A migration `supabase/migrations/20261030121418_pages_supabase_auth_rls.sql` concede `SELECT` somente na linha singleton de `workspace_state` e somente a usuários autenticados com perfil aprovado. Escritas passam por RPC com verificação de versão e perfil. Alterar a autorização de uma OP exige a RPC específica, que valida perfil `gestor`/`gerente` e estado atual da ordem. A consulta pública usa `public_lookup_order`, que retorna somente a projeção de campos configurados; a tabela completa continua inacessível a `anon`.

As tabelas normalizadas seguem com RLS habilitada e sem grants de navegador até existir mapeamento explícito entre Auth UID e os registros de usuário e políticas próprias para cada entidade. Não conceda acesso amplo ao schema nem habilite autoexposição indiscriminada de novas tabelas.

## Configurar o GitHub Pages

O workflow `.github/workflows/deploy-github-pages.yml` publica a branch `main`. Em **Settings → Secrets and variables → Actions → Variables**, crie as variáveis de repositório:

- `VITE_SUPABASE_URL` = URL do projeto.
- `VITE_SUPABASE_ANON_KEY` = chave pública anon/publishable.

Configure também em **Supabase → Authentication → URL Configuration** a `Site URL` e os redirect URLs para a origem/rota do site GitHub Pages, por exemplo `https://mesmineirada.github.io/mineirada-erp-mes/**`. Use somente URLs confiáveis e HTTPS.

Depois de configurar as variáveis e aplicar as migrations pendentes no projeto correto, execute o workflow manualmente ou publique a branch `main`. Esta cópia local não faz push ao GitHub por conta própria. O workflow valida que as duas variáveis estão preenchidas e faz build/deploy automaticamente após o push.

Passos de publicação: (1) configure as duas **Variables** do GitHub; (2) rode `bash scripts/test-supabase-auth.sh` e `bash scripts/validate-github-pages.sh` localmente; (3) revise e envie os arquivos alterados para `main`; (4) acompanhe **Actions → Deploy Mineirada ERP + MES**; (5) teste a URL publicada. Os scripts locais não fazem commit nem push.

## Dados locais e migração

O snapshot remoto Supabase é a fonte canônica. O valor antigo de `localStorage` não é carregado nem enviado automaticamente; permanece no navegador como cópia local recuperável. Antes de migrar dados locais, exporte um backup e revise-o antes de qualquer importação. O cache novo é separado por usuário Supabase e não concede acesso nem define papel.

A página **Administração → Dados e Backup** exporta o snapshot compartilhado atual. Ao restaurar um JSON após o deploy, a aplicação valida o arquivo, pede confirmação porque a ação substitui o workspace de todos os usuários, e só informa sucesso depois da confirmação do Supabase. Outras sessões autenticadas recebem a versão nova na sincronização periódica. Para dados restaurados na versão antiga (localStorage), mantenha o JSON original ou exporte-o novamente nessa instalação antes de atualizar; depois do deploy, importe-o pela página de backup para enviá-lo ao Supabase.

As gravações incluem compare-and-swap por `version`. Em caso de conflito, os dados locais são mantidos e a aplicação avisa que é necessário atualizar/sincronizar antes de continuar. Faça backups periódicos e teste restauração em ambiente separado.

A migração PostgreSQL baseline está em `supabase/migrations/20261029183903_mineirada_postgres_rls_baseline.sql`. A migration de Auth/RLS para Pages está em `supabase/migrations/20261030121418_pages_supabase_auth_rls.sql` e já foi aplicada ao projeto vinculado. Para migrations futuras, instale o Supabase CLI, vincule o projeto (`supabase link --project-ref tcgmsdsvfyqqnepiajsy`) e use `pnpm db:push` após revisar o SQL.

## Áreas principais

Login, consulta pública de pedidos, dashboard, cadastros, pedidos, estoques, almoxarifado, produção, apontamentos por setor, monitores, rastreabilidade, relatórios, manual de uso, auditoria e administração. O sistema mantém seus módulos operacionais atuais; a autorização de produção recebe uma validação adicional no banco.
