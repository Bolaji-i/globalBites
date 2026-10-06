'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function Register() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Set when the account exists but auto sign-in failed, so the banner reads as success
  const [accountCreated, setAccountCreated] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      });
    }
    
    // Clear general error
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = t('firstNameRequired');
      isValid = false;
    } else if (formData.firstName.trim().length < 1) {
      errors.firstName = t('firstNameRequired');
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = t('lastNameRequired');
      isValid = false;
    } else if (formData.lastName.trim().length < 1) {
      errors.lastName = t('lastNameRequired');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = t('emailRequired');
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t('invalidEmail');
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = t('passwordRequired');
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = t('passwordMinLength');
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('confirmRequired');
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('passwordsMismatch');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate terms acceptance
    if (!acceptTerms) {
      setError(t('acceptTermsError'));
      return;
    }
    
    // Validate form fields
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call registration API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Registration successful, now sign in automatically
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto sign-in failed
        setAccountCreated(true);
        setError(t('accountCreatedSignIn'));
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      } else {
        // Both registration and sign-in succeeded
        router.push('/account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('genericError'));
    } finally {
      setIsLoading(false);
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
            {t('createYourAccount')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('joinCommunity')}
          </p>
        </div>

        {/* Register Form */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow-md dark:bg-slate-900">
          {/* Error Message */}
          {error && (
            <div className={`mb-6 rounded-lg p-4 ${
              accountCreated 
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {accountCreated ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name Field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('firstName')}
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`block w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-slate-500 ${
                      fieldErrors.firstName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' 
                        : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                    placeholder={t('firstNamePlaceholder')}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name Field */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('lastName')}
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`block w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-slate-500 ${
                      fieldErrors.lastName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' 
                        : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                    placeholder={t('lastNamePlaceholder')}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-slate-500 ${
                    fieldErrors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' 
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                  placeholder={t('emailPlaceholder')}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('password')}
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full rounded-lg border px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-slate-500 ${
                    fieldErrors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' 
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('passwordHint')}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('confirmPassword')}
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full rounded-lg border px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder-slate-500 ${
                    fieldErrors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500' 
                      : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                {t('agreeToTerms')}{' '}
                <Link href="/terms" className="font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
                  {t('termsAndConditions')}
                </Link>{' '}
                {t('and')}{' '}
                <Link href="/privacy" className="font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
                  {t('privacyPolicy')}
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('creatingAccount')}
                </span>
              ) : (
                t('registerButton')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {t('orSignUpWith')}
              </span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {t('haveAccount')}{' '}
            <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
              {t('signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
