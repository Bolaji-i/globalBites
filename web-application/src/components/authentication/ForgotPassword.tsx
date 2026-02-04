'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement forgot password logic
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🍽️</span>
            <h1 className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent">
              globalBites
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSubmitted
              ? "We've sent you a reset link!"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
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
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:via-rose-600 hover:to-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              >
                Send Reset Link
              </button>

              {/* Back to Sign In */}
              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Check Your Email
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to
                </p>
                <p className="mt-1 font-medium text-pink-600 dark:text-pink-400">
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
                    <p className="font-medium">Didn't receive the email?</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Check your spam folder</li>
                      <li>• Make sure the email address is correct</li>
                      <li>• Wait a few minutes and check again</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full rounded-lg border-2 border-pink-500 px-4 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950"
                >
                  Try Another Email
                </button>

                <Link
                  href="/sign-in"
                  className="block w-full rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:via-rose-600 hover:to-red-600 hover:shadow-xl"
                >
                  Back to Sign In
                </Link>
              </div>

              {/* Support Link */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Still having trouble?{' '}
                <Link href="/support" className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
                  Contact Support
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Additional Help */}
        {!isSubmitted && (
          <div className="mt-6 rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-800/50">
            <div className="flex gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p className="font-medium">Password reset tips:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Link expires in 1 hour</li>
                  <li>• Can only be used once</li>
                  <li>• Check spam if not received</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
