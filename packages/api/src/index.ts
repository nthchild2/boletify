/**
 * @boletify/api
 * tRPC API server configuration
 */

import { createTRPCRouter } from './trpc';
import { authRouter, eventsRouter, ordersRouter, paymentsRouter } from './routers';

/**
 * Main app router
 * Combines all subrouters
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  events: eventsRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;

// Export utilities
export { createContext, setCreateContext, type Context } from './trpc';
export { createTRPCRouter, publicProcedure, protectedProcedure } from './trpc';
