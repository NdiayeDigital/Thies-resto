import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

// Connection pool caching
declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const createPool = () => {
  if (!process.env.SQL_HOST && !process.env.DATABASE_URL) {
    return null;
  }
  if (!global._postgresPool) {
    try {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: 15000,
      });

      global._postgresPool.on('error', (err) => {
        console.error('Unexpected error on idle SQL pool client:', err);
      });
    } catch (e) {
      console.warn('[AI Studio] SQL Pool initialization failed:', e);
      return null;
    }
  }
  return global._postgresPool;
};

let db: any;
try {
  const pool = createPool();
  if (pool) {
    db = drizzle(pool, { schema });
  } else {
    throw new Error('No SQL_HOST configured');
  }
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy({}, {
    get: (_, prop) => {
      if (prop === 'query') return new Proxy({}, { get: () => noOp });
      if (prop === 'select') return () => ({
        from: () => ({
          where: () => ({ limit: async () => [] }),
          orderBy: async () => []
        })
      });
      if (prop === 'insert') return () => ({
        values: () => ({
          returning: async () => [],
          onConflictDoNothing: async () => [],
          onConflictDoUpdate: () => ({ returning: async () => [] })
        })
      });
      if (prop === 'update') return () => ({
        set: () => ({ where: () => ({ returning: async () => [] }) })
      });
      if (prop === 'delete') return () => ({ where: () => ({ returning: async () => [] }) });
      return async () => [];
    }
  });
}

export { db };
