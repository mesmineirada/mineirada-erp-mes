# Mineirada ERP + MES

Interface web estática publicada no GitHub Pages, com autenticação e armazenamento compartilhado no Supabase. Os registros operacionais não ficam mais limitados ao navegador de quem os cadastrou.

## Arquitetura

- **Frontend:** React + Vite, publicado automaticamente em GitHub Pages pela GitHub Actions.
- **Autenticação e banco:** Supabase Auth + Postgres. O frontend usa `@supabase/supabase-js` e recebe somente a URL do projeto e uma chave publicável/anon.
- **Dados:** a migração `supabase/migrations/20261021_shared_workspace.sql` cria um workspace JSONB compartilhado. O acesso de leitura e gravação exige sessão autenticada; a função de gravação usa controle de versão para detectar edições concorrentes e valida o perfil gerencial nas mudanças de autorização de OP.
- **Sincronização:** cada navegador consulta o estado central ao entrar e verifica alterações a cada 5 segundos. `localStorage` é apenas cache/recuperação offline; não é a fonte compartilhada.

Todos os usuários autenticados enxergam o mesmo workspace. Os papéis ainda controlam principalmente a interface; fora das ações explicitamente validadas pela função SQL, não há permissões granulares por módulo/registro. Crie contas somente para pessoas autorizadas a consultar e editar os dados operacionais.

## Configuração inicial do Supabase

1. Crie um projeto no [Supabase Dashboard](https://supabase.com/dashboard) e aguarde o Postgres ficar disponível.
2. No **SQL Editor** do projeto, execute o arquivo [`supabase/migrations/20261021_shared_workspace.sql`](./supabase/migrations/20261021_shared_workspace.sql) uma única vez. Isso cria a tabela, habilita RLS e concede leitura apenas a usuários autenticados; gravações passam pela função SQL autenticada.
3. Em **Authentication → Sign In / Providers → Email**, desative a criação pública de contas. Depois, em **Authentication → Users**, crie/convide as contas de cada usuário autorizado. Não habilite cadastro aberto para este ERP.
4. Atribua o perfil pelo campo protegido `app_metadata.profile`, não por `user_metadata`. No SQL Editor, depois de criar o usuário, execute uma instrução por conta substituindo o e-mail e perfil:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
       || jsonb_build_object('profile', 'gestor')
   where email = lower('gestor@empresa.com');
   ```

   Perfis aceitos na interface: `gestor`, `admin`, `gerente`, `operador`, `qualidade`, `manutencao` e `user`. Para autorizar OP, use `gestor` ou `gerente`. Após alterar o perfil, a pessoa deve sair e entrar novamente para renovar a sessão.
5. Em **Authentication → URL Configuration**, defina a Site URL e adicione às Redirect URLs a URL real do GitHub Pages, normalmente `https://<organização>.github.io/<nome-do-repositório>/`. Confirme o endereço em **Settings → Pages** do repositório.
6. Em **Project Settings → API** (ou no diálogo **Connect**), copie a **Project URL** e a chave **publishable** (em projetos antigos, `anon`). Nunca use `service_role` ou qualquer secret key no frontend.

## Configurar o deploy pelo GitHub

No repositório, abra **Settings → Secrets and variables → Actions → Variables** e crie:

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Project URL, por exemplo `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave **publishable** ou antiga `anon` do Supabase |

A chave publicável será incorporada ao JavaScript entregue ao navegador. Isso é esperado: a proteção vem do RLS e das políticas SQL, não do segredo dessa chave. **Não configure `service_role` em `VITE_*`, em GitHub Pages, neste repositório ou em variáveis acessíveis ao browser.** O workflow falha claramente se as duas variáveis não estiverem definidas.

Em **Settings → Pages**, selecione **GitHub Actions** como fonte. Push na branch `main` dispara build, verificação TypeScript e deploy. Para executar localmente, copie `.env.example` para `.env.local`, preencha os mesmos dois valores publicáveis e rode:

```bash
pnpm install
pnpm dev
```

Verificações disponíveis:

```bash
pnpm check
pnpm test
pnpm build
```

## Dados que já estavam nos navegadores

Antes desta integração, cada navegador podia guardar seu próprio estado local; esses dados não eram compartilhados entre usuários. Se o workspace Supabase estiver vazio, o primeiro acesso autenticado pode migrar o cache local existente. Se já houver um workspace central diferente, o app prioriza o banco compartilhado e guarda uma cópia de recuperação do cache divergente naquele navegador. Abra **Administração → Dados e Backup** para exportar/importar backups JSON. Se mais de um computador tiver registros locais independentes, revise e combine esses dados antes de restaurar, pois a restauração substitui o estado compartilhado para todos.

## Rotas e recursos

A especificação de telas e fluxos está em [`MAPEAMENTO_ORIGINAL.md`](./MAPEAMENTO_ORIGINAL.md). O projeto inclui login, consulta pública de pedidos, dashboard, cadastros, estoque, almoxarifado, ordens e apontamentos de produção, rastreabilidade, relatórios, qualidade, manutenção, auditoria, perfis e exportação/restauração de backup.

## Observações de segurança

As antigas senhas de demonstração foram removidas do código atual e o fallback de login local deixou de existir. Como o repositório é público, essas strings ainda podem aparecer em commits históricos. Se alguma senha antiga tiver sido reutilizada em outro sistema, troque-a imediatamente. Use senhas únicas nas contas Supabase e restrinja as variáveis do projeto.

O esquema inicial guarda os módulos num documento JSONB único para manter compatibilidade com a interface existente. Para controle mais detalhado por setor/registro, trilha de auditoria rigorosa, anexos grandes ou muitas gravações simultâneas, evolua depois para tabelas normalizadas e permissões de banco específicas.
