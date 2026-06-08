import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/cookies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the Dental Management System dashboard.',
};

export default async function LoginPage() {
  if (await getSessionUser()) redirect('/dashboard');

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to manage your clinic.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-44 w-full" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          First time here?{' '}
          <Link className="font-medium text-primary hover:underline" href="/register">
            Create the admin account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
