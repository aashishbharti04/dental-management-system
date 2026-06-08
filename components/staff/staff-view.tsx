'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Stethoscope, Trash2 } from 'lucide-react';
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
import { StaffForm } from './staff-form';
import { apiFetch } from '@/lib/api-client';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { StaffMember } from '@/lib/types';

type Status = 'loading' | 'ready' | 'error';

export function StaffView({ initialStaff }: { initialStaff: StaffMember[] }) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [status, setStatus] = useState<Status>('ready');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (q: string) => {
    setStatus('loading');
    try {
      const { staff: rows } = await apiFetch<{ staff: StaffMember[] }>(
        `/api/staff${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      );
      setStaff(rows);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!searching) return;
    const timer = setTimeout(() => load(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query, searching, load]);

  const payroll = staff.reduce((sum, member) => sum + Number(member.salary_amount), 0);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/staff/${pendingDelete.id}`, { method: 'DELETE' });
      setStaff((prev) => prev.filter((s) => s.id !== pendingDelete.id));
      toast.success(`Deleted ${pendingDelete.employee_name}`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete the staff member.');
    } finally {
      setDeleting(false);
    }
  }

  function handleAdded(member: StaffMember) {
    setAddOpen(false);
    if (query.trim()) {
      load(query.trim());
    } else {
      setStaff((prev) => [member, ...prev]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Staff &amp; Payroll</h1>
          {status === 'ready' ? <Badge variant="secondary">{staff.length}</Badge> : null}
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add staff member
        </Button>
      </div>

      {status === 'ready' && staff.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total monthly payroll</p>
          <p className="text-2xl font-bold tracking-tight">{formatCurrency(payroll)}</p>
        </div>
      ) : null}

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="pl-9"
          placeholder="Search by name or profession…"
          aria-label="Search staff"
          value={query}
          onChange={(e) => {
            setSearching(true);
            setQuery(e.target.value);
          }}
        />
      </div>

      {status === 'loading' ? (
        <StaffSkeleton />
      ) : status === 'error' ? (
        <ErrorState
          title="Couldn't load staff"
          description="There was a problem reaching the server."
          onRetry={() => load(query.trim())}
        />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={query.trim() ? Search : Stethoscope}
          title={query.trim() ? 'No matching staff' : 'No staff yet'}
          description={
            query.trim()
              ? 'Try a different name or profession.'
              : 'Add your first staff member to get started.'
          }
          action={
            query.trim() ? undefined : (
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden /> Add staff member
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-border bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
            <span>Employee</span>
            <span>Profession</span>
            <span>Salary</span>
            <span>Phone</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-border">
            {staff.map((member) => (
              <li
                key={member.id}
                className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(member.employee_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.employee_name}</p>
                    <p className="truncate text-sm text-muted-foreground md:hidden">
                      {member.profession} · {formatCurrency(Number(member.salary_amount))}
                    </p>
                  </div>
                </div>
                <div className="hidden truncate text-sm md:block">{member.profession}</div>
                <div className="hidden text-sm font-medium md:block">
                  {formatCurrency(Number(member.salary_amount))}
                </div>
                <div className="hidden text-sm text-muted-foreground md:block">
                  {member.phone_number}
                </div>
                <div className="flex items-center justify-between md:justify-end">
                  <span className="text-sm text-muted-foreground md:hidden">
                    {member.phone_number}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingDelete(member)}
                    aria-label={`Delete ${member.employee_name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add staff dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add staff member</DialogTitle>
            <DialogDescription>Enter the employee&apos;s details below.</DialogDescription>
          </DialogHeader>
          <StaffForm onSuccess={handleAdded} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete staff member?</DialogTitle>
            <DialogDescription>
              This permanently removes{' '}
              <span className="font-medium text-foreground">{pendingDelete?.employee_name}</span>.
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

function StaffSkeleton() {
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
