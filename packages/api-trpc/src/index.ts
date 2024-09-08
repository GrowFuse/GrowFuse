import { initTRPC, TRPCError } from "@trpc/server";
import type { createContext } from "#context";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import { validateSession } from "auth";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const { user } = await validateSession(ctx.c);
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: { ...ctx, user },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(authMiddleware);
