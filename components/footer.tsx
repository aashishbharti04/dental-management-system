import Link from 'next/link';
import { Github, Instagram, Linkedin, Mail, Youtube } from 'lucide-react';
import { Logo } from '@/components/logo';
import { SITE } from '@/lib/constants';

const socials = [
  { href: SITE.social.linkedin, label: 'LinkedIn', icon: Linkedin },
  { href: SITE.social.github, label: 'GitHub', icon: Github },
  { href: SITE.social.youtube, label: 'YouTube', icon: Youtube },
  { href: SITE.social.instagram, label: 'Instagram', icon: Instagram },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/patients', label: 'Patients' },
  { href: '/staff', label: 'Staff & Payroll' },
];

/** Professional, site-wide footer with contact details and social links. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + open-source notice */}
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="max-w-md text-sm text-muted-foreground">{SITE.description}</p>
            <p className="max-w-md text-sm text-muted-foreground">
              This project is open source and available for educational, learning and community
              contributions.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="space-y-3">
            <h2 className="text-sm font-semibold">Explore</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition-colors hover:text-foreground" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + socials */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Contact</h2>
            <a
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={`mailto:${SITE.email}`}
            >
              <Mail className="h-4 w-4" aria-hidden />
              {SITE.email}
            </a>
            <div className="flex items-center gap-2 pt-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p>
            Built by{' '}
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {SITE.author}
            </a>{' '}
            · MIT Licensed
          </p>
        </div>
      </div>
    </footer>
  );
}
