import { useLocation } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import manualCadastrosImage from "./manual-cadastros.png";
import manualReceitasImage from "./manual-receitas.png";
import manualApontamentosImage from "./manual-apontamentos.png";
import manualMovimentacoesImage from "./manual-movimentacoes.png";
import manualChecklistsImage from "./manual-checklists.png";
import manualRelatoriosImage from "./manual-relatorios.png";

type ManualAction = { label: string; href: string };
type ManualStep = {
  title: string;
  paragraphs: string[];
  note?: string;
  actions?: ManualAction[];
};
type ManualIllustration = { src: string; alt: string; caption: string };
type ManualGuide = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  illustrations: ManualIllustration[];
  steps: ManualStep[];
};

const guides: ManualGuide[] = [
  {
    slug: "cadastros",
    title: "Cadastros essenciais",
    summary: "Prepare os dados que serão reutilizados em pedidos, receitas, estoque e produção.",
    icon: Users,
    illustrations: [
      {
        src: manualCadastrosImage,
        alt: "Tela de matérias-primas com uma seta indicando o botão Novo.",
        caption: "A seta aponta para Novo. Use a busca para localizar um item; pelo formulário, informe os dados necessários e salve.",
      },
    ],
    steps: [
      {
        title: "Cadastre clientes e fornecedores",
        paragraphs: [
          "Abra o módulo correspondente, selecione Novo e informe os dados de identificação e contato. Código e nome são obrigatórios nos cadastros que usam esses campos.",
          "Use um cadastro por pessoa ou empresa. Os pedidos precisam selecionar um cliente já cadastrado.",
        ],
        actions: [
          { label: "Clientes", href: "/cadastros/clientes" },
          { label: "Fornecedores", href: "/cadastros/fornecedores" },
        ],
      },
      {
        title: "Cadastre matérias-primas e embalagens",
        paragraphs: [
          "Informe nome, código, unidade e categoria. Para matérias-primas, preencha também o custo unitário e o estoque mínimo quando esses dados estiverem disponíveis.",
          "Esses registros alimentam as fichas técnicas, as requisições do almoxarifado e o saldo exibido no estoque.",
        ],
        actions: [
          { label: "Matérias-primas", href: "/cadastros/materias-primas" },
          { label: "Embalagens", href: "/cadastros/embalagens" },
        ],
      },
      {
        title: "Cadastre produtos acabados, máquinas e equipe",
        paragraphs: [
          "Cadastre cada produto que poderá ser incluído em pedidos ou receitas. Preencha unidade, preço, validade e temperatura de armazenamento conforme aplicável.",
          "Cadastre máquinas antes de relacioná-las a ordens de manutenção ou registros de qualidade. O cadastro de funcionários organiza matrícula, cargo, setor e turno.",
        ],
        actions: [
          { label: "Produtos", href: "/cadastros/produtos" },
          { label: "Máquinas", href: "/cadastros/maquinas" },
          { label: "Funcionários", href: "/cadastros/funcionarios" },
        ],
      },
      {
        title: "Revise antes de usar",
        paragraphs: [
          "Use a busca para localizar um registro. Os ícones de ação da linha permitem editar ou excluir; confirme exclusões com atenção porque elas podem afetar vínculos usados em outras áreas.",
          "Quando a tela oferecer Importar planilha, siga o modelo e confira a validação antes de concluir a importação.",
        ],
      },
    ],
  },
  {
    slug: "pedidos-e-receitas",
    title: "Receitas, pedidos e ordens de produção",
    summary: "Monte a ficha técnica, registre a demanda do cliente e transforme-a em uma ordem controlada.",
    icon: ClipboardList,
    illustrations: [
      {
        src: manualReceitasImage,
        alt: "Tela de receitas com uma seta indicando o botão Nova Receita.",
        caption: "A seta destaca Nova Receita. Selecione um produto já cadastrado, inclua os ingredientes e informe as quantidades por lote.",
      },
    ],
    steps: [
      {
        title: "Monte a receita / ficha técnica",
        paragraphs: [
          "Em Engenharia > Receitas / BOM, clique em Nova Receita. Selecione um produto cadastrado e informe código, nome e tamanho do lote em quilogramas.",
          "Adicione cada matéria-prima cadastrada e a quantidade consumida por lote. Rendimento, perda, temperatura, validade e instruções complementam a ficha; o custo é calculado a partir das quantidades e custos unitários cadastrados.",
        ],
        note: "A conclusão de uma OP usa a receita para calcular e baixar os ingredientes. Sem receita compatível ou com saldo insuficiente, a OP não pode ser concluída.",
        actions: [{ label: "Abrir receitas", href: "/engenharia/receitas" }],
      },
      {
        title: "Registre o pedido do cliente",
        paragraphs: [
          "Em Pedidos, escolha Novo Pedido, selecione um cliente, adicione ao menos um produto cadastrado e informe uma quantidade maior que zero. Revise unidade, valor, prioridade, entrega e situação antes de salvar.",
          "O pedido recebe uma identificação e pode ser editado na tabela. Ao salvar um pedido com itens pela primeira vez, a réplica registra a saída correspondente do estoque de produto acabado.",
        ],
        note: "Confira os itens e quantidades antes de salvar: a baixa do produto acabado ocorre automaticamente na primeira gravação do pedido.",
        actions: [{ label: "Abrir pedidos", href: "/pedidos" }],
      },
      {
        title: "Crie e vincule a ordem de produção",
        paragraphs: [
          "Em Produção > Ordens de Produção, selecione Nova OP. Informe número, produto, quantidade maior que zero, prazo e prioridade. Vincule o pedido e o lote quando existirem.",
          "Acompanhe as OPs pela busca e pelo filtro de situação. O Fluxo por OP mostra as ordens agrupadas em planejada, em produção, pausada, concluída ou cancelada.",
        ],
        actions: [
          { label: "Ordens de produção", href: "/producao/ordens" },
          { label: "Fluxo por OP", href: "/producao/fluxo" },
        ],
      },
      {
        title: "Autorize a entrada na produção",
        paragraphs: [
          "Um Gestor ou Gerente deve abrir a visão Autorizar OP, revisar produto, quantidade, pedido e lote e confirmar a autorização. A ação muda a situação para Em produção e registra a liberação da separação de matéria-prima e suprimentos.",
        ],
        note: "A autorização não substitui os apontamentos dos setores. Registre cada etapa e só marque a OP como Concluída depois de finalizar o processo.",
        actions: [{ label: "Ver OPs para autorizar", href: "/producao/ordens?view=autorizar" }],
      },
    ],
  },
  {
    slug: "apontamentos",
    title: "Apontamentos por setor",
    summary: "Registre quantidades e condições de cada etapa para acompanhar o andamento da fábrica.",
    icon: Factory,
    illustrations: [
      {
        src: manualApontamentosImage,
        alt: "Tela do setor Cozinha sem ordens disponíveis, com uma seta para o atalho de ordens de produção.",
        caption: "A tela está sem OP disponível. A seta aponta para o atalho que leva às Ordens de Produção; depois de criar ou liberar uma OP, volte ao setor e faça o apontamento.",
      },
    ],
    steps: [
      {
        title: "Abra a etapa correta e selecione uma OP",
        paragraphs: [
          "No menu Apontamento, escolha o setor que está executando o trabalho. A tela lista as OPs abertas que ainda não foram concluídas ou canceladas.",
          "Selecione a OP antes de registrar. Se não houver ordens disponíveis, volte a Produção > Ordens de Produção e cadastre ou libere uma ordem válida.",
        ],
        actions: [
          { label: "Separação MP", href: "/apontamento/separacao_mp" },
          { label: "Cozinha", href: "/apontamento/cozinha" },
          { label: "Corte", href: "/apontamento/corte" },
          { label: "Túnel", href: "/apontamento/tunel" },
          { label: "Envasadora", href: "/apontamento/envasadora" },
          { label: "Câmara Fria", href: "/apontamento/camara_fria" },
          { label: "Expedição", href: "/apontamento/expedicao" },
        ],
      },
      {
        title: "Registre o que aconteceu",
        paragraphs: [
          "Preencha peso recebido, peso enviado, perda e temperatura com os valores medidos naquela etapa. Use as mesmas unidades e critérios adotados pela operação.",
          "O cronômetro Iniciar/Parar é um controle visual da tela. Depois de revisar os campos, clique em Salvar apontamento para gravar o registro vinculado à OP e ao setor.",
        ],
      },
      {
        title: "Acompanhe e encerre corretamente",
        paragraphs: [
          "Consulte os cartões do Monitor Geral ou do setor para ver as ordens e os apontamentos registrados. O Fluxo por OP ajuda a acompanhar a situação de cada ordem.",
          "Ao concluir uma OP, o sistema exige uma receita válida e saldo suficiente dos ingredientes. Se a conclusão for aceita e o produto estiver cadastrado, a matéria-prima é baixada e a quantidade produzida entra na Câmara Fria.",
        ],
        note: "Não marque uma ordem como concluída para contornar uma etapa ainda não apontada. A conclusão afeta saldos e movimentações.",
        actions: [
          { label: "Monitor geral", href: "/monitor" },
          { label: "Fluxo por OP", href: "/producao/fluxo" },
        ],
      },
    ],
  },
  {
    slug: "estoque-e-almoxarifado",
    title: "Estoque, requisições e lotes",
    summary: "Consulte saldos, registre movimentações e acompanhe a validade e a localização dos lotes.",
    icon: Boxes,
    illustrations: [
      {
        src: manualMovimentacoesImage,
        alt: "Tela de movimentações de estoque com uma seta para Nova Movimentação.",
        caption: "Use Nova Movimentação para registrar entradas, saídas, transferências ou ajustes. Os filtros e a tabela ajudam a consultar o histórico.",
      },
    ],
    steps: [
      {
        title: "Registre uma movimentação de matéria-prima",
        paragraphs: [
          "Em Almoxarifado > Movimentações, selecione Nova Movimentação. Escolha uma matéria-prima cadastrada, informe quantidade positiva, unidade, data, origem, destino e observação.",
          "Entrada soma ao saldo; Saída reduz o saldo até zero; Ajuste substitui o saldo pelo total informado. Use a busca e os filtros para consultar o histórico.",
        ],
        note: "Na versão atual, Transferência registra a operação e sua origem/destino, mas não recalcula automaticamente o saldo. Confira o saldo depois de usá-la.",
        actions: [{ label: "Movimentações", href: "/estoque/movimentacoes" }],
      },
      {
        title: "Acompanhe requisições e materiais abaixo do mínimo",
        paragraphs: [
          "Em Requisições de MP, crie uma requisição e relacione-a a uma OP ou pedido quando possível. Informe material ou suprimento, quantidade e situação; atualize a situação conforme a separação avançar.",
          "Na visão de Matéria-Prima, filtre itens abaixo do mínimo, confira saldo e última movimentação e abra os detalhes para consultar o histórico daquele insumo.",
        ],
        actions: [
          { label: "Requisições", href: "/almoxarifado/requisicoes" },
          { label: "Estoque de matéria-prima", href: "/estoque/materia-prima" },
        ],
      },
      {
        title: "Controle lotes e produto acabado",
        paragraphs: [
          "Em Lotes, clique em Novo Lote e informe número, matéria-prima cadastrada, quantidade total maior que zero, validade, localização e situação. Revise os registros em busca da validade e da localização corretas.",
          "A Câmara Fria exibe os produtos acabados e seus saldos. O encerramento de uma OP pode adicionar produto automaticamente; a primeira gravação de um pedido com itens pode dar baixa no saldo do produto acabado.",
        ],
        actions: [
          { label: "Lotes", href: "/estoque/lotes" },
          { label: "Visão geral de estoques", href: "/estoque/visao-geral" },
          { label: "Câmara Fria", href: "/estoque/acabado" },
        ],
      },
      {
        title: "Imprima etiquetas",
        paragraphs: [
          "Em Etiquetas, use os lotes cadastrados para preparar etiquetas de lote para impressão. A página também reúne códigos internos gerados a partir de produtos, matérias-primas e OPs existentes.",
        ],
        actions: [{ label: "Etiquetas e códigos", href: "/etiquetas" }],
      },
    ],
  },
  {
    slug: "qualidade-e-manutencao",
    title: "Qualidade, manutenção e rastreabilidade",
    summary: "Documente inspeções, ocorrências e manutenção e encontre o histórico por OP ou lote.",
    icon: ShieldCheck,
    illustrations: [
      {
        src: manualChecklistsImage,
        alt: "Tela de checklists de qualidade com uma seta para Novo Checklist.",
        caption: "Comece em Novo Checklist. Informe responsável, setor e data; vincule uma OP ou máquina para facilitar as consultas.",
      },
    ],
    steps: [
      {
        title: "Registre checklists de qualidade",
        paragraphs: [
          "Em Qualidade > Checklists, clique em Novo Checklist. Informe assunto, responsável, setor, data, prazo e situação. Relacione a OP ou máquina para facilitar a consulta posterior.",
          "Anexe fotos ou documentos quando necessário. Os anexos ficam armazenados no navegador usado para cadastrá-los.",
        ],
        actions: [{ label: "Checklists", href: "/qualidade/checklists" }],
      },
      {
        title: "Trate uma não conformidade",
        paragraphs: [
          "Em Não Conformidades, registre o assunto, setor, responsável, data, prazo, severidade e situação. Vincule a OP ou máquina afetada e descreva contenção, tratamento e observações.",
          "Atualize a situação à medida que a investigação e as ações corretivas avançarem. Consulte os detalhes antes de concluir o registro.",
        ],
        actions: [{ label: "Não conformidades", href: "/qualidade/nao-conformidades" }],
      },
      {
        title: "Acompanhe manutenção preventiva e corretiva",
        paragraphs: [
          "Em Manutenção, crie uma ordem para uma máquina cadastrada. Informe tipo, prioridade, situação, data agendada e descrição; vincule uma OP se houver relação operacional.",
          "Registre solução, custo e observações no detalhe da ordem. Use os filtros para acompanhar o que está aberto, em execução ou concluído.",
        ],
        actions: [{ label: "Ordens de manutenção", href: "/manutencao" }],
      },
      {
        title: "Consulte a rastreabilidade",
        paragraphs: [
          "Em Rastreabilidade, escolha Lote ou OP, digite o identificador e clique Buscar. O resultado reúne os dados encontrados e os registros vinculados disponíveis.",
        ],
        actions: [{ label: "Rastreabilidade", href: "/rastreabilidade" }],
      },
    ],
  },
  {
    slug: "relatorios-e-backup",
    title: "Relatórios, backup e cuidados com os dados",
    summary: "Exporte o que estiver disponível e entenda as limitações desta versão publicada no GitHub Pages.",
    icon: FileText,
    illustrations: [
      {
        src: manualRelatoriosImage,
        alt: "Tela de relatórios com uma seta indicando uma opção de exportação CSV.",
        caption: "A seta aponta para CSV. Ajuste o período e baixe os registros disponíveis; Excel e PDF ainda exibem uma mensagem nesta versão.",
      },
    ],
    steps: [
      {
        title: "Exporte relatórios operacionais",
        paragraphs: [
          "Em Relatórios, escolha o tipo de informação e use CSV para baixar os registros atuais. A tela apresenta categorias de produção, pedidos, estoque, custos, qualidade e manutenção.",
          "Na implementação atual, os botões Excel e PDF exibem uma mensagem informativa e não geram esses arquivos. O filtro de período da tela ainda não limita as linhas exportadas pelo CSV.",
        ],
        actions: [{ label: "Relatórios", href: "/relatorios" }],
      },
      {
        title: "Faça backup antes de trocar de navegador",
        paragraphs: [
          "Em Administração > Dados e Backup, exporte o arquivo JSON diretamente ou marque “Exigir senha também para exportar” para solicitar uma senha com pelo menos 12 caracteres. Para restaurar, selecione o arquivo de backup e informe e confirme a senha de proteção.",
          "O arquivo inclui os registros locais e anexos; guarde-o em local controlado e confira a instalação antes de restaurar, pois a restauração substitui os dados locais atuais.",
        ],
        note: "A senha solicitada pela tela não cifra o conteúdo do JSON nesta versão. Não envie backups por canais públicos e não inclua dados pessoais ou empresariais reais.",
        actions: [{ label: "Dados e backup", href: "/admin/dados" }],
      },
      {
        title: "Limites importantes do site publicado",
        paragraphs: [
          "Esta publicação no GitHub Pages é uma réplica frontend de demonstração. A autenticação é apenas local e não protege dados como faria um servidor seguro; cadastros e operações ficam no armazenamento do navegador e não são sincronizados entre usuários.",
          "Use dados fictícios para validar os fluxos. Não use esta versão para produção, dados confidenciais ou decisões operacionais reais. Para operação multiusuário, é necessário um backend com autenticação e autorização seguras.",
        ],
      },
    ],
  },
];

