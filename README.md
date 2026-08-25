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

## Módulos operacionais implementados

A réplica agora inclui telas navegáveis para **Ordens de Produção**, **Fluxo de Produção**, **Movimentações de Estoque**, **Checklists**, **Não Conformidades**, **Manutenção** e **Auditoria**. Os registros são persistidos no `localStorage`, começam vazios e só alteram os indicadores quando o usuário os cadastra.

As movimentações atualizam o saldo de matéria-prima quando encontram uma ficha pelo código ou nome. Criações e exclusões dos módulos operacionais geram eventos no histórico de auditoria. As telas de cadastro possuem estado de carregamento inicial, validação de campos obrigatórios, botão de salvamento com animação e mensagens de feedback não bloqueantes.

> Esta implementação continua sendo frontend-only. Para uso produtivo, migre credenciais, registros e auditoria para um backend com autenticação segura, controle de concorrência e trilha de auditoria imutável.

## Identidade visual

A interface utiliza o logo Mineirada fornecido pelo cliente no login e na consulta pública, além do símbolo compacto na sidebar e como favicon. Os ativos foram publicados no armazenamento persistente do projeto e referenciados por seus caminhos `/manus-storage/`.

A validação final após a troca da marca foi concluída com `pnpm check` e `pnpm build` sem erros.

## Fluxos integrados e filtros

As listas de Pedidos e Movimentações contam com busca combinada e filtros avançados por status, prioridade, tipo, origem, destino e período. Ordens de produção podem ser relacionadas a pedidos e lotes cadastrados; Qualidade e Manutenção podem apontar OPs e máquinas relacionadas, abrir detalhes, editar registros e baixar os anexos escolhidos pelo usuário.

Os anexos são convertidos para data URL e permanecem no `localStorage` da instalação, acompanhando o backup JSON local. Nenhum registro, anexo, avaliação ou dado operacional é pré-populado pela réplica.

O Dashboard passou a exibir KPIs derivados dos cadastros, percentuais somente quando há base de cálculo e gráficos que permanecem em estado vazio enquanto não houver produção ou movimentações reais.

## Tema escuro e Código QR

O cabeçalho autenticado possui alternância acessível entre modo claro e modo escuro. A preferência é persistida no navegador, respeita o contraste do tema âmbar/carvão e mantém foco visível para navegação por teclado.

Na consulta pública, o usuário pode selecionar uma imagem do Código QR ou abrir a câmera em dispositivos compatíveis. A leitura usa `BarcodeDetector` quando disponível e `jsQR` como fallback para imagens, exibindo estados de análise, sucesso e erro. Depois que um pedido é localizado, o sistema gera um Código QR real para a URL pública correspondente e oferece download em PNG ou SVG. O caminho-base do GitHub Pages é incorporado automaticamente ao código exportado.

## Correção da tela de Estoque de Matéria-Prima

A rota `Estoques > Matéria-Prima` deixou de usar o estado genérico de módulo não implementado. Ela agora lista os registros reais de `data.materials`, calcula o saldo a partir do cadastro atualizado, identifica itens abaixo do mínimo e exibe a última movimentação vinculada por código ou nome do item.

As movimentações registradas em `Almoxarifado > Movimentações` continuam atualizando o campo de estoque do cadastro. A nova tela reflete automaticamente essas alterações, oferece busca e filtro por situação e mantém atalhos para registrar movimentações ou abrir o cadastro da matéria-prima. Nenhum dado demonstrativo foi adicionado.

## Persistência compartilhada entre usuários

O estado operacional da aplicação agora possui uma fonte central em banco de dados na tabela `workspace_state`. A interface mantém o `localStorage` como cache de continuidade, mas consulta o workspace central ao abrir o sistema e envia cada alteração feita por um usuário autenticado no fluxo atual. A sincronização automática ocorre a cada cinco segundos e informa quando uma atualização veio de outro usuário.

A gravação carrega `updatedBy` e `version`. Se a versão local estiver desatualizada, a API rejeita a gravação para evitar sobrescrever alterações mais recentes. A primeira abertura com dados locais compatíveis realiza uma migração única para o banco. A migração inicial usa um estado JSON para preservar os módulos existentes; tabelas normalizadas de produtos, matérias-primas e movimentações podem ser extraídas em uma próxima etapa sem interromper o funcionamento atual.

A infraestrutura full-stack foi habilitada com Drizzle, tRPC, React Query e autenticação do template. O fluxo de credenciais legadas da réplica permanece compatível no navegador; para produção com controle de acesso server-side, o próximo passo recomendado é migrar os usuários SOUSA, KARITA e FELIPE para o provedor de autenticação do backend ou para uma tabela de contas com senha armazenada de forma segura.
