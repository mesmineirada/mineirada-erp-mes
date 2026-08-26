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
| Auditar conflitos da atualização full-stack e persistência atual | [x] — workspace compartilhado validado e rotas revisadas |
| Separar dados mestre de produtos/matérias-primas dos movimentos de estoque | [x] — Cadastro mantém dados mestre; Estoque mantém histórico e saldo |
| Vincular movimentações a item, saldo e histórico no módulo de Estoque | [x] — vínculo por código/nome, saldo derivado e detalhe operacional |
| Auditar padrões semelhantes em clientes, fornecedores, pedidos e extratos | [x] — rotas comerciais revisadas e sem extrato indevido em cadastros |
| Validar rotas, testes, responsividade e publicação | [x] — check, testes, build e preview verificados |

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

## Desempenho, feedback e exportação CSV

| Item | Situação |
|---|---|
| Auditar autocomplete e pontos de exportação atuais | [ ] |
| Implementar busca incremental e paginação no autocomplete | [ ] |
| Adicionar carregamento e sucesso na edição rápida de OPs | [ ] |
| Exportar relatórios e listagens de pedidos em CSV | [ ] |
| Validar downloads, desempenho, testes, build e publicação | [ ] |

## Menu de perfil do usuário

| Item | Situação |
|---|---|
| Reproduzir identificação, usuário e perfil no menu | [x] — nome, usuário e perfil exibidos no painel |
| Adicionar indicador funcional de conta ativa | [x] — status visual Conta ativa |
| Tornar Manual do sistema e Sair do sistema funcionais | [x] — navegação para Manual e encerramento de sessão |
| Validar abertura, fechamento, acessibilidade e responsividade | [x] — foco, aria-expanded, clique externo, mobile e build verificados |

## Manual e acessibilidade do menu de perfil

| Item | Situação |
|---|---|
| Vincular Manual do sistema a página ou modal com instruções | [x] — menu abre a rota `/manual` com instruções por módulo |
| Implementar navegação por teclado no menu do usuário | [x] — setas, Home, End e Escape com foco gerenciado |
| Carregar dinamicamente nome, usuário e perfil | [x] — dados derivados do usuário autenticado em todas as sessões |
| Validar rotas, foco, responsividade, testes e build | [x] — rota Manual, foco acessível, mobile, check/test/build aprovados |

## Auditoria integral do sistema

| Item | Situação |
|---|---|
| Mapear todos os menus e rotas | [x] — hrefs confrontados com o roteamento de App.tsx |
| Classificar telas completas, vazias e genéricas | [x] — lacunas localizadas em monitor, apontamento, rastreabilidade e relatórios |
| Auditar vínculos entre produtos, pedidos, OPs, lotes, estoque e manutenção | [x] — vínculos operacionais e fontes de dados corrigidos |
| Auditar CRUD, persistência compartilhada e permissões | [x] — mutations do workspace, fallback e validações revisados |
| Corrigir inconsistências e validar todos os fluxos | [x] — monitor, apontamento, rastreabilidade e CSV corrigidos; check/test/build aprovados |

## Auditoria complementar — apontamento, monitoramento e relatórios

| Item | Situação |
|---|---|
| Corrigir monitores para usar OPs e apontamentos persistidos | [x] — indicadores e cartões setoriais derivados de OPs/apontamentos |
| Persistir métricas de apontamentos e refletir indicadores por setor | [x] — pesos, perdas e temperatura gravados no workspace |
| Validar rastreabilidade por lote e exportação CSV real | [x] — consulta por lote/OP e download CSV implementados e compilados |

## Nova etapa — banco normalizado, autenticação e operação de almoxarifado

