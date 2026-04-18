import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

type DbClient = ReturnType<typeof drizzle>;

let _db: DbClient | null = null;

function getDb(): DbClient {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _db = drizzle(neon(databaseUrl));
  }
  return _db;
}

function createLazyProxy<T extends object>(getter: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const obj = getter();
      return obj[prop as keyof T];
    },
    apply(_target, _this, args) {
      return (getter() as Function)(...args);
    },
  });
}

export const db = createLazyProxy(getDb);
export const sql = createLazyProxy(() => neon(process.env.DATABASE_URL || ''));

export default db;