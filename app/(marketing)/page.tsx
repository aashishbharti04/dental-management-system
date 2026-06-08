import Link from 'next/link';
import {
  ArrowRight,
  Database,
  Gauge,
  Github,
  Lock,
  MoonStar,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Badge } from '@/components/ui/badge';
import { SITE } from '@/lib/constants';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    description:
      'Bcrypt-hashed passwords, signed session cookies, parameterized queries and validated inputs — no SQL injection, no plaintext secrets.',
  },
  {
    icon: Users,
    title: 'Patient records',
    description: 'Add, search, view and remove patient records with instant client-side feedback.',
  },
  {
    icon: Stethoscope,
    title: 'Staff & payroll',
    description:
      'Track employees, professions and salaries with an automatic monthly payroll total.',
  },
  {
    icon: Search,
    title: 'Fast search',
    description: 'Filter patients and staff by name, doctor or profession as you type.',
  },
  {
    icon: MoonStar,
    title: 'Dark & light mode',
    description:
      'A polished, responsive interface that adapts to system preference or your choice.',
  },
  {
    icon: Gauge,
    title: 'Built for performance',
    description:
      'Server components, code-splitting and optimized assets for great Core Web Vitals.',
  },
];

const techStack = [
  'Next.js 14',
  'TypeScript',
  'Tailwind CSS',
  'MySQL',
  'Zod',
  'bcrypt',
  'jose (JWT)',
  'Radix UI',
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-in-up">
            <Badge className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden /> Open source · MIT licensed
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The modern way to run your <span className="text-primary">dental clinic</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
              {SITE.name} manages patient records, staff and payroll in one secure, fast and
              beautiful dashboard — rebuilt from a Python CLI into a production-ready web app.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Get started <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="h-4 w-4" aria-hidden /> View on GitHub
              </a>
            </div>
          </div>

          {/* Product mockup */}
          <Reveal className="relative" delay={0.1}>
            <div className="rounded-2xl border border-border bg-card shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                <span className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-3 gap-3">
                  {['Patients', 'Staff', 'Payroll'].map((label, i) => (
                    <div key={label} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-semibold">{['128', '14', '₹4.2L'][i]}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {[70, 52, 84, 38].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/15" />
                      <div className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border py-20 lg:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything a small clinic needs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Thoughtfully designed features, accessible components and a secure foundation.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.05}>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="border-t border-border bg-muted/30 py-20 lg:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A delightful dashboard
            </h2>
            <p className="mt-4 text-muted-foreground">
              Clean layouts, smooth animations, skeleton loaders and empty states throughout.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {['Dashboard overview', 'Patient management'].map((label, i) => (
              <Reveal key={label} delay={i * 0.05}>
                <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="bg-grid aspect-[16/10] p-6">
                    <div className="flex h-full flex-col gap-3">
                      <div className="h-6 w-1/3 rounded bg-muted" />
                      <div className="grid flex-1 grid-cols-3 gap-3">
                        <div className="rounded-lg bg-muted" />
                        <div className="rounded-lg bg-muted" />
                        <div className="rounded-lg bg-muted" />
                      </div>
                      <div className="h-24 rounded-lg bg-muted" />
                    </div>
                  </div>
                  <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                    {label}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Replace these placeholders with real screenshots in{' '}
            <code className="rounded bg-muted px-1.5 py-0.5">docs/screenshots/</code>.
          </p>
        </div>
      </section>

      {/* Tech */}
      <section id="tech" className="border-t border-border py-20 lg:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A modern, production-ready stack
            </h2>
            <p className="mt-4 text-muted-foreground">
              Type-safe end to end, secured at every layer, and ready to deploy to Vercel or any
              Node host with a MySQL database.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-primary" aria-hidden /> Hardened authentication &amp;
                session handling
              </li>
              <li className="flex items-center gap-3">
                <Database className="h-4 w-4 text-primary" aria-hidden /> MySQL with parameterized
                queries and a normalized schema
              </li>
              <li className="flex items-center gap-3">
                <Gauge className="h-4 w-4 text-primary" aria-hidden /> Optimized for performance and
                accessibility
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5">
        <div className="container flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="max-w-xl text-muted-foreground">
            Clone the repository, point it at your MySQL database and sign in — you will be up and
            running in minutes.
          </p>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Open the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
