/**
 * Web-specific tRPC context
 * Uses Auth.js for session resolution
 */

import { setCreateContext, type Context } from '@boletify/api/src/trpc';
import { auth } from './auth';

async function webCreateContext(): Promise<Context> {
  try {
    const session = await auth();
    
    if (session?.user?.id) {
      return {
        userId: parseInt(session.user.id, 10),
        session: session as Context['session'],
      };
    }
  } catch (error) {
    console.error('Auth context error:', error);
  }

  return {
    userId: undefined,
    session: null,
  };
}

setCreateContext(webCreateContext);