/**
 * Initialise the database and tables. Idempotent — safe to run repeatedly.
 *
 * Replaces the original `DATABASE CREATION.py` + `TABLES CREATION.py`.
 * Run with: `npm run db:init`
 */
import mysql from 'mysql2/promise';
import { dbConfig } from '../lib/env';
import { CREATE_TABLES_SQL } from '../lib/db/schema';

loadDotEnv();

async function main(): Promise<void> {
  const cfg = dbConfig();

  if (!/^[A-Za-z0-9_]+$/.test(cfg.database)) {
    throw new Error(
      `Unsafe DB_NAME "${cfg.database}" — use letters, numbers and underscores only.`,
    );
  }

  // 1) Connect without selecting a database so we can create it if missing.
  const server = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
  });
  await server.query(
    `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await server.end();
  console.log(`✔ Database "${cfg.database}" is ready.`);

  // 2) Connect to the database and create the tables.
  const db = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
  });
  for (const statement of CREATE_TABLES_SQL) {
    await db.query(statement);
  }
  await db.end();
  console.log('✔ Tables are ready: accounts, patient_record, salary_record.');
}

/** Load variables from a local `.env` file (Node 20.12+ built-in). */
function loadDotEnv(): void {
  const proc = process as NodeJS.Process & { loadEnvFile?: (path?: string) => void };
  try {
    proc.loadEnvFile?.('.env');
  } catch {
    // .env is optional; environment variables may be provided another way.
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      '✖ Database initialisation failed:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  });
