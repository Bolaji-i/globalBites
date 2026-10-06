'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from 'next-intl';
import { Button, Logo } from '@/components/ui';
import type { LanguageCode } from '@/contexts/LanguageContext';

export default function Header() {
  const { data: session, status } = useSession();
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('header');
  const tc = useTranslations('common');

  // The old dropdown could only be dismissed by clicking the trigger again,
  // which left it stranded open on any other interaction.
  useEffect(() => {
    if (!showUserMenu) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowUserMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLink =
    'font-sans text-sm text-paper-600 transition-colors hover:text-accent-600 ' +
    'dark:text-paper-400 dark:hover:text-accent-400';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-paper-200 bg-paper-50/90 backdrop-blur-md dark:border-paper-800 dark:bg-paper-950/90">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Wordmark — display serif, lowercase, the one piece of brand voice */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo className="h-7 w-7 text-accent-600 dark:text-accent-400" />
          <span className="font-display text-2xl font-semibold tracking-tight text-paper-900 transition-colors group-hover:text-accent-600 dark:text-paper-50 dark:group-hover:text-accent-400">
            globalBites
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/recipes" className={navLink}>
            {t('recipes')}
          </Link>
          <Link href="/about" className={navLink}>
            {t('aboutUs')}
          </Link>

          {/* Language selector — reduced to a bare select so it reads as text */}
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label={t('selectLanguage')}
              className="cursor-pointer appearance-none rounded-sm bg-transparent py-1 pr-6 font-sans text-sm text-paper-600 transition-colors hover:text-accent-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600/40 dark:text-paper-400 dark:hover:text-accent-400"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-paper-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <span className="h-4 w-px bg-paper-200 dark:bg-paper-800" aria-hidden="true" />

          {status === 'loading' ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-paper-200 dark:bg-paper-800" />
          ) : session ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
                className="flex items-center gap-2 rounded-sm py-1 font-sans text-sm text-paper-700 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600/40 dark:text-paper-300 dark:hover:text-accent-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 font-display text-sm font-semibold text-paper-50">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="hidden lg:inline">{session.user?.name || tc('user')}</span>
              </button>

              {showUserMenu && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-60 rounded-sm border border-paper-200 bg-paper-50 dark:border-paper-800 dark:bg-paper-950"
                >
                  <div className="border-b border-paper-200 px-4 py-3 dark:border-paper-800">
                    <p className="font-display text-sm font-semibold text-paper-900 dark:text-paper-50">
                      {session.user?.name}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-paper-500 dark:text-paper-400">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/account"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                      className="block rounded-sm px-3 py-2 font-sans text-sm text-paper-700 transition-colors hover:bg-paper-100 hover:text-accent-600 dark:text-paper-300 dark:hover:bg-paper-900 dark:hover:text-accent-400"
                    >
                      {tc('myAccount')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      role="menuitem"
                      className="block w-full rounded-sm px-3 py-2 text-left font-sans text-sm text-accent-700 transition-colors hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-950"
                    >
                      {tc('signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className={navLink}>
                {t('signInButton')}
              </Link>
              <Button href="/register" size="sm">
                {t('registerButton')}
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label={t('toggleMenu')}
          aria-expanded={showMobileMenu}
          className="rounded-sm p-2 text-paper-700 transition-colors hover:text-accent-600 md:hidden dark:text-paper-300 dark:hover:text-accent-400"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {showMobileMenu && (
        <div className="border-t border-paper-200 bg-paper-50 md:hidden dark:border-paper-800 dark:bg-paper-950">
          <div className="mx-auto max-w-6xl space-y-1 px-6 py-5">
            <Link
              href="/recipes"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2 font-display text-lg text-paper-900 dark:text-paper-50"
            >
              {t('recipes')}
            </Link>
            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className="block py-2 font-display text-lg text-paper-900 dark:text-paper-50"
            >
              {t('aboutUs')}
            </Link>

            <div className="border-t border-paper-200 pt-4 dark:border-paper-800">
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                aria-label={t('selectLanguage')}
                className="w-full cursor-pointer rounded-sm border border-paper-300 bg-transparent px-3 py-2 font-sans text-sm text-paper-700 dark:border-paper-700 dark:text-paper-300"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {status === 'loading' ? null : session ? (
              <div className="space-y-1 border-t border-paper-200 pt-4 dark:border-paper-800">
                <p className="font-display text-sm font-semibold text-paper-900 dark:text-paper-50">
                  {session.user?.name}
                </p>
                <p className="pb-2 font-sans text-xs text-paper-500 dark:text-paper-400">
                  {session.user?.email}
                </p>
                <Link
                  href="/account"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 font-sans text-sm text-paper-700 dark:text-paper-300"
                >
                  {tc('myAccount')}
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleSignOut();
                  }}
                  className="block w-full py-2 text-left font-sans text-sm text-accent-700 dark:text-accent-300"
                >
                  {tc('signOut')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-paper-200 pt-4 dark:border-paper-800">
                <Button href="/sign-in" variant="secondary" onClick={() => setShowMobileMenu(false)}>
                  {t('signInButton')}
                </Button>
                <Button href="/register" onClick={() => setShowMobileMenu(false)}>
                  {t('registerButton')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
