'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Globe, Flame, Target, Trophy, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAchievementLabels, useLocaleFormat, useRecipeLabels } from '@/hooks/useLocaleFormat';

const ICON_MAP: Record<string, LucideIcon> = {
  'target': Target,
  'trophy': Trophy,
  'globe': Globe,
  'utensils-crossed': UtensilsCrossed,
  'flame': Flame,
  'heart': Heart,
};

interface ProfileOverviewProps {
  user: {
    bio: string;
    location: string;
  };
}

interface RecentRecipe {
  id: string;
  title: string;
  image: string | null;
  cuisine: string | null;
  saves: number;
  createdAt: string;
}

interface PassportEntry {
  country: string;
  cuisine: string;
  count: number;
}

interface AchievementEntry {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface OverviewData {
  recentRecipes: RecentRecipe[];
  cuisinePassport: PassportEntry[];
  achievements: AchievementEntry[];
  streak: number;
  stats: {
    recipesCreated: number;
    recipesSaved: number;
    recipesTried: number;
    countriesExplored: number;
  };
}

// Map country/cuisine to flag emoji for display
const COUNTRY_FLAGS: Record<string, string> = {
  Italy: '🇮🇹', Italian: '🇮🇹',
  Japan: '🇯🇵', Japanese: '🇯🇵',
  Mexico: '🇲🇽', Mexican: '🇲🇽',
  India: '🇮🇳', Indian: '🇮🇳',
  Thailand: '🇹🇭', Thai: '🇹🇭',
  France: '🇫🇷', French: '🇫🇷',
  China: '🇨🇳', Chinese: '🇨🇳',
  Greece: '🇬🇷', Greek: '🇬🇷',
  Spain: '🇪🇸', Spanish: '🇪🇸',
  'United States': '🇺🇸', American: '🇺🇸',
  Korea: '🇰🇷', Korean: '🇰🇷',
  Vietnam: '🇻🇳', Vietnamese: '🇻🇳',
};


export default function ProfileOverview({ user }: ProfileOverviewProps) {
  const t = useTranslations('account.overview');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const achievementLabels = useAchievementLabels();
  const format = useLocaleFormat();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // Bio editing state
  const [bio, setBio] = useState(user.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio);
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/user/profile-overview')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startEditBio = () => {
    setBioDraft(bio);
    setIsEditingBio(true);
  };

  const cancelEditBio = () => {
    setBioDraft(bio);
    setIsEditingBio(false);
  };

  const saveBio = async () => {
    setSavingBio(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: bioDraft }),
      });
      if (res.ok) {
        setBio(bioDraft);
        setIsEditingBio(false);
      }
    } finally {
      setSavingBio(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{t('quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-sm"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {tc('home')}
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t('browseRecipes')}
            </Link>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('createRecipe')}
            </Link>
          </div>
        </div>

        {/* Bio Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{t('aboutMe')}</h2>
          {isEditingBio ? (
            <div className="space-y-3">
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                rows={4}
                placeholder={t('bioPlaceholder')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveBio}
                  disabled={savingBio}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {savingBio ? tc('saving') : tc('save')}
                </button>
                <button
                  onClick={cancelEditBio}
                  disabled={savingBio}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {tc('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-300">
                {bio || <span className="italic text-slate-400">{t('noBio')}</span>}
              </p>
              <button
                onClick={startEditBio}
                className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400"
              >
                {bio ? t('editBio') : t('addBio')}
              </button>
            </>
          )}
        </div>

        {/* Recent Recipes */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('recentRecipes')}</h2>
            <Link href="/recipes" className="text-sm font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
              {t('viewAll')}
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{tc('loading')}</p>
          ) : data && data.recentRecipes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {data.recentRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                  <div className="relative h-40 bg-slate-200 dark:bg-slate-700">
                    {recipe.image && (
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    {recipe.cuisine && (
                      <div className="mb-1 text-xs text-teal-600 dark:text-teal-400">{labels.cuisine(recipe.cuisine)}</div>
                    )}
                    <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> {t('saves', { count: recipe.saves })}</span>
                      <span>{format.relativeTime(recipe.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                {t('noRecipes')}
              </p>
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {t('createFirst')}
              </Link>
            </div>
          )}
        </div>

        {/* Cuisine Passport */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Globe className="h-6 w-6 text-teal-600" /> {t('passport')}</h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            {data ? t('passportSummary', { count: data.stats.countriesExplored }) : tc('loading')}
          </p>
          {data && data.cuisinePassport.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.cuisinePassport.map((entry) => (
                <div
                  key={entry.country}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-2xl">
                    {COUNTRY_FLAGS[entry.country] || COUNTRY_FLAGS[entry.cuisine] || '🌐'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">{labels.country(entry.country)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {t('recipesTriedCount', { count: entry.count })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <p className="text-sm italic text-slate-400">
              {t('passportEmpty')}
            </p>
          ) : null}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{t('quickStats')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('recipesSaved')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data ? data.stats.recipesSaved : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('recipesTried')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data ? data.stats.recipesTried : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('countriesExplored')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {data ? data.stats.countriesExplored : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{t('achievements')}</h2>
          <div className="space-y-3">
            {data?.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  achievement.unlocked
                    ? 'bg-teal-50 dark:bg-teal-900/20'
                    : 'bg-slate-100 opacity-50 dark:bg-slate-800/50'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                  {(() => {
                    const Icon = ICON_MAP[achievement.icon];
                    return Icon ? <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" /> : <span className="text-2xl">{achievement.icon}</span>;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white">{achievementLabels.title(achievement.key, achievement.title)}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{achievementLabels.description(achievement.key, achievement.description)}</div>
                </div>
                {achievement.unlocked && (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
            {!loading && !data?.achievements.length && (
              <p className="text-sm italic text-slate-400">{t('noAchievements')}</p>
            )}
          </div>
        </div>

        {/* Cooking Streak */}
        <div className="rounded-lg bg-teal-700 p-6 text-white shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-8 w-8" />
            <h2 className="text-xl font-bold">{t('streak')}</h2>
          </div>
          <div className="text-4xl font-bold">
            {data ? t('streakDays', { count: data.streak }) : '--'}
          </div>
          <p className="mt-2 text-sm text-white/90">
            {data && data.streak > 0
              ? t('streakKeep')
              : t('streakStart')}
          </p>
        </div>
      </div>
    </div>
  );
}
