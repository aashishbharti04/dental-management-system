'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PatientForm } from './patient-form';
import { apiFetch } from '@/lib/api-client';
import { getInitials } from '@/lib/utils';
import type { Patient } from '@/lib/types';

type Status = 'loading' | 'ready' | 'error';

export function PatientsView({ initialPatients }: { initialPatients: Patient[] }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [status, setStatus] = useState<Status>('ready');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (q: string) => {
    setStatus('loading');
    try {
      const { patients: rows } = await apiFetch<{ patients: Patient[] }>(
        `/api/patients${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      );
      setPatients(rows);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  // Debounced search — skips the very first render (server already provided data).
  useEffect(() => {
    if (!searching) return;
    const timer = setTimeout(() => load(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query, searching, load]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/patients/${pendingDelete.id}`, { method: 'DELETE' });
      setPatients((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      toast.success(`Deleted ${pendingDelete.patient_name}`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete the patient.');
    } finally {
      setDeleting(false);
    }
  }

  function handleAdded(patient: Patient) {
    setAddOpen(false);
    if (query.trim()) {
      load(query.trim());
    } else {
      setPatients((prev) => [patient, ...prev]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          {status === 'ready' ? <Badge variant="secondary">{patients.length}</Badge> : null}
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add patient
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="pl-9"
          placeholder="Search by name or doctor…"
          aria-label="Search patients"
          value={query}
          onChange={(e) => {
            setSearching(true);
            setQuery(e.target.value);
          }}
        />
      </div>

      {status === 'loading' ? (
        <PatientsSkeleton />
      ) : status === 'error' ? (
        <ErrorState
          title="Couldn't load patients"
          description="There was a problem reaching the server."
          onRetry={() => load(query.trim())}
        />
      ) : patients.length === 0 ? (
        <EmptyState
          icon={query.trim() ? Search : UserPlus}
          title={query.trim() ? 'No matching patients' : 'No patients yet'}
          description={
            query.trim()
              ? 'Try a different name or doctor.'
              : 'Add your first patient to get started.'
          }
          action={
            query.trim() ? undefined : (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden /> Add patient
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.5fr_auto] gap-4 border-b border-border bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
            <span>Patient</span>
            <span>Doctor</span>
            <span>Phone</span>
            <span>Age</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-border">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[1.5fr_1fr_1fr_0.5fr_auto] md:items-center md:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(patient.patient_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{patient.patient_name}</p>
                    <p className="truncate text-sm text-muted-foreground md:hidden">
                      {patient.doctor_consulted} · Age {patient.age}
                    </p>
                  </div>
                </div>
                <div className="hidden truncate text-sm md:block">{patient.doctor_consulted}</div>
                <div className="hidden text-sm text-muted-foreground md:block">
                  {patient.phone_number}
                </div>
                <div className="hidden text-sm md:block">{patient.age}</div>
                <div className="flex items-center justify-between md:justify-end">
                  <span className="text-sm text-muted-foreground md:hidden">
                    {patient.phone_number}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingDelete(patient)}
                    aria-label={`Delete ${patient.patient_name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add patient dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add patient</DialogTitle>
            <DialogDescription>Enter the patient&apos;s details below.</DialogDescription>
          </DialogHeader>
          <PatientForm onSuccess={handleAdded} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete patient?</DialogTitle>
            <DialogDescription>
              This permanently removes{' '}
              <span className="font-medium text-foreground">{pendingDelete?.patient_name}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} loading={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientsSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <ul className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
