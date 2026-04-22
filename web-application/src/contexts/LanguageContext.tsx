'use client';

// Re-export everything from IntlProvider for backward compatibility
export { 
  useLanguage, 
  languages, 
  type LanguageCode 
} from './IntlProvider';

// Legacy LanguageProvider - use IntlProvider instead
export { IntlProvider as LanguageProvider } from './IntlProvider';

