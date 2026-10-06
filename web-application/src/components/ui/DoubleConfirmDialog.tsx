'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { cn } from './cn';

interface Step {
  title: string;
  message: ReactNode;
  /** Label of the button that moves forward (step one) or commits (step two) */
  action: string;
}

interface DoubleConfirmDialogProps {
  /** First ask, then the "are you really sure" follow-up */
  steps: [Step, Step];
  cancelLabel: string;
  backLabel: string;
  /** Shown on the final button while `busy` */
  busyLabel: string;
  /** e.g. "Step 1 of 2" — read out by screen readers alongside the title */
  stepLabel: (step: number) => string;
  busy?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Destructive-action dialog that needs two deliberate clicks. Replaces the
 * browser's `confirm()`, which cannot be styled or translated and is one
 * stray Enter key away from deleting something.
 *
 * Mount it only while it should be visible — each mount starts at step one.
 */
export function DoubleConfirmDialog({
  steps,
  cancelLabel,
  backLabel,
  busyLabel,
  stepLabel,
  busy = false,
  error,
  onCancel,
  onConfirm,
}: DoubleConfirmDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const safeButtonRef = useRef<HTMLButtonElement>(null);
  const step = steps[stepIndex];
  const isFinal = stepIndex === 1;

  // Focus lands on the safe choice at every step, so Enter never destroys anything
  useEffect(() => {
    safeButtonRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Capture phase + stop: a modal underneath must not close as well
        event.stopPropagation();
        if (!busy) onCancel();
        return;
      }
      if (event.key !== 'Tab') return;

      const buttons = panelRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!buttons || buttons.length === 0) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [busy, onCancel]);

  const secondaryButton =
    'rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors ' +
    'hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ' +
    'disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="double-confirm-title"
        aria-describedby="double-confirm-message"
        className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start gap-4">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors',
              isFinal
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {stepLabel(stepIndex + 1)}
            </p>
            <h2
              id="double-confirm-title"
              className="mt-1 text-lg font-bold text-slate-900 dark:text-white"
            >
              {step.title}
            </h2>
            <p
              id="double-confirm-message"
              className="mt-2 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {step.message}
            </p>
          </div>
        </div>

        {/* Progress: two segments, the second fills on the final ask */}
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          <span className="h-1 flex-1 rounded-full bg-red-500" />
          <span
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              isFinal ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'
            )}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {isFinal ? (
            <>
              <button
                ref={safeButtonRef}
                type="button"
                onClick={() => setStepIndex(0)}
                disabled={busy}
                className={secondaryButton}
              >
                {backLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:opacity-50"
              >
                {busy ? busyLabel : step.action}
              </button>
            </>
          ) : (
            <>
              <button
                ref={safeButtonRef}
                type="button"
                onClick={onCancel}
                className={secondaryButton}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => setStepIndex(1)}
                className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                {step.action}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
