# Auditoria — histórico e confirmações de exclusão

## Escopo

Validação das alterações em Câmara Fria, Auditoria, Ordens de Produção, Movimentações, Qualidade, Manutenção, Pedidos, Requisições, Lotes e CRUD genérico.

## Achados validados

- A Câmara Fria exibe colunas para código, produto, unidade, saldo, temperatura, validade, última movimentação, local e categoria.
- A última movimentação é derivada do histórico real de movimentos vinculados ao produto; quando não há movimento, a tela exibe `—`.
- A Auditoria possui rota/seção dedicada em `/auditoria?view=autorizacoes`, com data, usuário, OP, produto, quantidade, pedido/lote e situação.
- O estado vazio do histórico informa claramente quando ainda não há autorizações registradas.
- O modal compartilhado `useDeleteConfirmation` cobre exclusões de cadastros, pedidos, requisições, lotes, OPs, movimentações, qualidade e manutenção.
- Não restaram chamadas `window.confirm` para exclusão no `App.tsx`.
- A validação móvel em 390×844 mostrou controles legíveis e sem overflow crítico nas rotas testadas; tabelas continuam com rolagem horizontal contextual quando possuem muitas colunas.
- `pnpm check`, `pnpm test` com 15 testes e `pnpm build` foram aprovados.
