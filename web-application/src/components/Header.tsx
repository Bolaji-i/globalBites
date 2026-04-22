'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { data: session, status } = useSession();
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const t = useTranslation();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <h1 className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            globalBites
          </h1>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* About Link */}
          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400"
          >
            {t.header.aboutUs}
          </Link>

          {/* Show user menu if logged in, otherwise show Sign In/Register */}
          {status === 'loading' ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          ) : session ? (
            /* User Menu */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-pink-500 hover:bg-pink-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-pink-500 dark:hover:bg-pink-950"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline">{session.user?.name || 'User'}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-200 p-3 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t.common.myAccount}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t.common.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sign In/Register Buttons (when not logged in) */
            <>
              <Link
                href="/sign-in"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-pink-500 dark:hover:bg-pink-950 dark:hover:text-pink-400"
              >
                {t.header.signInButton}
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-lg"
              >
                {t.header.registerButton}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
          aria-expanded={showMobileMenu}
          className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="container mx-auto space-y-3 px-4 py-4 sm:px-6">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t.header.aboutUs}
            </Link>

            {status === 'loading' ? null : session ? (
              <>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setShowMobileMenu(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {t.common.myAccount}
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleSignOut();
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  {t.common.signOut}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setShowMobileMenu(false)}
                  className="block rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  {t.header.signInButton}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-center text-sm font-semibold text-white shadow-md"
                >
                  {t.header.registerButton}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
