import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;

describe("workspace compartilhado", () => {
  it("rejeita versão negativa antes de persistir", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.workspace.save({ state: {}, updatedBy: "SOUSA", version: -1 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejeita usuário responsável vazio", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.workspace.save({ state: {}, updatedBy: "", version: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
