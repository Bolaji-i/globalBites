'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { type Locale, locales, localeNames, localeFlags, defaultLocale } from '@/i18n/config';

interface LanguageContextType {
  currentLanguage: Locale;
  setLanguage: (lang: Locale) => void;
  languages: Array<{
    code: Locale;
    name: string;
    flag: string;
  }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'globalbites-language';

export const languages = locales.map(code => ({
  code,
  name: localeNames[code],
  flag: localeFlags[code],
}));

interface IntlProviderProps {
  children: ReactNode;
  allMessages: Record<Locale, Record<string, unknown>>;
}

export function IntlProvider({ children, allMessages }: IntlProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(defaultLocale);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Locale;
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Locale) => {
    setCurrentLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    
    // Update document language attribute for accessibility
    document.documentElement.lang = lang;
  };

  // Get messages for the current language, fallback to English
  const messages = allMessages[currentLanguage] || allMessages[defaultLocale];

  // Render with default locale on first render; useEffect will update to saved language
  // This avoids returning null which causes a blank flash and hydration mismatches

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages }}>
      <NextIntlClientProvider locale={currentLanguage} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within an IntlProvider');
  }
  return context;
}

// Re-export Locale type for backward compatibility
export type { Locale as LanguageCode };
