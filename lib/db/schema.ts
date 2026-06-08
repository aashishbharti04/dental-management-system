import type { Pool } from 'mysql2/promise';

/**
 * Idempotent schema definition. This replaces the original `DATABASE CREATION.py`
 * and `TABLES CREATION.py` with safe `CREATE TABLE IF NOT EXISTS` statements that
 * can be run repeatedly without error.
 *
 * Improvements over the original schema:
 *  - AUTO_INCREMENT primary keys on every table.
 *  - Passwords stored as bcrypt hashes (`password_hash`), never plaintext.
 *  - Salary stored as DECIMAL (money), phone as VARCHAR (keeps leading zeros).
 *  - NOT NULL constraints, indexes on searchable columns, `created_at` timestamps.
 */
export const CREATE_TABLES_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS accounts (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS patient_record (
     id INT AUTO_INCREMENT PRIMARY KEY,
     patient_name VARCHAR(100) NOT NULL,
     age INT NOT NULL,
     doctor_consulted VARCHAR(100) NOT NULL,
     address VARCHAR(255) NOT NULL,
     phone_number VARCHAR(20) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_patient_name (patient_name),
     INDEX idx_patient_doctor (doctor_consulted)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS salary_record (
     id INT AUTO_INCREMENT PRIMARY KEY,
     employee_name VARCHAR(100) NOT NULL,
     profession VARCHAR(80) NOT NULL,
     salary_amount DECIMAL(12, 2) NOT NULL,
     address VARCHAR(255) NOT NULL,
     phone_number VARCHAR(20) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_employee_name (employee_name)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

/** Create any missing tables. Safe to call repeatedly. */
export async function ensureSchema(pool: Pool): Promise<void> {
  for (const statement of CREATE_TABLES_SQL) {
    await pool.query(statement);
  }
}
