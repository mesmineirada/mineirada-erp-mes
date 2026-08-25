# Mineirada ERP + MES — Réplica navegável

Esta aplicação reproduz a interface operacional do Mineirada ERP + MES observada no projeto de referência. O escopo inclui a tela de login, consulta pública de pedidos, dashboard, menu lateral completo, cadastros, pedidos, estoques, almoxarifado, produção, apontamentos por setor, monitores, rastreabilidade, relatórios, manual de uso, app do operador, usuários e administração.

> **Importante:** esta versão é uma réplica frontend estática. O login e os registros operacionais funcionam localmente no navegador para permitir a navegação e a validação dos fluxos; não há banco de dados, API ou autenticação segura nesta versão. Para operação real com múltiplos usuários, o armazenamento local deve ser substituído por um backend com autenticação e regras de permissão no servidor.

## Executar localmente

```bash
pnpm install
pnpm dev
```

Para verificar tipagem e build de produção:

```bash
pnpm check
pnpm build
```

O preview local do Vite fica disponível na porta `3000`. O projeto usa React, Vite, Wouter, Tailwind 4 e Lucide Icons.

## Contas locais de validação

A réplica frontend está configurada para aceitar as contas abaixo durante a validação local e no GitHub Pages. Como as credenciais ficam no bundle do navegador, esta autenticação **não deve ser usada para dados reais ou produção** sem migração para um backend seguro.

| Usuário | Perfil | Senha |
|---|---|---|
| `SOUSA` | Gestor | `RGMS1234` |
| `KARITA` | Administrador | `12345678` |
| `FELIPE` | Administrador | `12345678` |

## Rotas principais

A especificação completa de telas, menus, perfis, rótulos e operações está em [`MAPEAMENTO_ORIGINAL.md`](./MAPEAMENTO_ORIGINAL.md).

| Área | Rota | Situação |
|---|---|---|
| Login | `/login` | Implementado |
| Consulta pública | `/consulta-pedido` | Implementado |
| Dashboard | `/` | Implementado |
| Manual de uso | `/manual` | Implementado |
| Pedidos | `/pedidos` | Implementado com criação local |
| Almoxarifado | `/almoxarifado/requisicoes` | Implementado com detalhe e baixa local |
| Estoques | `/estoque/visao-geral`, `/estoque/lotes` | Implementado |
| Monitores | `/monitor` e `/monitor/:setor` | Implementado |
| Apontamentos | `/apontamento/:setor` | Implementado com registro local em tela |
| Rastreabilidade | `/rastreabilidade` | Implementado |
| Relatórios | `/relatorios` | Implementado com ações de exportação simuladas |
| App Operador | `/operador` | Implementado |
| Cadastros | `/cadastros/clientes`, `/fornecedores`, `/produtos`, `/materias-primas`, `/maquinas` | CRUD local implementado |
| Usuários | `/admin/usuarios` | Implementado para visualização e modais |
| Módulos auxiliares | `/producao/ordens`, `/qualidade/*`, `/manutencao`, `/custos`, `/auditoria`, `/admin/dados` | Estrutura de navegação e estados de módulo implementados |

## Publicação no GitHub Pages

O arquivo [`/.github/workflows/deploy-github-pages.yml`](./.github/workflows/deploy-github-pages.yml) publica automaticamente a aplicação quando há push na branch `main`. O workflow define a base do Vite com o nome do repositório, copia `index.html` para `404.html` para preservar as rotas client-side e publica o diretório `dist/public`.

No repositório do GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como fonte. Depois, faça o primeiro push para `main`:

```bash
git init
git add .
git commit -m "feat: replica navegavel do Mineirada ERP MES"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

O nome do repositório não deve conter espaços. Se o projeto for servido em domínio próprio ou na raiz de um domínio, o workflow continua funcionando; para execução manual em outro host, use `VITE_BASE_PATH=/`.

## Organização do código

A interface principal está em `client/src/App.tsx`, com componentes reutilizáveis para tabelas, cards de métricas, formulários, modais, navegação e estados. O tema, tokens, responsividade e animações estão em `client/src/index.css`. O servidor Express do template permanece apenas como compatibilidade de build; esta entrega não depende dele para as funções frontend.

## Limitações conhecidas

Os módulos auxiliares cujo fluxo exigiria persistência no banco apresentam a estrutura visual e estados de operação, mas não gravam em um backend. As ações de exportação exibem confirmação local. A autenticação aceita o usuário de validação configurado para esta réplica, porém deve ser migrada para autenticação server-side antes de qualquer uso com dados reais.