function OpenModuleButton({
  action,
  onNavigate,
}: {
  action: ManualAction;
  onNavigate: (path: string) => void;
}) {
  return (
    <button
      className="button button-outline manual-open-button"
      onClick={() => onNavigate(action.href)}
      type="button"
    >
      {action.label}
      <ArrowRight size={14} aria-hidden="true" />
    </button>
  );
}

export default function ManualPage() {
  const [location, navigate] = useLocation();
  const path = location.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  const slug = path === "/manual" ? "" : path.slice("/manual/".length);
  const guide = guides.find((item) => item.slug === slug);
  const isIndex = path === "/manual" || path === "/manual/";

  return (
    <div className="page-content manual-content">
      {isIndex ? (
        <>
          <div className="manual-page-heading">
            <div>
              <span className="manual-eyebrow">Guia de operação</span>
              <h1>Manual de uso do Mineirada ERP + MES</h1>
              <p>
                Instruções passo a passo para cadastrar, planejar, produzir,
                controlar estoque e consultar os registros do sistema.
              </p>
            </div>
          </div>

          <section className="manual-intro panel">
            <div className="manual-intro-icon"><BookOpen size={22} /></div>
            <div>
              <h2>Como usar este manual</h2>
              <p>
                Comece pelos cadastros e siga o fluxo de trabalho. Cada guia explica
                o que preencher, quando avançar e em qual tela continuar. Os botões
                “Abrir tela” levam ao módulo correspondente.
              </p>
            </div>
          </section>

          <section className="manual-flow panel" aria-labelledby="manual-flow-title">
            <div className="manual-section-heading">
              <div>
                <span className="manual-eyebrow">Fluxo recomendado</span>
                <h2 id="manual-flow-title">Da preparação ao acompanhamento</h2>
              </div>
              <ClipboardCheck size={21} aria-hidden="true" />
            </div>
            <ol className="manual-flow-list">
              <li><span>01</span><div><strong>Prepare os cadastros</strong><p>Clientes, matérias-primas, produtos, máquinas e embalagens.</p></div></li>
              <li><span>02</span><div><strong>Planeje a demanda</strong><p>Registre a receita, o pedido do cliente e a ordem de produção.</p></div></li>
              <li><span>03</span><div><strong>Execute e registre</strong><p>Autorize a OP e salve os apontamentos de cada setor.</p></div></li>
              <li><span>04</span><div><strong>Confira os resultados</strong><p>Revise saldos, qualidade, rastreabilidade e relatórios.</p></div></li>
            </ol>
          </section>

          <section className="manual-guide-section" aria-labelledby="manual-guides-title">
            <div className="manual-section-heading">
              <div>
                <span className="manual-eyebrow">Instruções por assunto</span>
                <h2 id="manual-guides-title">Escolha um guia</h2>
              </div>
            </div>
            <div className="manual-guide-grid">
              {guides.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    className="panel manual-guide-card"
                    key={item.slug}
                    onClick={() => navigate(`/manual/${item.slug}`)}
                  >
                    <span className="manual-guide-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="manual-guide-icon"><Icon size={19} aria-hidden="true" /></span>
                    <span className="manual-guide-copy">
                      <strong>{item.title}</strong>
                      <span>{item.summary}</span>
                    </span>
                    <ArrowRight className="manual-guide-arrow" size={17} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="manual-version-notice" role="note">
            <AlertTriangle size={19} aria-hidden="true" />
            <div>
              <strong>Importante: esta página é uma versão de demonstração.</strong>
              <p>
                O site publicado no GitHub Pages não possui banco de dados nem
                autenticação segura. Os dados ficam neste navegador. Use somente
                informações fictícias e exporte um backup antes de limpar ou trocar
                o navegador.
              </p>
              <button className="manual-inline-link" type="button" onClick={() => navigate("/manual/relatorios-e-backup")}>
                Ler sobre backup e limites da versão <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </section>
        </>
      ) : guide ? (
        <>
          <div className="manual-page-heading manual-detail-heading">
            <div>
              <button className="manual-back-link" type="button" onClick={() => navigate("/manual")}>
                <ArrowLeft size={15} aria-hidden="true" /> Todos os guias
              </button>
              <span className="manual-eyebrow">Manual de uso</span>
              <h1>{guide.title}</h1>
              <p>{guide.summary}</p>
            </div>
            <span className="manual-detail-icon"><guide.icon size={26} aria-hidden="true" /></span>
            </div>

          <section className="manual-illustration-grid" aria-label="Capturas de tela com indicações">
            {guide.illustrations.map((illustration) => (
              <figure className="manual-illustration" key={illustration.src}>
                <img
                  src={illustration.src}
                  alt={illustration.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{illustration.caption}</figcaption>
              </figure>
            ))}
          </section>

          <div className="manual-detail-list">
            {guide.steps.map((step, index) => (
              <article className="panel manual-detail-step" key={step.title}>
                <div className="manual-detail-step-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="manual-detail-step-content">
                  <h2>{step.title}</h2>
                  {step.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {step.note && (
                    <div className="manual-step-note">
                      <AlertTriangle size={16} aria-hidden="true" />
                      <span>{step.note}</span>
                    </div>
                  )}
                  {step.actions && (
                    <div className="manual-open-actions">
                      {step.actions.map((action) => (
                        <OpenModuleButton key={action.href} action={action} onNavigate={navigate} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="manual-detail-footer">
            <button className="button button-outline" type="button" onClick={() => navigate("/manual")}>
              <ArrowLeft size={15} aria-hidden="true" /> Voltar ao índice
            </button>
          </div>
        </>
      ) : (
        <section className="panel manual-not-found">
          <Search size={28} aria-hidden="true" />
          <h1>Este guia não foi encontrado</h1>
          <p>Volte ao índice do manual para escolher uma instrução disponível.</p>
          <button className="button button-primary" type="button" onClick={() => navigate("/manual")}>
            <ArrowLeft size={15} aria-hidden="true" /> Ir ao manual
          </button>
        </section>
      )}
    </div>
  );
}
