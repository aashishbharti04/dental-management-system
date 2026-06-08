/**
 * Create the first admin account from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
 *
 * Replaces the original `ACCOUNT ADDITION.py` — but stores a bcrypt hash instead
 * of a plaintext password. Idempotent: skips creation if the admin already exists.
 * Run with: `npm run db:seed`
 */
import mysql from 'mysql2/promise';
import { dbConfig } from '../lib/env';
import { CREATE_TABLES_SQL } from '../lib/db/schema';
import { hashPassword } from '../lib/auth/password';

loadDotEnv();

async function main(): Promise<void> {
  const username = (process.env.ADMIN_USERNAME ?? 'admin').trim();
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (password.length < 8) {
    throw new Error('Set ADMIN_PASSWORD in .env to at least 8 characters before seeding.');
  }

  const cfg = dbConfig();
  const db = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
  });

  // Make sure the tables exist even if `db:init` was skipped.
  for (const statement of CREATE_TABLES_SQL) {
    await db.query(statement);
  }

  const [rows] = await db.execute('SELECT id FROM accounts WHERE username = ? LIMIT 1', [username]);
  if (Array.isArray(rows) && rows.length > 0) {
    console.log(`✔ Admin "${username}" already exists — nothing to do.`);
    await db.end();
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.execute('INSERT INTO accounts (username, password_hash) VALUES (?, ?)', [
    username,
    passwordHash,
  ]);
  await db.end();
  console.log(`✔ Created admin account "${username}". You can now sign in.`);
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
    console.error('✖ Seeding failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
