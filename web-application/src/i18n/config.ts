export type Locale = 'en' | 'es' | 'fr' | 'it' | 'de' | 'ja' | 'zh';

export const locales: Locale[] = ['en', 'es', 'fr', 'it', 'de', 'ja', 'zh'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  de: '🇩🇪',
  ja: '🇯🇵',
  zh: '🇨🇳',
};
