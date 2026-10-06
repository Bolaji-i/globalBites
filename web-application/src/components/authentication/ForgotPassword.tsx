'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function ForgotPassword() {
  const t = useTranslations('auth.forgotPassword');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('sendFailed'));
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo className="h-9 w-9 text-teal-600 dark:text-teal-400" />
            <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              globalBites
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            {t('forgotTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isSubmitted
              ? t('sentResetLink')
              : t('noWorries')}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow-md dark:bg-slate-900">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/50">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('email')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {t('enterEmailHint')}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('sending') : t('sendButton')}
              </button>

              {/* Back to Sign In */}
              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('backToSignIn')}
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>

              {/* Success Message */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('checkYourEmail')}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {t('sentLinkTo')}
                </p>
                <p className="mt-1 font-medium text-teal-600 dark:text-teal-400">
                  {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="rounded-lg bg-blue-50 p-4 text-left dark:bg-blue-900/20">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium">{t('didntReceive')}</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• {t('checkSpam')}</li>
                      <li>• {t('checkCorrect')}</li>
                      <li>• {t('waitAndCheck')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full rounded-lg border-2 border-teal-600 px-4 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950"
                >
                  {t('tryAnotherEmail')}
                </button>

                <Link
                  href="/sign-in"
                  className="block w-full rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                >
                  {t('backToSignIn')}
                </Link>
              </div>

              {/* Support Link */}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('stillTrouble')}{' '}
                <Link href="/support" className="font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
                  {t('contactSupport')}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Additional Help */}
        {!isSubmitted && (
          <div className="mt-6 rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-slate-900/50">
            <div className="flex gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <p className="font-medium">{t('resetTips')}</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• {t('linkExpires')}</li>
                  <li>• {t('usedOnce')}</li>
                  <li>• {t('checkSpamTip')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
