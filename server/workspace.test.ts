import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const anonymousContext = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

const caller = appRouter.createCaller(anonymousContext);

describe("workspace compartilhado", () => {
  it("nega a leitura do estado operacional sem sessão", async () => {
    await expect(caller.workspace.get()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("nega a gravação do estado operacional sem sessão", async () => {
    await expect(
      caller.workspace.save({ state: {}, updatedBy: "identidade-forjada", version: 0 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("nega a leitura do catálogo sem sessão", async () => {
    await expect(caller.catalog.products({ query: "", offset: 0, limit: 25 })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
