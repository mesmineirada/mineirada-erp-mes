# Fechamento da réplica Mineirada ERP/MES

| Item | Situação |
|---|---|
| Aplicar logo e marca no login, sidebar e favicon | [x] |
| Cobrir rotas e shell responsivo desktop/mobile | [x] |
| Implementar CRUD local de Ordens, Movimentações, Qualidade, Manutenção e Auditoria | [x] |
| Adicionar edição detalhada e anexos locais em Qualidade e Manutenção | [x] |
| Criar dashboard com KPIs derivados e gráficos de produção/estoque | [x] |
| Implementar filtros avançados em Pedidos e Movimentações | [x] |
| Integrar vínculos entre OP, pedido, lote, máquina e registros operacionais | [x] |
| Validar `pnpm check`, `pnpm build` e capturas desktop/mobile | [x] |
| Salvar checkpoint final para entrega | [x] |

## Revisão de idioma

| Item | Situação |
|---|---|
| Auditar textos visíveis em inglês | [x] |
| Traduzir interface, mensagens e estados para português | [x] |
| Validar telas e build após a tradução | [x] |

## Tema escuro e Código QR

| Item | Situação |
|---|---|
| Auditar tema e fluxo atual de Código QR | [x] |
| Implementar alternância acessível de modo escuro | [x] |
| Adicionar carregamento e feedback visual para gerar/escanear QR | [x] |
| Exportar Código QR como PNG e SVG | [x] |
| Validar responsividade, acessibilidade e build | [x] |

## Correção solicitada em vídeo

| Item | Situação |
|---|---|
| Analisar o vídeo enviado e identificar o problema | [x] — Estoques > Matéria-Prima permanece vazio apesar de cadastro e movimentação |
| Localizar o fluxo correspondente no projeto | [x] — rota `/estoque/materia-prima` estava usando placeholder |
| Implementar a correção solicitada | [x] — listagem integrada de materiais, saldos, mínimos e movimentações |
| Validar responsividade, build e publicação | [x] — desktop/mobile, `pnpm check` e `pnpm build` aprovados |

## Dados compartilhados entre usuários

| Item | Situação |
|---|---|
| Auditar persistência local e pontos de leitura/gravação | [x] |
| Preparar banco central e autenticação compartilhada | [x] — banco central preparado; autenticação server-side completa permanece como próxima etapa |
| Migrar módulos para leitura e gravação centralizadas | [x] — estado operacional sincronizado via workspace tRPC |
| Adicionar sincronização, feedback e compatibilidade com dados locais | [x] |
| Validar acesso entre usuários e publicar | [x] — check, testes, build e tabela central verificados; teste multiusuário real depende de sessões server-side |

## Auditoria de separação entre Cadastro e Estoque

| Item | Situação |
|---|---|
| Auditar conflitos da atualização full-stack e persistência atual | [ ] |
| Separar dados mestre de produtos/matérias-primas dos movimentos de estoque | [ ] |
| Vincular movimentações a item, saldo e histórico no módulo de Estoque | [ ] |
| Auditar padrões semelhantes em clientes, fornecedores, pedidos e extratos | [ ] |
| Validar rotas, testes, responsividade e publicação | [ ] |

## Persistência real compartilhada — execução autorizada

| Item | Situação |
|---|---|
| Definir tabelas compartilhadas e vínculos com usuários | [x] — tabela `workspace_state` com versão e usuário responsável |
| Criar e aplicar migração do banco | [x] — migração gerada, revisada e criação não destrutiva aplicada |
| Implementar consultas e mutations compartilhadas | [x] — procedures tRPC de leitura e gravação com controle de versão |
| Conectar telas e sincronizar sessões | [x] — React Query, sincronização periódica e cache local de compatibilidade |
| Testar dados entre SOUSA, KARITA e FELIPE e publicar | [x] — `pnpm check`, `pnpm test`, `pnpm build` e consulta real da tabela aprovados |
