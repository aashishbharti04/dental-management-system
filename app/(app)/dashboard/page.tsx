import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Stethoscope, UserPlus, Users, Wallet } from 'lucide-react';
import { countPatients, listPatients } from '@/lib/services/patients';
import { countStaff, totalPayroll } from '@/lib/services/staff';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [patients, staff, payroll, recent] = await Promise.all([
    countPatients(),
    countStaff(),
    totalPayroll(),
    listPatients(),
  ]);
  const recentPatients = recent.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your clinic.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Patients" value={String(patients)} href="/patients" />
        <StatCard icon={Stethoscope} label="Staff members" value={String(staff)} href="/staff" />
        <StatCard
          icon={Wallet}
          label="Monthly payroll"
          value={formatCurrency(payroll)}
          href="/staff"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent patients</CardTitle>
          <Link
            href="/patients"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </CardHeader>
        <CardContent>
          {recentPatients.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No patients yet"
              description="Add your first patient and they will appear here."
              action={
                <Link
                  href="/patients"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Add a patient
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {recentPatients.map((patient) => (
                <li key={patient.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(patient.patient_name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{patient.patient_name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {patient.doctor_consulted}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {formatDate(patient.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
