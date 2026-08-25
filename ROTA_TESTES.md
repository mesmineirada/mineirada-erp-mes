# Testes de rotas e lógica

A rota `/cadastros/clientes?preview=1` carregou corretamente no preview autenticado. O menu lateral exibiu os módulos e o botão **Novo** abriu o modal de cadastro sem erro de renderização.

Durante a inspeção foi identificado e corrigido um problema de validação: o formulário genérico permitia salvar cadastro sem preencher os campos obrigatórios. A rotina agora bloqueia a gravação e exibe uma notificação global.

Também foi validado que os links do menu possuem cobertura no roteador: 49 rotas declaradas e 49 tratadas.

A compilação TypeScript e o build de produção foram executados com código de saída 0 após as correções.
