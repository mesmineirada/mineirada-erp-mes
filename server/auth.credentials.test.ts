import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { sdk } from "./_core/sdk";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: {} as TrpcContext["req"], res: { cookie: () => undefined } as unknown as TrpcContext["res"] } satisfies TrpcContext;

describe("autenticação server-side e catálogo", () => {
  it("rejeita credenciais incompletas antes de acessar o servidor de autenticação", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.auth.login({ username: "SOUSA", password: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("mantém tokens de sessão independentes por usuário", async () => {
    const sousa = await sdk.createSessionToken("legacy:SOUSA", { name: "Sousa" });
    const karita = await sdk.createSessionToken("legacy:KARITA", { name: "Karita" });
    const decodedSousa = await sdk.verifySession(sousa);
    const decodedKarita = await sdk.verifySession(karita);
    expect(decodedSousa?.openId).toBe("legacy:SOUSA");
    expect(decodedKarita?.openId).toBe("legacy:KARITA");
    expect(decodedSousa?.openId).not.toBe(decodedKarita?.openId);
  });

  it("bloqueia autorização de OP para perfil administrador", async () => {
    const adminContext = { ...context, user: { id: 2, openId: "legacy:KARITA", profile: "admin", role: "admin", name: "Karita" } as TrpcContext["user"] };
    const caller = appRouter.createCaller(adminContext);
    await expect(caller.production.authorize({ number: "OP-NAO-AUTORIZAR" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("mantém a validação do endpoint gerencial para entrada inválida", async () => {
    const managerContext = { ...context, user: { id: 1, openId: "legacy:SOUSA", profile: "gestor", role: "admin", name: "Sousa" } as TrpcContext["user"] };
    const caller = appRouter.createCaller(managerContext);
    await expect(caller.production.authorize({ number: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("expõe o contrato paginado do autocomplete sem aceitar limite inválido", async () => {
    const authenticatedContext = {
      ...context,
      user: {
        id: 1,
        openId: "legacy:SOUSA",
        profile: "gestor",
        role: "admin",
        name: "Sousa",
        email: null,
        loginMethod: "credentials",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      } as TrpcContext["user"],
    };
    const caller = appRouter.createCaller(authenticatedContext);
    const page = await caller.catalog.products({ query: "", offset: 0, limit: 25 });
    expect(Array.isArray(page.rows)).toBe(true);
    expect(page.nextOffset === null || typeof page.nextOffset === "number").toBe(true);
    await expect(caller.catalog.products({ query: "", offset: 0, limit: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
