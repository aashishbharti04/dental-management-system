import type { RowDataPacket } from 'mysql2';
import { execute, query } from '@/lib/db';
import type { Patient } from '@/lib/types';
import type { PatientInput } from '@/lib/validation/schemas';

type PatientRow = Patient & RowDataPacket;
interface CountRow extends RowDataPacket {
  count: number;
}

/** List patients, optionally filtered by a search term (name or doctor). */
export async function listPatients(searchTerm?: string): Promise<Patient[]> {
  const term = searchTerm?.trim();
  if (term) {
    const like = `%${term}%`;
    return query<PatientRow[]>(
      `SELECT * FROM patient_record
       WHERE patient_name LIKE ? OR doctor_consulted LIKE ?
       ORDER BY created_at DESC, id DESC`,
      [like, like],
    );
  }
  return query<PatientRow[]>('SELECT * FROM patient_record ORDER BY created_at DESC, id DESC');
}

/** Fetch a single patient by id, or `null` if not found. */
export async function getPatient(id: number): Promise<Patient | null> {
  const rows = await query<PatientRow[]>('SELECT * FROM patient_record WHERE id = ? LIMIT 1', [id]);
  return rows[0] ?? null;
}

/** Insert a patient and return the stored row. */
export async function createPatient(input: PatientInput): Promise<Patient> {
  const result = await execute(
    `INSERT INTO patient_record (patient_name, age, doctor_consulted, address, phone_number)
     VALUES (?, ?, ?, ?, ?)`,
    [input.patient_name, input.age, input.doctor_consulted, input.address, input.phone_number],
  );
  const created = await getPatient(result.insertId);
  if (!created) throw new Error('Failed to read back the newly created patient.');
  return created;
}

/** Delete a patient. Returns `true` only if a row was actually removed. */
export async function deletePatient(id: number): Promise<boolean> {
  const result = await execute('DELETE FROM patient_record WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/** Count all patients. */
export async function countPatients(): Promise<number> {
  const rows = await query<CountRow[]>('SELECT COUNT(*) AS count FROM patient_record');
  return rows[0]?.count ?? 0;
}
