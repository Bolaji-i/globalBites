import type { ReactNode } from 'react';
import { cn } from './cn';

/**
 * Small-caps kicker that sits above a headline. The magazine "eyebrow" —
 * it does the categorising work that a coloured pill badge would do in a
 * typical dashboard UI, without adding another shape to the page.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em]',
        'text-paper-500 dark:text-paper-400',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Hairline divider. In this system rules replace card borders and shadows as
 * the primary way of separating content.
 */
export function Rule({
  className,
  weight = 'hair',
}: {
  className?: string;
  weight?: 'hair' | 'thick';
}) {
  return (
    <hr
      className={cn(
        'border-0 bg-paper-200 dark:bg-paper-800',
        weight === 'hair' ? 'h-px' : 'h-0.5',
        className
      )}
    />
  );
}

/**
 * Section headline block: eyebrow + display serif heading + optional lede.
 * Centralised so every section on the site opens the same way.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-paper-900 sm:text-5xl dark:text-paper-50">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 font-display text-lg leading-relaxed text-paper-600 dark:text-paper-300">
          {lede}
        </p>
      )}
    </div>
  );
}

/**
 * Metadata run: "35 min · Easy · Ghanaian". Middots instead of icon chips,
 * which keeps recipe rows quiet enough for the photography to lead.
 */
export function MetaLine({
  items,
  className,
}: {
  items: Array<string | null | undefined>;
  className?: string;
}) {
  const shown = items.filter(Boolean) as string[];
  if (shown.length === 0) return null;

  return (
    <p
      className={cn(
        'font-sans text-sm text-paper-500 dark:text-paper-400',
        className
      )}
    >
      {shown.join(' · ')}
    </p>
  );
}
