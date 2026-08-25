import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getNormalizedProducts, getWorkspaceState, loginWithCredentials, migrateWorkspaceToNormalized, saveWorkspaceState } from "./db";
import { sdk } from "./_core/sdk";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure.input(z.object({ username: z.string().min(1).max(64), password: z.string().min(1).max(128) })).mutation(async ({ input, ctx }) => { const user = await loginWithCredentials(input.username, input.password); if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos." }); const token = await sdk.createSessionToken(user.openId, { name: user.name || user.username || "", expiresInMs: ONE_YEAR_MS }); ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS }); return { username: user.username || "", name: user.name || user.username || "", role: user.profile || user.role }; }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  workspace: router({
    get: publicProcedure.query(async () => {
      const record = await getWorkspaceState();
      if (!record) return { data: null, version: 0, updatedBy: null, updatedAt: null };
      return { data: JSON.parse(record.state) as unknown, version: record.version, updatedBy: record.updatedBy, updatedAt: record.updatedAt };
    }),
    save: publicProcedure.input(z.object({ state: z.unknown(), updatedBy: z.string().min(1).max(128), version: z.number().int().min(0) })).mutation(async ({ input }) => {
      const result = await saveWorkspaceState(JSON.stringify(input.state), input.updatedBy, input.version);
      return result;
    }),
    migrateNormalized: protectedProcedure.input(z.object({ state: z.unknown() })).mutation(async ({ input }) => migrateWorkspaceToNormalized(input.state)),
  }),
  catalog: router({
    products: publicProcedure.input(z.object({ query: z.string().max(120).default(""), offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(100).default(25) })).query(({ input }) => getNormalizedProducts(input.query, input.offset, input.limit)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
