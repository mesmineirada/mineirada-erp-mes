import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("menu lateral móvel", () => {
  const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
  const manual = readFileSync(resolve(process.cwd(), "client/src/ManualPage.tsx"), "utf8");
  const localization = readFileSync(resolve(process.cwd(), "client/src/localization.ts"), "utf8");
  const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

  it("oferece importação em lote de clientes por planilha", () => {
    expect(app).toContain('import * as XLSX from "xlsx"');
    expect(app).toContain("Importar planilha");
    expect(app).toContain(".xlsx,.xls,.csv");
    expect(app).toContain("obrigatório");
    expect(app).toContain("Código duplicado na planilha");
    expect(app).toContain("Baixar modelo");
    expect(app).toContain("Importação em lote");
    expect(app).toContain("Receita: { kind: \"Receita\"");
    expect(app).toContain("Embalagem: { kind: \"Embalagem\"");
    expect(app).toContain("Funcionário: { kind: \"Funcionário\"");
    expect(app).toContain("/cadastros/embalagens/importar");
    expect(app).toContain("/cadastros/funcionarios/importar");
    expect(app).toContain("fields: [\"code\", \"product\"");
    expect(app).toContain("Colunas para atualização parcial");
    expect(app).toContain("downloadXlsxTemplate");
    expect(app).toContain("Instruções de importação");
    expect(app).toContain("\"Ordem de Produção\": { kind: \"Ordem de Produção\"");
    expect(app).toContain("/producao/ordens/importar");
    expect(app).toContain('label: "Embalagens", href: "/cadastros/embalagens"');
    expect(app).toContain('label: "Importações e reversões"');
    expect(app).toContain("Produto não encontrado no cadastro");
    expect(app).toContain("Cliente não encontrado no cadastro");
    expect(app).toContain("Histórico de importações");
    expect(app).toContain("Confirmar reversão");
    expect(app).toContain("previousRecords");
    expect(css).toContain(".client-tabs");
    expect(css).toContain(".import-preview");
  });

  it("evita encavalamento em listas, tabelas e layouts estreitos", () => {
    expect(css).toContain(".table-wrap td { white-space: normal;");
    expect(css).toContain("overflow-wrap: anywhere;");
    expect(css).toContain(".dashboard-list-row > span:first-child");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(css).toContain(".lookup-row, .search-card-row { flex-direction: column; }");
    expect(css).toContain(".page-header, .panel-head, .subsection-head");
  });

  it("exibe carregamento inicial enquanto o aplicativo é preparado", () => {
    expect(indexHtml).toContain('id="startup-loader"');
    expect(indexHtml).toContain('id="root"></div><div id="startup-loader"');
    expect(indexHtml).toContain('alt="Mineirada"');
    expect(indexHtml).toContain("Iniciando o sistema...");
    expect(indexHtml).toContain("Dica: use a busca lateral para encontrar rapidamente qualquer tela.");
    expect(indexHtml).toContain("background: #fbf8f2");
    expect(indexHtml).toContain("startup-loader-progress");
    expect(indexHtml).toContain("prefers-reduced-motion: reduce");
    expect(indexHtml).toContain("#startup-loader.app-ready");
    expect(readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8")).toContain('classList.add("app-ready")');
  });

  it("personaliza a saudação do splash pelo horário local", () => {
    expect(app).toContain('const hour = new Date().getHours()');
    expect(app).toContain('"Bom dia"');
    expect(app).toContain('"Boa tarde"');
    expect(app).toContain('"Boa noite"');
    expect(app).toContain('setTimeout(() => setShowSplash(false), 2000)');
  });

  it("oferece configurações de perfil, modo escuro e splash de boas-vindas", () => {
    expect(app).toContain('navigate("/perfil")');
    expect(app).toContain('Configurações de Perfil');
    expect(app).toContain('aria-pressed={theme === "dark"}');
    expect(app).toContain('setShowSplash(true)');
    expect(app).toContain('setTimeout(() => setShowSplash(false), 2000)');
    expect(app).toContain('className="welcome-splash"');
    expect(app).toContain('localStorage.setItem("mineirada_user_profile", JSON.stringify(profile))');
    expect(css).toContain('.welcome-splash');
    expect(css).toContain('welcome-splash-out 2s');
  });

  it("mantém o mesmo nome de estado aberto entre JSX e CSS", () => {
    expect(app).toContain('open && "sidebar-open"');
    expect(css).toContain(".sidebar.sidebar-open");
  });

  it("mantém overlay, fechamento explícito e botão de abertura acessíveis", () => {
    expect(app).toContain('className="sidebar-overlay"');
    expect(app).toContain('className="icon-button mobile-close"');
    expect(app).toContain('aria-label="Abrir menu"');
    expect(css).toContain(".sidebar-overlay");
    expect(css).toContain(".mobile-close, .menu-button");
    expect(app).toContain('document.body.style.overflow = "hidden"');
    expect(app).toContain('querySelector<HTMLElement>(".sidebar .nav-item")?.focus()');
    expect(app).toContain('main-scroll-locked');
  });

  it("mantém o atalho de autorização restrito ao perfil gerencial", () => {
    expect(app).toContain('href: "/producao/ordens?view=autorizar"');
    expect(app).toContain("managerOnly: true");
    expect(app).toContain('user.role === "gerente"');
    expect(app).toContain('authorizationView');
  });

  it("mantém busca, filtro e ordenação no CRUD reutilizável de estoques", () => {
    expect(app).toContain('const [filterBy, setFilterBy] = useState("Todos")');
    expect(app).toContain("filterOptions");
    expect(app).toContain('value={sortBy} onChange={setSortBy}');
  });

  it("exige confirmação antes da autorização e exibe carregamento de filtros", () => {
    expect(app).toContain('setConfirmTarget(o)');
    expect(app).toContain('title="Confirmar autorização da OP"');
    expect(app).toContain('Confirmar autorização');
    expect(app).toContain('value="lastMovement"');
    expect(app).toContain('value="location"');
    expect(app).toContain('Aplicando filtros…');
    expect(css).toContain(".filter-status");
    expect(css).toContain(".confirm-dialog");
  });

  it("protege exclusões com confirmação compartilhada", () => {
    expect(app).toContain("function useDeleteConfirmation()");
    expect(app).toContain('title="Confirmar exclusão"');
    expect(app).not.toContain("window.confirm(`Excluir");
    expect(app).toContain("requestDelete(`pedido");
    expect(app).toContain("requestDelete(`movimentação");
    expect(app).toContain("requestDelete(`registro de qualidade");
    expect(app).toContain("requestDelete(`ordem de manutenção");
  });

  it("exibe dados operacionais da Câmara Fria e histórico dedicado", () => {
    expect(app).toContain('columns={["Código", "Produto", "Unidade", "Saldo", "Temperatura", "Validade", "Última movimentação", "Local", "Categoria"]}');
    expect(app).toContain('event.action === "Autorização"');
    expect(app).toContain('navigate("/auditoria?view=autorizacoes")');
    expect(app).toContain('title={authorizationView ? "Histórico de Autorizações de OP"');
  });

  it("mantém os rótulos de cadastro em português do Brasil", () => {
    expect(localization).toContain('code: "Código"');
    expect(localization).toContain('name: "Nome"');
    expect(localization).toContain('category: "Categoria"');
    expect(localization).toContain('unit: "Unidade"');
    expect(localization).toContain('cost: "Custo unitário"');
    expect(localization).toContain('min: "Estoque mínimo"');
    expect(app).toContain('visibleFieldLabels[field] || field.replaceAll');
    expect(app).not.toContain('label={`${field.replaceAll("_", " ")}');
  });

  it("mantém o menu do usuário como sobreposição opaca e acessível", () => {
    expect(css).toContain('.topbar { position: relative; z-index: 50;');
    expect(css).toContain('background: var(--surface); color: var(--ink);');
    expect(css).toContain('.profile-menu { position: absolute; z-index: 70;');
    expect(css).toContain('.profile-menu { position: fixed; z-index: 70;');
    expect(app).toContain('if (!target.closest(".profile-menu-wrap")) setProfileOpen(false)');
    expect(app).toContain('if (event.key === "Escape")');
  });

  it("oferece pesquisa lateral e ajuda contextual para siglas técnicas", () => {
    expect(app).toContain('aria-label="Pesquisar telas e configurações"');
    expect(app).toContain('placeholder="Pesquisar no menu..."');
    expect(app).toContain('const visibleItems = menuItems.filter((item) => canSee(item) && matches(item));');
    expect(app).toContain('term="OP"');
    expect(app).toContain('term="BOM"');
    expect(app).toContain('term="MES"');
    expect(localization).toContain('OP: { label: "OP", meaning: "Ordem de Produção"');
    expect(localization).toContain('MP: { label: "MP", meaning: "Matéria-prima"');
    expect(css).toContain(".sidebar-search");
    expect(css).toContain(".term-help-popover");
  });

  it("oferece rastreabilidade pública por QR sem login e mostra a etapa atual", () => {
    expect(app).toContain('location.match(/^\\/consulta-pedido\\/(.+)$/)');
    expect(app).toContain('Nome (opcional)');
    expect(app).toContain('getProductionProgress');
    expect(app).toContain('Etapa atual');
    expect(app).toContain('Último apontamento:');
  });

  it("gera códigos de barras internos para produtos, matérias-primas e OPs", () => {
    expect(app).toContain('import JsBarcode from "jsbarcode"');
    expect(app).toContain('format: "CODE128"');
    expect(app).toContain('Códigos de barras internos');
    expect(app).toContain('Produto acabado');
    expect(app).toContain('Matéria-prima');
    expect(app).toContain('Ordem de Produção');
    expect(css).toContain(".barcode-grid");
    expect(css).toContain(".public-progress");
  });

  it("exige confirmação extra antes de uma saída de estoque", () => {
    expect(app).toContain('title="Confirmar saída de estoque"');
    expect(app).toContain("Saldo após saída");
    expect(app).toContain("Confirmar saída");
    expect(app).toContain("!confirmedExit");
  });

  it("registra operador, dispositivo e navegador em cada leitura", () => {
    expect(app).toContain("const operator = user.name || user.username");
    expect(app).toContain('device?: string; browser?: string');
    expect(app).toContain("operator, device, browser");
    expect(app).toContain("Operador: ${operator}");
    expect(app).toContain("Dispositivo: ${device}");
    expect(app).toContain("Navegador: ${browser}");
  });

  it("oferece câmera híbrida e fallback digitável após três tentativas", () => {
    expect(app).toContain("navigator.mediaDevices?.getUserMedia");
    expect(app).toContain('formats: ["qr_code", "code_128", "ean_13", "ean_8", "upc_a", "upc_e"]');
    expect(app).toContain("onFallbackRef.current()");
    expect(app).toContain("next >= 3");
    expect(app).toContain("Digite o código para continuar");
    expect(app).toContain("Leitor de códigos");
  });

  it("atualiza OP e estoque por código e permite controlar o rastreio público", () => {
    expect(app).toContain('title="Ler código operacional"');
    expect(app).toContain('"Atualização de OP"');
    expect(app).toContain('"Movimentação de estoque"');
    expect(app).toContain('title="Visibilidade do rastreio público"');
    expect(app).toContain("showProductionStage");
    expect(app).toContain("showLocation");
    expect(app).toContain('href: "/admin/rastreio-publico"');
  });

  it("lista produtos acabados na tela da Câmara Fria mesmo sem parâmetros completos", () => {
    expect(app).toContain('const allRows = data.products;');
    expect(app).toContain('title="Câmara Fria"');
    expect(app).toContain('Cadastrar produto acabado');
    expect(app).toContain('empty="Cadastre produtos acabados para acompanhar a Câmara Fria; parâmetros de armazenamento podem ser preenchidos depois."');
  });
  it("mantém o CRUD de receitas, produto cadastrado e ficha técnica de ingredientes", () => {
    expect(app).toContain('title="Cadastro de Receitas"');
    expect(app).toContain('products={data.products}');
    expect(app).toContain('Adicionar ingrediente');
    expect(app).toContain('materias-primas-receita');
    expect(app).toContain('quantidade maior que zero');
    expect(app).toContain('onEdit={openEdit} onDelete={remove}');
    expect(app).toContain('Salvar alterações');
  });
  it("baixa matérias-primas pela ficha técnica ao concluir uma OP", () => {
    expect(app).toContain('recipeRequirements(recipe, quantity)');
    expect(app).toContain('findMaterialForIngredient');
    expect(app).toContain('Baixa automática de matéria-prima pela conclusão da OP');
    expect(app).toContain('Estoque insuficiente para concluir a OP');
    expect(app).toContain('MOV-MP-${target.number}-${material.code || material.name}');
  });
  it("calcula e exibe o custo total da receita pelos custos das matérias-primas", () => {
    expect(app).toContain('function numericMoney');
    expect(app).toContain('const calculateRecipeCost');
    expect(app).toContain('numericMoney(material?.cost) * numericQuantity(ingredient.quantity)');
    expect(app).toContain('cost: totalCost > 0 ? totalCost.toFixed(2) : "—"');
    expect(app).toContain('Custo total da receita');
    expect(app).toContain('formatCurrency(numericMoney(r.cost))');
  });
  it("mantém a marca móvel e os artigos do manual em componente próprio", () => {
    expect(app).toContain('const LOGO = EMBEDDED_LOGO;');
    expect(app).toContain('const MARK = EMBEDDED_MARK;');
    expect(app).toContain('className="mobile-topbar-mark"');
    expect(app).not.toContain('className="login-illustration"');
    expect(manual).toContain("Manual de uso do Mineirada ERP + MES");
    expect(manual).toContain('navigate(`/manual/${item.slug}`)');
    expect(css).toContain(".manual-detail-step");
    expect(css).toContain('.mobile-topbar-mark { display: none;');
    expect(css).not.toContain('.login-illustration { display: block;');
  });

  it("usa Supabase Auth em vez de autenticação estática no site publicado", () => {
    expect(app).toContain("supabase.auth.signInWithPassword");
    expect(app).toContain("supabase.auth.onAuthStateChange");
    expect(app).toContain("window.setInterval(() => void synchronize(), 20_000)");
    expect(app).not.toContain("AUTH_USERS");
    expect(app).not.toContain("previewMode");
  });
});
