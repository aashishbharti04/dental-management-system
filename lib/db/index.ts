import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getPool } from './pool';
import { ensureSchema } from './schema';

/**
 * Memoised one-time schema initialisation. On the first query of the process we
 * ensure all tables exist (replacing the manual "create database / create tables"
 * steps). If it fails (e.g. DB temporarily down) the promise is cleared so a later
 * call can retry.
 */
let schemaReady: Promise<void> | undefined;

function initOnce(): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema(getPool()).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

/** A value safely bindable to a parameterised query placeholder. */
export type QueryParam = string | number | bigint | boolean | Date | null;

/** Run a parameterised SELECT and return typed rows. */
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: QueryParam[] = [],
): Promise<T> {
  await initOnce();
  const [rows] = await getPool().execute<T>(sql, params);
  return rows;
}

/** Run a parameterised INSERT/UPDATE/DELETE and return the result header. */
export async function execute(sql: string, params: QueryParam[] = []): Promise<ResultSetHeader> {
  await initOnce();
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
