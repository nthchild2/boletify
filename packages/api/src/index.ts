/**
 * @boletify/api
 * tRPC API server configuration
 */

import { createTRPCRouter, mergeRouters } from './trpc';
import { authRouter } from './routers/auth';

/**
 * Main app router
 * Combines all subrouters
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

// Export utilities
export { createContext, setCreateContext, type Context } from './trpc';
export { createTRPCRouter, publicProcedure, protectedProcedure } from './trpc';
