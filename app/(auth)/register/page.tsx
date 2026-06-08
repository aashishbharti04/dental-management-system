import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create the first administrator account for your clinic.',
};

export default function RegisterPage() {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          The first account becomes the administrator. After that, new accounts can be added from
          inside the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
