// Legacy exports - redirecting to new i18n system
// This file is kept for backward compatibility during migration

export { type Locale as LanguageCode } from '@/i18n/config';
export { locales, defaultLocale, localeNames, localeFlags } from '@/i18n/config';

// Re-export the useTranslation hook
export { useTranslation, useTranslations } from '@/hooks/useTranslation';

