# Especificação visual da réplica

## Referência de design

Este projeto é uma **reprodução fiel** do Mineirada ERP/MES acessado em `https://mineiradasys.lovable.app`. A referência fornecida pelo usuário é a fonte de verdade; fidelidade de layout, navegação, conteúdo, cores, espaçamento, componentes, ícones e estados supera qualquer preferência estética genérica.

## Direção escolhida: ERP industrial âmbar sobre carvão

A linguagem visual deve manter a combinação observada de base clara quente, acento âmbar industrial e sidebar marrom-carvão. A interface autenticada é um painel operacional compacto, com cards e tabelas organizados para leitura rápida no chão de fábrica e em backoffice.

### Design Movement

Skeuomorfismo industrial leve aplicado a um sistema ERP/MES moderno: superfícies neutras, contraste funcional, ícones lineares e hierarquia densa, sem ornamentação que reduza a velocidade de operação.

### Core Principles

1. **Fidelidade funcional:** cada rota e ação listada em `MAPEAMENTO_ORIGINAL.md` deve existir e levar ao estado correspondente.
2. **Fidelidade cromática:** fundo quente claro, primário âmbar/laranja, sidebar escura marrom-carvão, estados semânticos em verde, azul, amarelo e vermelho.
3. **Densidade operacional:** tabelas, filtros, badges e formulários priorizam escaneabilidade e produtividade.
4. **Hierarquia persistente:** sidebar, cabeçalho de usuário, item ativo, grupos expansíveis e atalhos mantêm o contexto em todas as páginas autenticadas.

### Color Philosophy

O âmbar primário comunica produção, energia e sinalização industrial; o carvão da sidebar dá contraste e ancora a navegação; o fundo off-white reduz fadiga em telas extensas; verde, azul, amarelo e vermelho ficam reservados a estados operacionais e alertas, evitando cores decorativas sem significado.

### Layout Paradigm

Aplicação em duas regiões: sidebar lateral persistente de largura fixa no desktop e área de conteúdo fluida. As páginas usam cabeçalho de contexto, toolbars horizontais, cards de KPIs e tabelas com overflow horizontal controlado. No mobile, a sidebar vira painel recolhível e as tabelas preservam leitura por rolagem.

### Signature Elements

O símbolo de fábrica dentro de um quadrado âmbar; a sidebar marrom-carvão com itens em árvore e linha ativa âmbar; badges de status compactos e indicadores de operação usando ícones Lucide lineares.

### Interaction Philosophy

Interações devem ser imediatas e explícitas: abrir/recolher grupos no menu, filtros aplicados localmente, modais para CRUD, confirmações para exclusão, toast para sucesso/erro e feedback visual de carregamento. Cada botão da réplica deve executar uma ação navegável ou informar o estado de forma clara.

### Animation

Usar transições curtas de 150–220 ms para hover, expansão da sidebar, dropdowns e modais, sempre transform/opacity quando possível. Entradas devem ser discretas; respeitar `prefers-reduced-motion`; não animar tabelas de alta frequência.

### Typography System

Usar a pilha sans-serif observada (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, Roboto, Helvetica Neue, Arial) e fonte monoespaçada para códigos, números de OP e lotes. Títulos de página em escala `text-xl`/`text-2xl`, subtítulos em `text-sm`, cabeçalhos de tabela em `text-xs` uppercase com tracking, valores de KPI em `text-2xl`/`text-4xl`.

### Brand Essence

**Mineirada ERP/MES é o painel operacional para integrar produção, estoques, qualidade e rastreabilidade em uma única rotina industrial.** Personalidade: direto, confiável, industrial.

### Brand Voice

Headlines são informativas e orientadas à tarefa; CTAs usam verbos concretos; microcopy explica o próximo passo, o impacto no estoque e o motivo das permissões. Exemplos: `Registrar apontamento` e `A matéria-prima desta OP ainda não foi totalmente separada pelo almoxarifado.`.

### Wordmark & Logo

O wordmark aparece como `Mineirada ERP + MES` em peso forte ao lado/acima do símbolo. O ícone é um quadrado com cantos suaves em âmbar, brilho mínimo e pictograma linear de fábrica; deve ser usado no login, cabeçalho/sidebar e favicon.

### Signature Brand Color

**Âmbar industrial Mineirada — `oklch(50% 0.16 42)`**.

## Regras por arquivo

Todo CSS, componente e página deve manter no topo um comentário curto lembrando: réplica fiel, fundo quente, primário âmbar, sidebar carvão, ícones lineares, densidade operacional e respeito ao mapeamento de rotas.
