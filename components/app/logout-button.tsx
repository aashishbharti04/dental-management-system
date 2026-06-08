'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api-client';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      toast.success('Signed out');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Could not sign out. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={onClick} loading={loading}>
      {!loading && <LogOut className="h-4 w-4" aria-hidden />}
      <span className="hidden sm:inline">Sign out</span>
    </Button>
  );
}
