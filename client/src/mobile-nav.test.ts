import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("menu lateral móvel", () => {
  const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

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

  it("mantém logo, marca móvel e ilustração industrial com assets estáveis", () => {
    expect(app).toContain('/manus-storage/mineirada-logo_d080bf7c.png');
    expect(app).toContain('/manus-storage/mineirada-mark_b4da7297.png');
    expect(app).toContain('/manus-storage/mineirada-industrial-line_2d57a9e5.png');
    expect(app).toContain('className="mobile-topbar-mark"');
    expect(app).not.toContain('className="login-illustration"');
    expect(app).toContain('src={MANUAL_ART}');
    expect(css).toContain('.mobile-topbar-mark { display: none;');
    expect(css).not.toContain('.login-illustration { display: block;');
  });
});
