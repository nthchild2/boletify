/**
 * tRPC server utilities and procedures
 * Context factory pattern - apps provide their own session resolution
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export type Session = {
  user: {
    id: string;
    email?: string;
    name?: string | null;
    role?: string;
  };
} | null;

export type Context = {
  userId: number | undefined;
  session: Session;
};

let _createContext: (opts: { headers?: Headers }) => Context | Promise<Context> = async () => ({
  userId: undefined,
  session: null,
});

export function createContext(opts?: { headers?: Headers }) {
  return _createContext(opts);
}

export function setCreateContext(fn: (opts: { headers?: Headers }) => Context | Promise<Context>) {
  _createContext = fn;
}

/**
 * Initialize tRPC with context and data transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.code === 'BAD_REQUEST' ? error.cause : null,
    },
  }),
});

/**
 * Public procedure (no authentication required)
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure (requires authentication)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

/**
 * Router and procedure exports
 */
export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

export default t;
