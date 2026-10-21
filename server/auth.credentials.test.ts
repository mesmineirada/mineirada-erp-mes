import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: {} as TrpcContext["req"], res: { cookie: () => undefined } as unknown as TrpcContext["res"] } satisfies TrpcContext;

describe("autenticação server-side e catálogo", () => {
  it("rejeita credenciais incompletas antes de acessar o servidor de autenticação", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.auth.login({ username: "SOUSA", password: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejeita as contas demonstrativas removidas sem criar sessão", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.auth.login({ username: "SOUSA", password: "senha-antiga" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("permite que administrador passe pela regra gerencial de autorização de OP", async () => {
    const adminContext = { ...context, user: { id: 2, openId: "legacy:KARITA", profile: "admin", role: "admin", name: "Karita" } as TrpcContext["user"] };
    const caller = appRouter.createCaller(adminContext);
    await expect(caller.production.authorize({ number: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("mantém a validação do endpoint gerencial para entrada inválida", async () => {
    const managerContext = { ...context, user: { id: 1, openId: "legacy:SOUSA", profile: "gestor", role: "admin", name: "Sousa" } as TrpcContext["user"] };
    const caller = appRouter.createCaller(managerContext);
    await expect(caller.production.authorize({ number: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("expõe o contrato paginado do autocomplete sem aceitar limite inválido", async () => {
    const caller = appRouter.createCaller(context);
    const page = await caller.catalog.products({ query: "", offset: 0, limit: 25 });
    expect(Array.isArray(page.rows)).toBe(true);
    expect(page.nextOffset === null || typeof page.nextOffset === "number").toBe(true);
    await expect(caller.catalog.products({ query: "", offset: 0, limit: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
