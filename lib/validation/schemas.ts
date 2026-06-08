import { z } from 'zod';

/**
 * Zod schemas validate every value at the API boundary — the layer of input
 * validation that the original CLI completely lacked.
 */

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required').max(200),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Use letters, numbers, dot, dash or underscore only'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(200, 'Password is too long'),
});

const phoneNumber = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number')
  .max(20, 'Phone number is too long')
  .regex(/^[0-9+\-()\s]+$/, 'Phone may contain digits and + - ( ) only');

export const patientSchema = z.object({
  patient_name: z.string().trim().min(1, 'Name is required').max(100),
  age: z.coerce
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(150, 'Please enter a realistic age'),
  doctor_consulted: z.string().trim().min(1, 'Doctor consulted is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(255),
  phone_number: phoneNumber,
});

export const staffSchema = z.object({
  employee_name: z.string().trim().min(1, 'Employee name is required').max(100),
  profession: z.string().trim().min(1, 'Profession is required').max(80),
  salary_amount: z.coerce
    .number({ invalid_type_error: 'Salary must be a number' })
    .min(0, 'Salary cannot be negative')
    .max(99_999_999, 'Salary is too large'),
  address: z.string().trim().min(1, 'Address is required').max(255),
  phone_number: phoneNumber,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
