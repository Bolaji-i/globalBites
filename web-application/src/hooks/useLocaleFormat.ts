'use client';

import { useLocale, useTranslations } from 'next-intl';
import { localizedCountryName } from '@/lib/countries';

type Translator = ReturnType<typeof useTranslations>;

/**
 * Turn a stored value such as "Middle Eastern" into a message key
 * ("middleEastern"). Cuisines, countries and difficulties are saved in the
 * database as English strings, so the stored value doubles as the lookup key.
 */
function toKey(value: string): string {
  return value
    .trim()
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, next: string | undefined) => (next ? next.toUpperCase() : ''))
    .replace(/^./, (first) => first.toLowerCase());
}

// Falls back to the raw value for anything without a translation
function lookup(t: Translator, value: string): string {
  const key = toKey(value);
  return key && t.has(key) ? t(key) : value;
}

/**
 * Translated display labels for values stored on a recipe
 */
export function useRecipeLabels() {
  const tCuisines = useTranslations('cuisines');
  const tCountries = useTranslations('countries');
  const tDifficulty = useTranslations('difficulty');
  const locale = useLocale();

  return {
    cuisine: (value: string) => lookup(tCuisines, value),
    // Hand-written translations first, then the browser's own country names
    country: (value: string) => {
      const translated = lookup(tCountries, value);
      return translated !== value ? translated : localizedCountryName(value, locale);
    },
    difficulty: (value: string) => lookup(tDifficulty, value),
  };
}

/**
 * Translated achievement title/description, keyed by the achievement `key`.
 * The fallback is the English text stored in the database.
 */
export function useAchievementLabels() {
  const t = useTranslations('achievements');

  return {
    title: (key: string, fallback: string = key) =>
      t.has(`${key}.title`) ? t(`${key}.title`) : fallback,
    description: (key: string, fallback: string = '') =>
      t.has(`${key}.description`) ? t(`${key}.description`) : fallback,
  };
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 86_400_000],
  ['month', 30 * 86_400_000],
  ['week', 7 * 86_400_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
];

/**
 * Date formatting in the currently selected language
 */
export function useLocaleFormat() {
  const locale = useLocale();

  return {
    date: (
      value: string | Date,
      options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    ) => new Date(value).toLocaleDateString(locale, options),

    /** "3 days ago", "yesterday", "now" — largest unit that fits */
    relativeTime: (value: string | Date) => {
      const diff = Math.max(0, Date.now() - new Date(value).getTime());
      const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      for (const [unit, ms] of RELATIVE_UNITS) {
        if (diff >= ms) return format.format(-Math.floor(diff / ms), unit);
      }
      return format.format(0, 'second');
    },
  };
}
