# Mapeamento do Mineirada ERP/MES

## Escopo e método

O sistema foi acessado em `https://mineiradasys.lovable.app` com o fluxo de login fornecido. A tela inicial e a consulta pública foram observadas visualmente; os módulos públicos do bundle do projeto foram analisados para levantar rotas, rótulos, campos, estados, perfis e ações. O login do ambiente original permaneceu em `Entrando...` durante a inspeção, portanto a réplica reproduzirá o comportamento visual e os fluxos identificados com dados locais navegáveis, sem depender do backend original.

## Identidade visual observada

A aplicação usa base clara e quente, próxima de `oklch(98% .008 70)`, texto carvão e acento laranja/âmbar industrial, próximo de `oklch(50% .16 42)` / `oklch(58% .17 42)`. A interface autenticada usa uma barra lateral escura em marrom-carvão, próxima de `oklch(20% .018 45)` a `oklch(22% .02 45)`, com itens claros e item ativo preenchido pelo âmbar primário. O layout é responsivo, com sidebar persistente no desktop e navegação recolhível em telas menores. Cards têm bordas suaves, raio moderado, sombras discretas e hierarquia baseada em fundo, cor e espaçamento; tabelas usam cabeçalho `bg-muted/30`, tipografia pequena e códigos em fonte monoespaçada. Ícones são lineares, no estilo Lucide. A tela de login é centralizada, com logotipo quadrado âmbar contendo símbolo de fábrica, título `Mineirada ERP + MES`, subtítulo `Sistema Industrial de Gestão`, card compacto, campos com ícones, botão âmbar e expansor de consulta pública.

## Rotas e hierarquia do menu

- Dashboard — `/`
- Manual de uso — `/manual`
- Cadastros
  - Matérias-primas — `/cadastros/materias-primas`
  - Suprimentos — `/cadastros/embalagens`
  - Fornecedores — `/cadastros/fornecedores`
  - Clientes — `/cadastros/clientes`
  - Funcionários — `/cadastros/funcionarios`
  - Máquinas — `/cadastros/maquinas`
  - Produtos — `/cadastros/produtos`
- Almoxarifado
  - Visão Geral — `/estoque`
  - Requisições de MP — `/almoxarifado/requisicoes`
  - Movimentações — `/estoque/movimentacoes`
  - Lotes — `/estoque/lotes`
- Estoques
  - Visão Geral — `/estoque/visao-geral`
  - Matéria-Prima — `/estoque/materia-prima`
  - Câmara Fria — `/estoque/acabado`
  - Embalagens — `/estoque/embalagens`
- Engenharia
  - Receitas / BOM — `/engenharia/receitas`
- Pedidos — `/pedidos`
- Vendas
  - Faturamento — `/vendas/faturamento`
  - Pedidos Faturados — `/vendas/pedidos-faturados`
- Etiquetas — `/etiquetas`
- Produção
  - Ordens de Produção — `/producao/ordens`
  - Fluxo por OP — `/producao/fluxo`
  - Monitor Geral — `/monitor`
- Apontamento
  - Separação MP — `/apontamento/separacao_mp`
  - Cozinha — `/apontamento/cozinha`
  - Corte — `/apontamento/corte`
  - Túnel — `/apontamento/tunel`
  - Envasadora — `/apontamento/envasadora`
  - Câmara Fria — `/apontamento/camara_fria`
  - Expedição — `/apontamento/expedicao`
- Monitores
  - Produção Completa — `/monitor`
  - Separação MP — `/monitor/separacao_mp`
  - Cozinha — `/monitor/cozinha`
  - Corte — `/monitor/corte`
  - Túnel — `/monitor/tunel`
  - Envasadora — `/monitor/envasadora`
  - Câmara Fria — `/monitor/camara_fria`
  - Expedição — `/monitor/expedicao`
- Qualidade
  - Checklists — `/qualidade/checklists`
  - Não Conformidades — `/qualidade/nao-conformidades`
- Manutenção — `/manutencao`
- Custos — `/custos`
- Relatórios — `/relatorios`
- Rastreabilidade — `/rastreabilidade`
- Auditoria — `/auditoria` (somente admin)
- App Operador — `/operador`
- Usuários — `/admin/usuarios` (somente gestor/admin)
- Administração
  - Dados e Backup — `/admin/dados` (somente gestor/admin)

