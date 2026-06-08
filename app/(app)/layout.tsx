import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/cookies';
import { AppShell } from '@/components/app/app-shell';

/** Server-side auth guard for every authenticated route (defense in depth
 * alongside the edge middleware). */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return <AppShell user={user}>{children}</AppShell>;
}
