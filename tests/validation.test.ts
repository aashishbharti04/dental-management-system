import { describe, expect, it } from 'vitest';
import { loginSchema, patientSchema, staffSchema } from '@/lib/validation/schemas';

describe('patientSchema', () => {
  it('accepts a valid patient and coerces age to a number', () => {
    const result = patientSchema.safeParse({
      patient_name: 'Jane Doe',
      age: '34',
      doctor_consulted: 'Dr. Smith',
      address: '12 Main St',
      phone_number: '+91 98765 43210',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.age).toBe(34);
  });

  it('rejects an empty name', () => {
    const result = patientSchema.safeParse({
      patient_name: '',
      age: 20,
      doctor_consulted: 'Dr. X',
      address: 'Y',
      phone_number: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative age', () => {
    const result = patientSchema.safeParse({
      patient_name: 'A',
      age: -1,
      doctor_consulted: 'Dr. X',
      address: 'Y',
      phone_number: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid phone number', () => {
    const result = patientSchema.safeParse({
      patient_name: 'A',
      age: 20,
      doctor_consulted: 'Dr. X',
      address: 'Y',
      phone_number: 'not-a-phone',
    });
    expect(result.success).toBe(false);
  });
});

describe('staffSchema', () => {
  it('coerces salary to a number', () => {
    const result = staffSchema.safeParse({
      employee_name: 'John',
      profession: 'Hygienist',
      salary_amount: '25000.50',
      address: 'Y',
      phone_number: '1234567',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.salary_amount).toBeCloseTo(25000.5);
  });
});

describe('loginSchema', () => {
  it('requires a username and password', () => {
    expect(loginSchema.safeParse({ username: '', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ username: 'admin', password: 'pw' }).success).toBe(true);
  });
});