O menu autenticado também exibe o perfil do usuário, conta ativa, acesso ao Manual do sistema, ação `Sair do sistema`, tema claro/escuro e badge numérico para requisições pendentes. Grupos com filhos expandem/recolhem; o grupo da rota atual abre automaticamente; o item atual usa fundo primário da sidebar.

## Perfis e permissões

| Perfil | Nome visual | Escopo observado |
|---|---|---|
| gestor | Gestor | Acesso completo, incluindo usuários, senhas, perfis e carregamento de dados iniciais |
| admin | Administrador | Acesso completo aos módulos, sem gerenciamento de usuários |
| gerente | Gerente | Visualiza módulos, aprova OPs e emite relatórios |
| operador | Operador | Fluxo de produção, etapas e lotes |
| qualidade | Qualidade | Checklists, não conformidades e liberação de lotes |
| manutencao | Manutenção | Cria e fecha ordens de manutenção |
| user | Consulta | Acesso somente leitura |

## Telas públicas

### Login — `/login`

Exibe logo/fábrica, título, subtítulo, campos `Usuário` e `Senha`, alternância de visibilidade da senha, botão `Entrar`, painel expansível `Consultar pedido sem login`, nota `Acesso liberado apenas para usuários cadastrados no sistema.` e orientação `Esqueceu a senha? Procure o gestor.`. O login usa os estados `Entrando...`, mensagem de credencial inválida e armazenamento de sessão/perfil.

### Consulta pública — expansor da tela de login

Campos `Seu nome *`, `Número do pedido ou conteúdo do QR Code`, botão de imagem `QR por imagem` / `Ler QR`, botão `Consultar pedido`. Permite leitura de QR, valida nome e pedido, mostra `Pedido não localizado` ou o cartão `Pedido localizado` com número, status, localização atual, previsão de entrega e andamento da produção por etapas.

### Rastreamento público — `/consulta-pedido/:orderNumber`

Cabeçalho `Mineirada ERP + MES`, subtítulo `Acompanhamento público de pedido`, consulta/rastreamento e link `Voltar para o login`.

## Dashboard — `/`

Cabeçalho `Dashboard`, subtítulo `Visão geral da produção em tempo real · atualiza a cada 30s`, atalho `Requisições` com badge e, para gestor/admin, `Carregar Dados Iniciais`. KPIs: `OPs Abertas`, `OPs Atrasadas`, `Produção Hoje`, `Pedidos Pend.`, `Alertas Estoque`, `OMs Abertas`. Indicadores percentuais: `OEE`, `Disponibilidade`, `Performance`, `Qualidade`. Gráficos: `Produção Semanal — saída expedição (kg)` e perdas por setor. Tabelas/cartões: `Ordens de Produção Recentes`, alertas/requisições e estados vazios.

## Cadastros

### Clientes — `/cadastros/clientes`

Listagem com contador de registros, busca, botão `Novo`, tabela `Código`, `Nome`, `CNPJ`, `Telefone`, `Cidade`, `Limite Crédito`, paginação. Formulário: Código*, Nome*, E-mail, Endereço, Cidade, Estado, Contato, Limite de Crédito e Observações. Ações: criar, editar, salvar, cancelar, excluir com confirmação de exclusão lógica. Mensagens: `Cliente criado!`, `Atualizado!`, `Removido!`.

### Fornecedores — `/cadastros/fornecedores`

Listagem com busca, botão `Nova`, colunas `Código`, `Nome`, `CNPJ`, `Telefone`, `Cidade`, `Contato`, paginação. Formulário com Código*, CNPJ, Razão Social/Nome*, Telefone, E-mail, Endereço, Cidade, Estado, Contato e Observações. Ações de CRUD e confirmação de exclusão lógica.

### Produtos — `/cadastros/produtos`

Listagem com busca, botão `Novo`, colunas `Código`, `Nome`, `Categoria`, `Unidade`, `Preço Venda`, `Validade`, `Temp. Armazenamento`, paginação. Formulário: Código*, Unidade*, Nome*, Preço de Venda, Peso Bruto, Peso Líquido, Validade, Temperatura de Armazenamento e Descrição.

### Matérias-primas — `/cadastros/materias-primas`

Listagem com busca, colunas `Código`, `Nome`, `Categoria`, `Unidade`, `Custo Unit.`, `Estoque Atual`, `Estoque Mín.`, `Status`; status `Baixo` quando abaixo do mínimo. Formulário: Código*, Unidade*, Nome*, Categoria, Custo Unitário, Estoque Mínimo, Validade, EAN (GTIN), Temperatura de Armazenamento e Observações.

