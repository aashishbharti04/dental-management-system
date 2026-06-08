import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

/** Brand tooth glyph used across the app. */
export function ToothMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5.5c-1.5-1.6-3.1-2.1-4.7-1.5C5 4.8 4 6.6 4 8.6c0 2 .5 3.6 1 5.5.4 1.6.5 4 1.5 5.5.5.7 1.5.6 1.9-.1.7-1.1 1-2.9 1.2-4.3.2-1 .7-1.6 1.4-1.6s1.2.6 1.4 1.6c.3 1.4.6 3.2 1.2 4.3.4.7 1.4.8 1.9.1 1-1.5 1.1-3.9 1.5-5.5.5-1.9 1-3.5 1-5.5 0-2-1-3.8-3.3-4.6-1.6-.6-3.2-.1-4.7 1.5Z" />
    </svg>
  );
}

/** Clickable wordmark (brand icon + name) linking home by default. */
export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ToothMark className="h-5 w-5" />
      </span>
      <span>{SITE.name}</span>
    </Link>
  );
}
