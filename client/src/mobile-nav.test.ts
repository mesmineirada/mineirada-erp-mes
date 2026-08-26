import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("menu lateral móvel", () => {
  const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
  const localization = readFileSync(resolve(process.cwd(), "client/src/localization.ts"), "utf8");
  const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

  it("exibe carregamento inicial enquanto o aplicativo é preparado", () => {
    expect(indexHtml).toContain('id="startup-loader"');
    expect(indexHtml).toContain("Iniciando o sistema...");
    expect(indexHtml).toContain("startup-loader-progress");
    expect(indexHtml).toContain("prefers-reduced-motion: reduce");
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
    expect(app).toContain('localStorage.setItem("mineirada_user_profile", JSON.stringify(next))');
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

  it("mantém logo, marca móvel e ilustração industrial com assets estáveis", () => {
    expect(app).toContain('const LOGO = EMBEDDED_LOGO;');
    expect(app).toContain('const MARK = EMBEDDED_MARK;');
    expect(app).toContain('className="mobile-topbar-mark"');
    expect(app).not.toContain('className="login-illustration"');
    expect(app).toContain('src={MANUAL_ART}');
    expect(css).toContain('.mobile-topbar-mark { display: none;');
    expect(css).not.toContain('.login-illustration { display: block;');
  });
});