### Suprimentos/embalagens — `/cadastros/embalagens` e `/estoque/embalagens`

Cadastro rápido no hub de estoques com tipos `Plástico`, `Caixa`, `Saco`, `Filme`, `Bandeja`, `Bobina`, `Rótulo`, `Fita`, `Outro`; unidades `un`, `kg`, `rolo`, `milheiro`. Campos: nome*, código, tipo*, tamanho/medida, categoria, unidade*, preço de venda, custo unitário, validade, estoque mínimo, temperatura de armazenagem e observações.

### Máquinas — `/cadastros/maquinas`

Listagem com busca e filtro de status `Operacional`, `Manutenção`, `Parada`, `Inativa`; colunas `Código`, `Nome`, `Setor`, `Marca/Modelo`, `Potência`, `Status`. Formulário: Código*, Nome*, Marca, Modelo, Nº de Série, Potência (kW), Intervalo Manutenção (dias) e Observações.

### Funcionários — `/cadastros/funcionarios`

Rota presente no menu; a interface deve seguir o padrão de cadastro/listagem do sistema, com busca, novo registro, edição, exclusão lógica e campos de identificação, setor e função.

## Pedidos e vendas

### Pedidos — `/pedidos`

Listagem com busca, filtro de status `Todos`, `Rascunho`, `Confirmado`, `Em Produção`, `Pronto`, `Expedido`, `Cancelado`; colunas `Número`, `Cliente`, `Entrega`, `Prioridade`, `Valor Total`, `Status`, edição e paginação. Formulário `Novo Pedido`: Cliente*, prioridade `Baixa`, `Normal`, `Alta`, `Urgente`, Data de Entrega, itens do pedido com Produto, Quantidade e Preço Unit., remoção de item, Observações, total e ações `Cancelar` / `Criar Pedido`. Mensagens: `Pedido criado!`, `Status atualizado!`, `Pedido atualizado!`, `Removido!`, validações de cliente e item.

### Faturamento — `/vendas/faturamento`

Tela em construção observada, com título `Faturamento`, busca `Buscar pedido...` e texto `Em construção: Lista de pedidos prontos para faturar...`.

### Pedidos faturados — `/vendas/pedidos-faturados`

Rota presente no menu; reproduzir listagem de pedidos faturados integrada ao fluxo de vendas, com busca, status e tabela coerentes com Pedidos.

## Almoxarifado e estoques

### Visão geral do almoxarifado — `/estoque`

Título `Estoque de Matéria-Prima`, subtítulo `Visão geral e alertas`. Cards `Total de Itens` e `Abaixo do Mínimo`. Ação rápida `Registrar movimentação`. Bloco `Alertas de Estoque Baixo` com tabela `Código`, `Nome`, `Categoria`, `Unidade`, `Estoque Atual`, `Estoque Mínimo`, `Déficit`.

### Hub de estoques — `/estoque/visao-geral`

Título `Estoques`, subtítulo `Gerencie de forma completa matérias-primas, produtos acabados e suprimentos. Cadastros integrados com EAN, NCM e pesos.`. CTA `Cadastrar produto acabado (câmara fria)`. Cards `Matérias-primas`, `Produto Acabado`, `Suprimentos`, com descrições e contadores. Lista de fichas por estoque. Bloco `Últimas movimentações entre setores`, colunas `Item`, `Tipo`, `Quantidade`, `Observação`, `Data`.

### Ficha de estoque — `/estoques/:code`

Cabeçalho do setor com total, responsável e temperatura; ações `Editar setor`, `Transferir`, `Nova ficha`. Tabela `Fichas de estoque` com `Item`, `Lote`, `Validade`, `Local`, `Situação`, `Ações`. Bloco `Movimentações do setor`. Formulário de ficha: item cadastrado ou avulso, quantidade, unidade, data, descrição, responsável, temperatura e capacidade. Modal de transferência: origem, destino*, item*, quantidade.

### Requisições — `/almoxarifado/requisicoes`

Título `Almoxarifado — Requisições de Materiais`, subtítulo `Geradas automaticamente a cada Ordem de Produção, com as quantidades da receita`, botão `em aberto`, busca `Buscar por requisição ou OP...`, filtros `Todas`, `Pendentes`, `Parciais`, `Atendidas`, `Canceladas`. Tabela `Requisição`, `Produto`, `Qtd Planejada`, `Situação`, `Criada em`, paginação. Detalhe mostra OP, lote, autorização, itens, necessário/separado/estoque, edição de quantidade, `Adicionar item`, `Separado`, `Baixar`, `Cancelar requisição`, `Separar tudo`, confirmação de exclusão e `Autorizar OP` quando bloqueada. Estados `Pendente`, `Parcial`, `Atendida`, `Cancelada`; mensagens de separação parcial, atendimento e autorização.

