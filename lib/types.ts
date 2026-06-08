/** Domain models shared across the data, service, API and UI layers. */

export interface Account {
  id: number;
  username: string;
  created_at: string;
}

export interface Patient {
  id: number;
  patient_name: string;
  age: number;
  doctor_consulted: string;
  address: string;
  phone_number: string;
  created_at: string;
}

export interface StaffMember {
  id: number;
  employee_name: string;
  profession: string;
  salary_amount: number;
  address: string;
  phone_number: string;
  created_at: string;
}

/** The authenticated user attached to a session token. */
export interface SessionUser {
  id: number;
  username: string;
}

/** Aggregated figures shown on the dashboard. */
export interface DashboardStats {
  patients: number;
  staff: number;
  payroll: number;
}
