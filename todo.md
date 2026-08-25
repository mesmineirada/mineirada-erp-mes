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

## Autenticação server-side e banco normalizado

| Item | Situação |
|---|---|
| Auditar login legado, OAuth e modelo JSON atual | [ ] |
| Migrar acesso para sessão server-side via OAuth | [ ] |
| Criar tabelas independentes de produtos e matérias-primas | [ ] |
| Criar tabela de movimentações com vínculo ao item e usuário | [ ] |
| Migrar dados compatíveis do workspace JSON | [ ] |
| Conectar telas, testar permissões e publicar | [ ] |

## Pedidos, Painel e seleção de produtos

| Item | Situação |
|---|---|
| Auditar modelos e formulários atuais de pedidos, OPs e Painel | [ ] |
| Adicionar itens com quantidade, valor unitário e total ao pedido | [ ] |
| Permitir edição de pedidos existentes, especialmente rascunhos | [ ] |
| Tornar cards do Painel clicáveis com listagem filtrada de OPs | [ ] |
| Trocar produto da Nova OP por seleção dinâmica de produtos cadastrados | [ ] |
| Validar vínculos, responsividade, testes e build | [ ] |

## Correção de Estoque e Cadastro

| Item | Situação |
|---|---|
| Corrigir a falha de compilação atual | [x] — JSX do modal de pedidos corrigido e tipagem limpa |
| Exibir itens e saldos atuais em Estoque > Matéria-Prima | [x] — listagem, indicadores, saldo e detalhe por item |
| Vincular histórico de entradas e saídas somente ao Estoque/Almoxarifado | [x] — histórico em modal exclusivo do Estoque |
| Manter Cadastro restrito aos dados mestre dos itens | [x] — removidos saldo atual e status operacional do formulário/listagem |
| Validar rotas, testes, responsividade e build | [x] — rotas verificadas, check/test/build e captura desktop aprovados |

## Auditoria de Pedidos, Painel e Nova OP

| Item | Situação |
|---|---|
| Verificar inclusão de itens com quantidade, valor unitário e total | [x] — modal com seleção de produto, quantidade, valor unitário e total calculado |
| Verificar edição de pedidos e itens vinculados | [x] — listagem usa `onEdit` e modal preserva itens/status |
| Verificar cards clicáveis do Painel e listagem filtrada de OPs | [x] — cards navegam para filtros Abertas/Atrasadas e a listagem exibe cliente vinculado |
| Verificar seleção dinâmica de produto no formulário de Nova OP | [x] — dropdown usa produtos cadastrados e preserva registros legados |
| Corrigir pendências e validar testes/build | [x] — `pnpm check`, `pnpm test` e `pnpm build` aprovados |

## Persistência global e produtividade operacional

| Item | Situação |
|---|---|
| Garantir que todo cadastro autenticado seja enviado ao banco compartilhado | [x] — alterações passam pelo workspace central após a hidratação; cache local é fallback |
| Adicionar autocomplete na seleção de produtos | [x] — seleção dinâmica pesquisável por catálogo |
| Habilitar edição rápida de status nas Ordens de Produção | [x] — status editável diretamente na listagem |
| Criar filtro clicável de Pedidos Pendentes no Painel | [x] — card navega para a listagem pendente |
| Validar sincronização entre usuários, testes, build e publicação | [x] — check, testes e build aprovados |

## Auditoria operacional ampliada

| Item | Situação |
|---|---|
| Auditar telas, rotas, estados vazios e operações incompletas | [x] — identificados placeholders de faturamento, câmara fria, etiquetas e custos |
| Habilitar edição rápida de prioridade e prazo nas OPs | [x] — controles inline gravam e auditam alterações |
| Completar filtro clicável de Pedidos Pendentes no Painel | [x] — rota `/pedidos?status=pendentes` filtra corretamente |
| Adicionar autocomplete com busca textual para produtos | [x] — campo reutilizável por código ou nome em pedidos e OPs |
| Corrigir lacunas adicionais e validar persistência, testes e build | [x] — faturamento, pedidos faturados, câmara fria, etiquetas e custos deixaram o placeholder |
