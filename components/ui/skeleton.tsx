import { cn } from '@/lib/utils';

/** A shimmering placeholder block used to build skeleton loaders. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
  );
}
