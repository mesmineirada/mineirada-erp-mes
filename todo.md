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
| Salvar checkpoint final para entrega | [ ] |

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
