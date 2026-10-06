import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/**
 * The one button in the system. Before this existed the app had eight
 * different padding pairs and two radii for what was meant to be the same
 * control — every new surface re-typed the utilities by hand.
 *
 * Editorial rules: near-square corners, hairline borders, no shadows, and
 * text set in the UI face rather than the display serif.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent-600/40 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-paper-50 dark:focus-visible:ring-offset-paper-950 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-600 text-paper-50 hover:bg-accent-700 ' +
    'dark:bg-accent-500 dark:hover:bg-accent-400 dark:text-paper-950',
  secondary:
    'border border-paper-300 text-paper-900 hover:border-paper-900 hover:bg-paper-100 ' +
    'dark:border-paper-700 dark:text-paper-100 dark:hover:border-paper-400 dark:hover:bg-paper-900',
  ghost:
    'text-paper-700 hover:text-accent-600 hover:bg-paper-100 ' +
    'dark:text-paper-300 dark:hover:text-accent-400 dark:hover:bg-paper-900',
  danger:
    'text-accent-800 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-950',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { href?: never };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in rest && rest.href) {
    return (
      <Link {...(rest as ComponentProps<typeof Link>)} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(rest as ComponentProps<'button'>)} className={classes}>
      {children}
    </button>
  );
}
