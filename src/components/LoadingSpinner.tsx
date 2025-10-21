import type { HTMLAttributes } from 'react';

const joinClassNames = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

type LoadingSpinnerProps = {
  label?: string;
  spinnerClassName?: string;
} & HTMLAttributes<HTMLDivElement>;

export function LoadingSpinner({
  label = 'Loading…',
  className,
  spinnerClassName,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
      className={joinClassNames('flex items-center justify-center gap-3 text-sm text-gray-600', className)}
    >
      <span
        aria-hidden="true"
        className={joinClassNames(
          'inline-flex h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600',
          spinnerClassName,
        )}
      />
      <span>{label}</span>
    </div>
  );
}
