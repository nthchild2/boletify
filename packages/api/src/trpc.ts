/**
 * tRPC server utilities and procedures
 */

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

type CreateContextOptions = {
  userId?: number;
};

/**
 * Create tRPC context
 * Context is available in all procedures
 */
export const createContext = (opts?: CreateContextOptions) => {
  return {
    userId: opts?.userId,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

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
export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.userId) {
    throw new Error('UNAUTHORIZED');
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: opts.ctx.userId,
    },
  });
});

/**
 * Router and procedure exports
 */
export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

export default t;