| Item | Situação |
|---|---|
| Mapear schema, workspace_state, login legado, OAuth e rotas operacionais | [x] — schema, routers, contexto OAuth e rotas revisados |
| Criar tabelas normalizadas de produtos, matérias-primas, embalagens, movimentações e apontamentos | [x] — tabelas criadas com autoria e identificadores externos |
| Migrar dados compatíveis do workspace sem apagar registros existentes | [x] — migração idempotente e sincronização contínua implementadas |
| Conectar CRUD e consultas das telas ao banco normalizado com fallback seguro | [x] — save do workspace sincroniza tabelas e catálogo usa consulta paginada |
| Concluir autenticação server-side sem quebrar SOUSA, KARITA e FELIPE | [x] — login scrypt e cookie JWT integrado ao contexto OAuth |
| Testar sessões simultâneas e isolamento/compartilhamento correto dos dados | [x] — smoke test real com três cookies independentes aprovado |
| Implementar autocomplete paginado com busca incremental real | [x] — tRPC por consulta/offset com carregamento incremental |
| Completar Câmara Fria, Matéria-prima e Embalagens com CRUD funcional | [x] — atalhos de cadastro e entrada integrados às visões de Estoque |
| Permitir editar e excluir requisições de almoxarifado | [x] — CRUD compartilhado com filtros, vínculo de OP/pedido e auditoria |
| Implementar autorização de OP, separação de MP/suprimentos e liberação para produção | [x] — ação de autorização registra separação e muda OP para Em produção |
| Validar testes, rotas, responsividade e publicação | [x] — check, 6 testes, build e smoke test de sessões aprovados |

## Auditoria de ciclo de estoque, OPs e permissões

| Item | Situação |
|---|---|
| Auditar produto acabado, Câmara Fria, baixa por pedido, movimentações e locais de estoque | [x] — ciclo produto acabado → Câmara Fria → baixa por pedido revisado |
| Validar vínculos entre cadastros, estoque, pedidos, OPs e almoxarifado | [x] — telas e persistência compartilhada confrontadas |
| Normalizar tabelas de OPs e requisições com integridade referencial | [x] — tabelas criadas e migrações aplicadas |
| Garantir edição e exclusão de requisições de almoxarifado | [x] — CRUD existente verificado em rota e estado compartilhado |
| Implementar autorização de OP com separação de MP/suprimentos e liberação produtiva | [x] — ação atualiza OP normalizada e workspace |
| Aplicar permissão granular: autorização somente para perfil gerencial | [x] — procedure server-side permite Gestor/Gerente e bloqueia Administrador |
| Adicionar filtros e ordenação em matérias-primas, embalagens e acabados | [x] — busca, situação e ordenação nas visões operacionais |
| Validar testes funcionais, sincronização, responsividade e publicação | [x] — 8 testes, check, build, SQL e previews desktop/mobile aprovados |

## Correção do menu lateral móvel

| Item | Situação |
|---|---|
| Corrigir abertura e visibilidade da barra lateral no celular | [x] — classe `sidebar-open` alinhada ao CSS móvel |
| Garantir fechamento, navegação por toque/teclado e sobreposição acessível | [x] — overlay, botão fechar e atributos aria revisados |
| Validar menu móvel e desktop, testes, build e publicação | [x] — 10 testes, check, build e preview móvel aprovados |

## Ajustes móveis de Estoques e acesso gerencial

| Item | Situação |
|---|---|
| Validar filtros e ordenação das telas de Estoques em celular | [x] — busca, filtro e ordenação visíveis e empilhados sem overflow |
| Adicionar atalho lateral para Autorizar OP restrito à gerência | [x] — rota filtrada e item `managerOnly` no menu de Produção |
| Bloquear rolagem e focar o primeiro item ao abrir o menu móvel | [x] — body/main-scroll bloqueados e foco aplicado ao primeiro nav-item |
| Validar testes, responsividade, acessibilidade e publicação | [x] — 12 testes, check, build e previews móveis aprovados |

## Confirmação de OP e feedback dos estoques

| Item | Situação |
|---|---|
| Adicionar modal de confirmação antes de autorizar OP | [x] — confirmação detalha OP, produto, quantidade e libera a mutação somente após confirmar |
| Ordenar estoques por última movimentação e local de armazenamento | [x] — opções aplicadas em Matéria-Prima e Câmara Fria |
| Exibir carregamento ao aplicar filtros de estoque | [x] — indicador com `aria-live` e animação compatível com mobile |
| Validar testes, responsividade, acessibilidade e publicação | [x] — 13 testes, check, build e previews móveis aprovados |

