import type { Metadata } from 'next';
import { listPatients } from '@/lib/services/patients';
import { PatientsView } from '@/components/patients/patients-view';

export const metadata: Metadata = {
  title: 'Patients',
  description: 'Add, search and manage patient records.',
};
export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  const patients = await listPatients();
  return <PatientsView initialPatients={patients} />;
}
