import type { RowDataPacket } from 'mysql2';
import { execute, query } from '@/lib/db';
import type { StaffMember } from '@/lib/types';
import type { StaffInput } from '@/lib/validation/schemas';

type StaffRow = StaffMember & RowDataPacket;
interface CountRow extends RowDataPacket {
  count: number;
}
interface SumRow extends RowDataPacket {
  total: number | null;
}

/** List staff/salary records, optionally filtered by name or profession. */
export async function listStaff(searchTerm?: string): Promise<StaffMember[]> {
  const term = searchTerm?.trim();
  if (term) {
    const like = `%${term}%`;
    return query<StaffRow[]>(
      `SELECT * FROM salary_record
       WHERE employee_name LIKE ? OR profession LIKE ?
       ORDER BY created_at DESC, id DESC`,
      [like, like],
    );
  }
  return query<StaffRow[]>('SELECT * FROM salary_record ORDER BY created_at DESC, id DESC');
}

/** Insert a staff/salary record and return the stored row. */
export async function createStaff(input: StaffInput): Promise<StaffMember> {
  const result = await execute(
    `INSERT INTO salary_record (employee_name, profession, salary_amount, address, phone_number)
     VALUES (?, ?, ?, ?, ?)`,
    [input.employee_name, input.profession, input.salary_amount, input.address, input.phone_number],
  );
  const rows = await query<StaffRow[]>('SELECT * FROM salary_record WHERE id = ? LIMIT 1', [
    result.insertId,
  ]);
  const created = rows[0];
  if (!created) throw new Error('Failed to read back the newly created staff member.');
  return created;
}

/** Delete a staff record. Returns `true` only if a row was removed. */
export async function deleteStaff(id: number): Promise<boolean> {
  const result = await execute('DELETE FROM salary_record WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/** Count all staff records. */
export async function countStaff(): Promise<number> {
  const rows = await query<CountRow[]>('SELECT COUNT(*) AS count FROM salary_record');
  return rows[0]?.count ?? 0;
}

/** Sum of all salaries (monthly payroll). */
export async function totalPayroll(): Promise<number> {
  const rows = await query<SumRow[]>(
    'SELECT COALESCE(SUM(salary_amount), 0) AS total FROM salary_record',
  );
  return Number(rows[0]?.total ?? 0);
}