## Histórico de autorizações e confirmações de exclusão

| Item | Situação |
|---|---|
| Exibir data da última movimentação e local na tabela da Câmara Fria | [x] — colunas mostram última movimentação, local e demais dados de armazenamento |
| Criar tela/seção com histórico detalhado de autorizações de OP | [x] — seção dedicada em `/auditoria?view=autorizacoes` |
| Adicionar confirmação modal antes de exclusões em todos os módulos | [x] — hook compartilhado cobre cadastros, pedidos e operações |
| Validar acessibilidade, responsividade, testes e publicação | [x] — 15 testes, check, build e previews móveis aprovados |

## Correção de imagens no mobile

| Item | Situação |
|---|---|
| Auditar referências do logo e da ilustração industrial | [x] — assets antigos validados e cópias estáveis publicadas |
| Corrigir carregamento e dimensionamento responsivo das imagens | [x] — logo completo, marca no cabeçalho e ilustração com regras mobile |
| Validar imagens em mobile/desktop, testes, build e publicação | [x] — URLs 200, 16 testes, check, build e previews aprovados |

## Reversão da tela de login e correção da sidebar

| Item | Situação |
|---|---|
| Restaurar a composição anterior da tela de login | [x] — ilustração removida; login voltou ao logo e campos originais |
| Corrigir o asset quebrado do logo dentro da sidebar móvel | [x] — símbolo apontado para asset estável publicado |
| Validar login, sidebar móvel, testes, build e publicação | [x] — asset 200, 16 testes, check, build e validação mobile/desktop |

## Auditoria de idioma — português do Brasil

| Item | Situação |
|---|---|
| Mapear textos visíveis, menus, estados e mensagens em inglês | [x] — varredura de menus, formulários, tabelas e feedbacks realizada |
| Traduzir e padronizar interface, filtros, modais e feedbacks | [x] — rótulos genéricos e ocorrências residuais padronizados |
| Revisar acessibilidade e termos operacionais em português do Brasil | [x] — labels, placeholders, aria-labels e situações revisados |
| Validar auditoria automatizada, testes, build e telas | [x] — 17 testes, check, build e tela móvel aprovados |

## Tradução integral da interface — português do Brasil

| Item | Situação |
|---|---|
| Auditar todos os textos visíveis, incluindo rótulos de campos em inglês | [x] — chaves de formulário convertidas para rótulos em pt-BR |
| Traduzir menus, formulários, tabelas, filtros, botões e modais | [x] — termos visíveis padronizados em toda a interface |
| Traduzir estados, mensagens, dicas e atributos de acessibilidade | [x] — estados, feedbacks e descrições acessíveis revisados |
| Executar varredura residual e validar testes, build e telas | [x] — varredura final, 17 testes, check, build e preview móvel aprovados |

## Ajuda contextual, pesquisa lateral e glossário

| Item | Situação |
|---|---|
| Criar glossário operacional para OP, MP, BOM e MES | [x] — definições centralizadas em `client/src/localization.ts` |
| Adicionar tooltips acessíveis ao lado das siglas técnicas | [x] — ícones com `title`, `aria-label`, foco e dica responsiva |
| Implementar pesquisa rápida no menu lateral | [x] — busca hierárquica por telas e grupos, compatível com mobile |
| Criar validação automática para novas strings em inglês | [x] — comando `pnpm check:ptbr` adicionado ao projeto |
| Validar mobile, teclado, testes, build e publicação | [x] — 18 testes, check pt-BR, TypeScript, build e prévia móvel aprovados |

## Correção definitiva do logo no Chrome mobile

| Item | Situação |
|---|---|
| Auditar usos e tamanho dos logos atuais | [ ] |
| Embutir logo completo e símbolo compacto em Base64 | [ ] |
| Aplicar logo embutido no login, cabeçalho e sidebar | [ ] |
| Validar Chrome mobile, login, testes, build e publicação | [ ] |

