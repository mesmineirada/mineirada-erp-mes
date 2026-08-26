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
  });
});
