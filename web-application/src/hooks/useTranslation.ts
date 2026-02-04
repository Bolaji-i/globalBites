'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/locales';

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  return getTranslation(currentLanguage);
}