## Correção de sobreposição do menu do usuário e auditoria final

| Item | Situação |
|---|---|
| Auditar menu do usuário, popovers, modais e camadas de sobreposição | [x] — revisados z-index, opacidade, overflow e posicionamento |
| Corrigir menu do usuário para sobrepor o conteúdo sem deslocá-lo | [x] — superfície opaca e camada superior aplicadas |
| Garantir fechamento, restauração do layout e comportamento mobile | [x] — Escape, clique externo e posição fixa móvel preservados |
| Revisar ocorrências semelhantes em menus, filtros e janelas flutuantes | [x] — variáveis de tema sem definição eliminadas do menu |
| Auditar telas, cadastros, labels, mensagens e estados para pt-BR | [x] — validação `pnpm check:ptbr` aprovada |
| Validar fluxos, acessibilidade, testes, build e publicação | [x] — 19 testes, TypeScript, build e prévia móvel aprovados |

## Perfil, tema no menu e splash de boas-vindas

| Item | Situação |
|---|---|
| Auditar menu de usuário, autenticação e tema atual | [x] — menu, perfil e ThemeContext revisados |
| Adicionar Configurações de Perfil com edição de dados pessoais | [x] — rota `/perfil` com nome, e-mail e telefone |
| Permitir selecionar e persistir foto de perfil | [x] — validação de tipo/tamanho, prévia e localStorage |
| Incluir alternância de Modo Escuro dentro do menu do usuário | [x] — botão com estado Ativo/Inativo e `aria-pressed` |
| Exibir splash de boas-vindas por 2 segundos com nome e fade-out | [x] — splash controlado por timer e animação de 2 segundos |
| Validar desktop, celular, acessibilidade, testes, build e publicação | [x] — 20 testes, TypeScript, build e prévia móvel aprovados |

## Saudação personalizada no splash

| Item | Situação |
|---|---|
| Calcular saudação conforme o horário local do usuário | [x] — hora obtida pelo navegador com `new Date().getHours()` |
| Exibir Bom dia, Boa tarde ou Boa noite no splash | [x] — manhã, tarde e noite exibidas com nome do usuário |
| Validar duração, fade-out, idioma, testes e build | [x] — splash de 2 segundos, 21 testes, TypeScript e build aprovados |

## Carregamento durante o despertar automático

| Item | Situação |
|---|---|
| Auditar estados atuais de inicialização e autenticação | [x] — fluxo público, login e montagem do React revisados |
| Criar tela de carregamento para o primeiro acesso | [x] — carregador inline no HTML antes da montagem do aplicativo |
| Exibir mensagens claras durante a inicialização e em falhas temporárias | [x] — mensagem `Iniciando o sistema...` e barra de progresso |
| Preservar o acesso público automático sem custos adicionais | [x] — nenhuma rotina de polling ou hospedagem contínua adicionada |
| Validar responsividade, acessibilidade, testes, build e publicação | [x] — 22 testes, TypeScript, build e validação de acessibilidade aprovados |

## Identidade visual e transição do carregador

| Item | Situação |
|---|---|
| Aplicar logo oficial e cores da marca no carregador inicial | [x] — logo embutida oficial e paleta Mineirada aplicadas |
| Adicionar dica útil em português na tela de carregamento | [x] — dica sobre busca lateral adicionada |
| Integrar fade-out do carregador com o splash de boas-vindas | [x] — fade-out controlado após montagem do React |
| Validar acessibilidade, responsividade, testes, build e publicação | [x] — 22 testes, TypeScript e build aprovados |

## Identidade visual e transição do carregador

| Item | Situação |
|---|---|
| Aplicar logo oficial e cores da marca no carregador inicial | [x] — logo embutida oficial e paleta Mineirada aplicadas |
| Adicionar dica útil em português na tela de carregamento | [x] — dica sobre busca lateral adicionada |
| Integrar fade-out do carregador com o splash de boas-vindas | [x] — fade-out controlado após montagem do React |
| Validar acessibilidade, responsividade, testes, build e publicação | [x] — 22 testes, TypeScript e build aprovados |
