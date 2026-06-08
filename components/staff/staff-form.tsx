'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError, apiFetch } from '@/lib/api-client';
import type { StaffMember } from '@/lib/types';

interface FieldConfig {
  name: keyof StaffMember;
  label: string;
  type?: string;
  autoFocus?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  min?: number;
  step?: string;
}

const formFields: FieldConfig[] = [
  { name: 'employee_name', label: 'Full name', autoFocus: true },
  { name: 'profession', label: 'Profession' },
  {
    name: 'salary_amount',
    label: 'Monthly salary',
    type: 'number',
    inputMode: 'decimal',
    min: 0,
    step: '0.01',
  },
  { name: 'address', label: 'Address' },
  { name: 'phone_number', label: 'Phone number', type: 'tel', inputMode: 'tel' },
];

export function StaffForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: (staff: StaffMember) => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      formFields.map((f) => [f.name, String(data.get(f.name) ?? '')]),
    );

    setLoading(true);
    try {
      const { staff } = await apiFetch<{ staff: StaffMember }>('/api/staff', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success(`Added ${staff.employee_name}`);
      onSuccess(staff);
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        const fieldErrors: Record<string, string | undefined> = {};
        for (const [key, value] of Object.entries(err.details)) fieldErrors[key] = value?.[0];
        setErrors(fieldErrors);
        setFormError('Please fix the highlighted fields.');
      } else {
        setFormError(err instanceof Error ? err.message : 'Could not add the staff member.');
      }
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </p>
      ) : null}

      {formFields.map((field) => {
        const error = errors[field.name];
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              inputMode={field.inputMode}
              min={field.min}
              step={field.step}
              autoFocus={field.autoFocus}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${field.name}-error` : undefined}
            />
            {error ? (
              <p id={`${field.name}-error`} className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {loading ? 'Saving…' : 'Add staff member'}
        </Button>
      </div>
    </form>
  );
}
