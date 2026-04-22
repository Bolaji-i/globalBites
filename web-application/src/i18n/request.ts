import { getRequestConfig } from 'next-intl/server';
import { type Locale, defaultLocale } from './config';

export default getRequestConfig(async () => {
  // For now, we'll use a cookie-based approach for locale
  // This can be enhanced with URL-based routing later
  const locale: Locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
