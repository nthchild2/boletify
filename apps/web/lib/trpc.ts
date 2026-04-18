/**
 * tRPC client for web app
 * Uses React Query + HTTP fetch adapter
 */

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@boletify/api';

export const trpc = createTRPCReact<AppRouter>();

/**
 * tRPC client configuration
 * Point to internal API route (bypasses external network)
 */
export const trpcClientConfig = {
  links: [
    {
      type: 'http',
      method: 'POST',
      headers() {
        // Auth.js automatically includes cookies via credentials: 'same-origin'
        return {};
      },
    },
  ],
};