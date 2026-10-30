import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  authorizeNormalizedProductionOrder,
  getNormalizedProducts,
  getWorkspaceState,
  loginWithCredentials,
  migrateWorkspaceToNormalized,
  saveWorkspaceState,
} from "./db";

const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
  const profile = String(ctx.user?.profile || "").toLowerCase();
  if (!["gestor", "gerente"].includes(profile)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "A autorização de OP é exclusiva para usuários com cargo de gerência." });
  }
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(128) }))
      .mutation(async ({ input, ctx }) => {
        const user = await loginWithCredentials(input.username, input.password);
        if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos." });
        const token = await sdk.createSessionToken(user.openId, {
          name: user.name || user.username || "",
          expiresInMs: ONE_YEAR_MS,
        });
        ctx.res.cookie(COOKIE_NAME, token, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: ONE_YEAR_MS,
        });
        return {
          username: user.username || "",
          name: user.name || user.username || "",
          role: user.profile || user.role,
        };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workspace: router({
    get: protectedProcedure.query(async () => {
      const record = await getWorkspaceState();
      if (!record) return { data: null, version: 0, updatedBy: null, updatedAt: null };
      return { data: record.state, version: record.version, updatedBy: record.updatedBy, updatedAt: record.updatedAt };
    }),
    save: protectedProcedure
      .input(
        z.object({
          state: z.unknown(),
          version: z.number().int().min(0),
          // Kept optional for old clients; it is never trusted as audit identity.
          updatedBy: z.string().max(128).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const actor = ctx.user.email || ctx.user.username || ctx.user.name || ctx.user.openId;
        return saveWorkspaceState(input.state, actor, input.version);
      }),
    migrateNormalized: protectedProcedure
      .input(z.object({ state: z.unknown() }))
      .mutation(async ({ input }) => migrateWorkspaceToNormalized(input.state)),
  }),
  catalog: router({
    products: protectedProcedure
      .input(
        z.object({
          query: z.string().max(120).default(""),
          offset: z.number().int().min(0).default(0),
          limit: z.number().int().min(1).max(100).default(25),
        }),
      )
      .query(({ input }) => getNormalizedProducts(input.query, input.offset, input.limit)),
  }),
  production: router({
    authorize: managerProcedure
      .input(z.object({ number: z.string().min(1).max(128) }))
      .mutation(({ input, ctx }) => authorizeNormalizedProductionOrder(input.number, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
