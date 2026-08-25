import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getWorkspaceState, saveWorkspaceState } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
