# Achados visuais da auditoria

As rotas de Visão Geral de Estoques, Estoque de Matéria-Prima, Câmara Fria, Requisições de MP e Ordens de Produção foram verificadas em 1280×900 e 390×844.

A navegação responsiva não apresenta telas vazias indevidas: estados sem registros exibem orientação e atalhos de cadastro. Câmara Fria apresenta busca, ordenação e ações de entrada/cadastro. Matéria-prima apresenta saldo, filtros e ordenação. Requisições mantém busca, filtro e ação de nova requisição. A tabela de OP utiliza rolagem horizontal contextual em mobile para preservar colunas operacionais.

Foi corrigido o caso em que produto acabado localizado em Câmara Fria não aparecia sem parâmetros de temperatura/validade; agora a localização operacional também inclui o item. Saldos de matéria-prima priorizam o saldo corrente atualizado pelo lançamento e usam o histórico como fallback, evitando dupla contagem.
