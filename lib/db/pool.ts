import mysql, { type Pool } from 'mysql2/promise';
import { dbConfig } from '@/lib/env';

/**
 * A single shared connection pool per process. Created lazily so that importing
 * this module never opens a socket at build time — the pool is only created the
 * first time a query actually runs.
 */
let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    const cfg = dbConfig();
    pool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: cfg.connectionLimit,
      queueLimit: 0,
      enableKeepAlive: true,
      // Return DECIMAL columns (e.g. salary) as JS numbers instead of strings.
      decimalNumbers: true,
    });
  }
  return pool;
}

/** Close the pool (used by scripts and graceful shutdown). */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
