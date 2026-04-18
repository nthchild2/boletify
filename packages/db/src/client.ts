import { neon, NeonQueryFunction, NeonResult, NeonPool, NeonServerlessPool } from '@neondatabase/serverless';

// Environment-based connection
function createConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(databaseUrl);
}

// For serverless edge environments (Vercel, Netlify, Cloudflare Workers)
export const sql = createConnection();

// For local development or testing (creates a pool)
let _pool: NeonServerlessPool | undefined;

export function getPool(): NeonServerlessPool {
  if (!_pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _pool = new neon(databaseUrl).pool;
  }
  return _pool;
}

// Close pool connection (call in app cleanup)
export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = undefined;
  }
}

// Type for executing queries
export type Sql = ReturnType<typeof neon>;