### Lotes — `/estoque/lotes`

Listagem `Lotes de Estoque`, busca, filtros `Todos`, `Disponível`, `Bloqueado`, `Quarentena`, `Consumido`, `Vencido`; colunas `Lote`, `Matéria-prima`, `Qtd Total`, `Qtd Restante`, `Validade`, `Localização`, `Status`, `Ações`. Formulário `Novo Lote de Matéria-prima`: Número do lote*, Matéria-prima*, Quantidade*, Custo unitário, Validade, Corredor, Coluna, Nível, Posição. Status atualizáveis e exclusão com confirmação.

### Movimentações — `/estoque/movimentacoes`

Rota usada pela ação rápida e pelo menu; reproduzir registro e consulta das movimentações internas, com item, tipo, quantidade, origem/destino, observação e data.

## Engenharia e produção

### Receitas/BOM — `/engenharia/receitas`

Rota presente no menu; reproduzir cadastro de receitas de produto e componentes/quantidades para alimentar requisições de MP e ordens de produção.

### Ordens de produção — `/producao/ordens`

Rota central do fluxo de produção; reproduzir listagem com busca, filtros e criação/edição de OP, vínculo com produto, lote, quantidade planejada, datas, prioridade e status.

### Fluxo por OP — `/producao/fluxo` e `/producao/fluxo/:id`

Etapas: `Separação MP`, `Cozinha`, `Corte`, `Túnel`, `Envasadora`, `Câmara Fria`, `Expedição`. A tela por etapa mostra OP, lote, kg planejados, requisição e alerta `A matéria-prima desta OP ainda não foi totalmente separada pelo almoxarifado.`. Controles `Pausar`/`Iniciar`, registro com Peso Recebido, Peso Enviado, Perda, Temperatura, Observações, histórico, `Salvar Registro` e `Avançar Etapa →`. Estados de requisição: pendente, parcial, finalizada.

### Apontamento por setor — `/apontamento/:setor`

Cabeçalho `Apontamento —`, subtítulo, link `Monitor do setor`. KPIs `OPs no setor`, `Produzido hoje`, `Perdas hoje`, `Em estoque no setor`. Formulário `Registrar apontamento` com Ordem de Produção*, Lote, pesos recebido/enviado, perda, temperatura, Operador, Máquina, Motivo da perda e Observações. Controles `Parar`/`Iniciar`, `Salvar apontamento`, `Avançar etapa`. Nota: peso enviado sai do estoque do setor e entra automaticamente no seguinte. Lista `Últimos apontamentos do setor`.

## Monitoramento

### Monitor geral — `/monitor`

Título `Monitor da Produção`, subtítulo `Linha completa, atualizada automaticamente a cada 20 segundos`, CTA `Ir para apontamento`. KPIs `OPs ativas`, `Produzido hoje`, `Perdas hoje`, `% de perda`, `Em processo (WIP)`, `OPs atrasadas`. Alertas/links para `requisição(ões) de matéria-prima em aberto` e `ordem(ns) de manutenção aberta(s)`. Cards por setor e gráfico `Produção do dia por setor`. Tabelas `Ordens em andamento` e `Últimos apontamentos da fábrica`.

### Monitor por setor — `/monitor/:setor`

Mostra setor, responsável, botões `Visão geral` e `Apontar`, KPIs `OPs no setor`, `Recebido hoje`, `Tempo médio`, `Estoque do setor`, temperatura média, `Fila do setor` e `Apontamentos recentes`.

## Qualidade, manutenção e rastreabilidade

### Checklists — `/qualidade/checklists`

Rota presente no menu; reproduzir gestão de checklists, preenchimento, aprovação e estados de qualidade.

### Não conformidades — `/qualidade/nao-conformidades`

Rota presente no menu; reproduzir registro, severidade, setor, prazo, status, descrição, tratamento e liberação.

### Manutenção — `/manutencao`

