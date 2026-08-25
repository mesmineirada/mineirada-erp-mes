# Testes de rotas e lógica

A rota `/cadastros/clientes?preview=1` carregou corretamente no preview autenticado. O menu lateral exibiu os módulos e o botão **Novo** abriu o modal de cadastro sem erro de renderização.

Durante a inspeção foi identificado e corrigido um problema de validação: o formulário genérico permitia salvar cadastro sem preencher os campos obrigatórios. A rotina agora bloqueia a gravação e exibe uma notificação global.

Também foi validado que os links do menu possuem cobertura no roteador: 49 rotas declaradas e 49 tratadas.

A compilação TypeScript e o build de produção foram executados com código de saída 0 após as correções.

## Nova validação dos módulos pendentes

A rota `/producao/ordens?preview=1` carregou com estado vazio, filtros e contador. O botão **Nova OP** abriu o modal com número de OP, produto, quantidade, entrega, prioridade, status e observações. A ação de salvar valida produto e quantidade maior que zero.

Os módulos de fluxo, movimentações, checklists, não conformidades, manutenção e auditoria foram conectados ao roteador e deixaram de usar `PlaceholderPage`. Os estados iniciais continuam vazios e os registros criados localmente alimentam os indicadores e o histórico de auditoria.

A validação manual também confirmou que o formulário aceita produto e quantidade positiva sem erros de renderização. O fluxo está pronto para testar o salvamento e a persistência local.

O teste manual criou uma ordem local com sucesso: a tabela passou de 0 para 1 ordem e exibiu a OP, produto, quantidade, prioridade e status. O feedback de sucesso apareceu no preview e o estado foi persistido no navegador.

## Revisão responsiva

As telas críticas foram capturadas em 1280px, 768px, 390px e 375px. Em dispositivos móveis, a sidebar transforma-se em menu lateral, a topbar reduz o conteúdo, os botões ocupam a largura disponível, os filtros empilham, os modais respeitam a altura da viewport e os estados vazios não exibem mais cabeçalhos horizontais recortados. O cadastro de clientes foi aberto manualmente e o modal apresentou campos e ações sem overflow no preview.
