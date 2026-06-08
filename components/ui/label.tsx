import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/** Form label, styled and accessible (pair with input `id`/`htmlFor`). */
export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium leading-none text-foreground', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';
