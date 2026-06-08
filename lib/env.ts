/**
 * Centralised, lazily-read environment configuration.
 *
 * Values are read on demand (not at import time) so that `next build` never fails
 * just because a runtime secret is absent. Secrets are validated the moment they
 * are actually used.
 */

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

/** MySQL connection settings, sourced from `DB_*` environment variables. */
export function dbConfig(): DbConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'dental_management_system',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  };
}

/**
 * Secret key used to sign and verify session JWTs.
 *
 * In production a strong `AUTH_SECRET` (>= 32 chars) is mandatory. In development
 * a clearly-insecure fallback keeps the app runnable out-of-the-box.
 */
export function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'AUTH_SECRET must be set to a strong value (at least 32 characters) in production.',
      );
    }
    return new TextEncoder().encode('dev-only-insecure-secret-change-me-please-32++');
  }
  return new TextEncoder().encode(secret);
}

/** Session lifetime in seconds (default: 8 hours). */
export function sessionMaxAge(): number {
  return Number(process.env.SESSION_MAX_AGE ?? 28_800);
}

/** Public, absolute site URL used for SEO metadata and sitemaps. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
