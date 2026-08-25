# Validação da correção solicitada no vídeo

A falha identificada estava em `Estoques > Matéria-Prima`: a rota exibia um placeholder mesmo quando havia matéria-prima cadastrada e movimentações vinculadas.

A rota agora renderiza `RawMaterialStockPage`, com cartões de itens cadastrados, saldo total, itens abaixo do mínimo e quantidade de movimentações vinculadas. A tela também mostra a tabela real de materiais, última movimentação por item, situação derivada do saldo e ações para cadastrar matéria-prima ou registrar movimentação.

Na captura desktop em 1280x900, a navegação lateral destaca `Matéria-Prima`, os cartões e o estado vazio aparecem no conteúdo principal e o placeholder genérico foi removido.

Na captura móvel em 390x844, as ações ocupam a largura disponível, os quatro cartões se reorganizam em duas colunas e o estado vazio permanece legível, com botão de cadastro acessível.