Listagem de OMs com busca e filtros `Todos`, `Aberta`, `Em Andamento`, `Concluída`, `Cancelada`; colunas `Número`, `Máquina`, `Tipo`, `Descrição`, `Prioridade`, `Status`, `Agendado`. Formulário: Máquina*, Tipo `Preventiva`, `Corretiva`, `Preditiva`, Prioridade `Baixa`, `Normal`, `Alta`, `Urgente`, Descrição*, Data Agendada, Observações. Edição inclui Solução aplicada e Custo total.

### Rastreabilidade — `/rastreabilidade`

Campos `Buscar por Lote` e `Buscar por OP`, placeholder `Ex: LOTE-2026-0001`, ação `Enter`. Resultado de lote mostra Matéria-prima, Fornecedor, Quantidade, Status, Movimentações; resultado de OP mostra Produto, Lote, Cliente e Etapas de Produção com Recebido, Enviado e Perda. Estado vazio: `Digite um número de lote ou OP para iniciar a rastreabilidade.`

## Administração e utilidades

### Relatórios — `/relatorios`

Título `Relatórios`, subtítulo `Exportação real em PDF, Excel e CSV com dados do sistema`, filtros `Data Início` e `Data Fim`, aviso de filtro aplicado. Cartões para relatórios de pedidos, produção, estoques, custos, qualidade e manutenção; ações de exportação `CSV`, `Excel`, `PDF`, estados `Relatório em desenvolvimento`, `Nenhum dado encontrado para exportar`, `Relatório exportado com sucesso!` e erro de exportação.

### Usuários — `/admin/usuarios`

Acesso restrito a gestor/admin. Título `Usuários do Sistema`, subtítulo `Login por usuário e senha, gravados diretamente no banco de dados`. Ações `Minha senha` e `Novo usuário`, busca `Buscar por login ou nome...`. Tabela `Usuário`, `Nome`, `Perfil`, `Situação`, `Último acesso`, `Ações`, badges de perfil, `Ativo`/`Inativo`, `Redefinir senha`, `Desativar`/`Ativar`, `Excluir`. Modal com Login*, Senha*, Perfil*, `Cadastrar`; modal de redefinição; alteração da própria senha; bloco `Perfis e permissões`.

### Auditoria — `/auditoria`

Somente admin; reproduzir consulta de eventos, usuário, ação, módulo e data.

### Dados e backup — `/admin/dados`

Somente gestor/admin; reproduzir administração de dados e backup com estados de exportação/restauração claramente sinalizados.

### App Operador — `/operador`

Fluxo complementar de chão de fábrica, otimizado para celular e offline: seleção/escaneamento de OP/lote, cronômetro, pesos, temperatura, observações, foto, assinatura digital em canvas, sincronização e contador de pendências.

### Manual — `/manual`

Rota acessível pelo menu e menu de perfil; reproduzir manual de uso por módulos e passos operacionais.

## Fluxo de trabalho integrado a reproduzir

1. Usuário acessa Login e autentica com perfil.
2. Dashboard apresenta indicadores e atalhos.
3. Cadastros alimentam clientes, fornecedores, produtos, matérias-primas, embalagens, máquinas e funcionários.
4. Engenharia cria receitas/BOM.
5. Pedido é criado para um cliente, com produto, quantidade, prioridade e entrega.
6. OP é criada a partir da demanda e receita; a requisição de matéria-prima é gerada.
7. Gestor/gerente autoriza OP; almoxarifado separa itens total ou parcialmente, baixando estoque.
8. Produção percorre as sete etapas; cada apontamento registra pesos, perdas, temperatura, operador e máquina, atualiza estoques e avança a OP.
9. Monitor geral e monitores por setor refletem fila, WIP, produção, perdas e alertas.
10. Qualidade executa checklist, trata não conformidades e libera lotes.
11. Câmara fria e expedição atualizam estoque e saída; vendas/faturamento acompanham pedido pronto.
12. Rastreabilidade consulta lote/OP e exibe histórico de movimentações e etapas.
13. Relatórios consolidam dados e oferecem exportação; auditoria e administração registram governança.

## Decisões para a réplica

A implementação será frontend-first, com dados iniciais locais e persistência em `localStorage`, para ser executável imediatamente no GitHub Pages ou em qualquer hospedagem estática. O código será organizado por componentes, páginas e dados de domínio, com roteamento por URL, estados de formulário, confirmações, toasts, filtros, navegação entre etapas e responsividade. Não serão inventados depoimentos ou avaliações. A conexão a backend real ficará isolada em uma camada de dados substituível, permitindo futura integração com Supabase, API própria ou outro serviço.
