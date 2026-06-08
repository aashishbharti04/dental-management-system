import type { Metadata } from 'next';
import { listStaff } from '@/lib/services/staff';
import { StaffView } from '@/components/staff/staff-view';

export const metadata: Metadata = {
  title: 'Staff & Payroll',
  description: 'Manage staff records and monthly payroll.',
};
export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const staff = await listStaff();
  return <StaffView initialStaff={staff} />;
}
