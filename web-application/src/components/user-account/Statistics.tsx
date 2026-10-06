'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Globe, Clock, Flame, Target, Trophy, UtensilsCrossed, Heart, type LucideIcon } from 'lucide-react';
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

interface StatsData {
  overview: {
    recipesTried: number;
    countriesExplored: number;
    kitchenHours: number;
    streak: number;
  };
  monthly: { month: string; date?: string; recipes: number; cooked: number; saved: number }[];
  topCuisines: { cuisine: string; count: number; percentage: number; color: string }[];
  milestones: { key?: string; title: string; date: string; icon: string }[];
  communityImpact: {
    recipesCreated: number;
    favoritesByOthers: number;
    favoritesByUser: number;
  };
}

export default function Statistics() {
  const t = useTranslations('account.statistics');
  const labels = useRecipeLabels();
  const achievementLabels = useAchievementLabels();
  const format = useLocaleFormat();
  const [data, setData] = useState<StatsData | null>(null);

  const count = (chunks: React.ReactNode) => (
    <span className="font-semibold text-slate-900 dark:text-white">{chunks}</span>
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/statistics')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  const overview = data?.overview ?? { recipesTried: 0, countriesExplored: 0, kitchenHours: 0, streak: 0 };
  const monthly = data?.monthly ?? [];
  const topCuisines = data?.topCuisines ?? [];
  const milestones = data?.milestones ?? [];
  const impact = data?.communityImpact ?? { recipesCreated: 0, favoritesByOthers: 0, favoritesByUser: 0 };

  const maxMonthly =
    Math.max(1, ...monthly.map((s) => s.recipes + s.cooked + s.saved));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-teal-600 p-6 text-white shadow-sm">
          <BookOpen className="h-8 w-8 mb-2" />
          <div className="text-3xl font-bold">{overview.recipesTried}</div>
          <div className="text-sm text-white/80">{t('totalTried')}</div>
        </div>

        <div className="rounded-lg bg-emerald-600 p-6 text-white shadow-sm">
          <Globe className="h-8 w-8 mb-2" />
          <div className="text-3xl font-bold">{overview.countriesExplored}</div>
          <div className="text-sm text-white/80">{t('countriesExplored')}</div>
        </div>

        <div className="rounded-lg bg-slate-600 p-6 text-white shadow-sm">
          <Clock className="h-8 w-8 mb-2" />
          <div className="text-3xl font-bold">{overview.kitchenHours}h</div>
          <div className="text-sm text-white/80">{t('timeInKitchen')}</div>
        </div>

        <div className="rounded-lg bg-orange-500 p-6 text-white shadow-sm">
          <Flame className="h-8 w-8 mb-2" />
          <div className="text-3xl font-bold">{overview.streak}</div>
          <div className="text-sm text-white/80">{t('dayStreak')}</div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('monthly')}</h2>
        {monthly.every((m) => m.recipes + m.cooked + m.saved === 0) ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('monthlyEmpty')}
          </div>
        ) : (
          <div className="space-y-2">
            {monthly.map((stat) => {
              const totalWidth = ((stat.recipes + stat.cooked + stat.saved) / maxMonthly) * 100;
              return (
                <div key={stat.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-slate-600 dark:text-slate-400">{stat.date ? format.date(stat.date, { month: 'short', timeZone: 'UTC' }) : stat.month}</div>
                  <div className="flex-1">
                    <div className="relative h-8 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div
                        className="absolute h-full bg-teal-600"
                        style={{ width: `${totalWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.rich('createdCount', { count: stat.recipes, b: count })}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.rich('cookedCount', { count: stat.cooked, b: count })}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.rich('savedCount', { count: stat.saved, b: count })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal-600" />
            <span className="text-slate-600 dark:text-slate-400">{t('created')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal-600" />
            <span className="text-slate-600 dark:text-slate-400">{t('cooked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-400">{t('saved')}</span>
          </div>
        </div>
      </div>

      {/* Top Cuisines */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('topCuisines')}</h2>
        {topCuisines.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('topCuisinesEmpty')}
          </div>
        ) : (
          <div className="space-y-4">
            {topCuisines.map((cuisine) => (
              <div key={cuisine.cuisine}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">{labels.cuisine(cuisine.cuisine)}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {t('cooksShare', { count: cuisine.count, percentage: cuisine.percentage })}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full ${cuisine.color}`} style={{ width: `${cuisine.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('milestones')}</h2>
        {milestones.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('milestonesEmpty')}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-teal-600" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
                    {(() => {
                      const Icon = ICON_MAP[milestone.icon];
                      return Icon ? <Icon className="h-6 w-6" /> : <span className="text-2xl">{milestone.icon}</span>;
                    })()}
                  </div>
                  <div className="flex-1 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{milestone.key ? achievementLabels.title(milestone.key, milestone.title) : milestone.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{format.date(milestone.date, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Community Impact */}
      <div className="rounded-lg bg-teal-600 p-6 text-white shadow-sm">
        <h2 className="mb-6 text-xl font-bold">{t('impact')}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.recipesCreated}</div>
            <div className="text-sm text-white/80">{t('recipesCreated')}</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.favoritesByOthers}</div>
            <div className="text-sm text-white/80">{t('savesByOthers')}</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.favoritesByUser}</div>
            <div className="text-sm text-white/80">{t('recipesYouSaved')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
