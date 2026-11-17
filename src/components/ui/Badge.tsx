import type { ReactNode } from 'react';

export type BadgeVariant = 'blue' | 'emerald' | 'amber' | 'slate' | 'rose';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-700/70 dark:bg-blue-950/80 dark:text-blue-200',
  emerald:
    'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-600/80 dark:bg-emerald-950/80 dark:text-emerald-200',
  amber:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-600/80 dark:bg-amber-950/80 dark:text-amber-200',
  slate:
    'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
  rose: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-600/80 dark:bg-rose-950/80 dark:text-rose-200',
};

export function Badge({
  variant = 'slate',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-tight ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
