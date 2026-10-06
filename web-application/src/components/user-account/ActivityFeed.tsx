'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, FileText, Heart, ChefHat, Trophy, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAchievementLabels, useLocaleFormat } from '@/hooks/useLocaleFormat';

const ICON_MAP: Record<string, LucideIcon> = {
  'file-text': FileText,
  'heart': Heart,
  'chef-hat': ChefHat,
  'trophy': Trophy,
};

interface ActivityEvent {
  id: string;
  type: 'recipe_created' | 'recipe_saved' | 'cooked' | 'achievement';
  title: string;
  description: string;
  at: string;
  icon: string;
  color: string;
  // Raw parts of the English `description`, sent so it can be rebuilt per language
  recipeTitle?: string;
  authorName?: string;
  achievementKey?: string;
}

interface JournalEntry {
  id: string;
  recipeId: string;
  recipe: string;
  image: string | null;
  rating: number | null;
  notes: string | null;
  cookedAt: string;
}

interface ActivityData {
  events: ActivityEvent[];
  cookingJournal: JournalEntry[];
  thisWeek: {
    recipesCreated: number;
    recipesSaved: number;
    recipesCooked: number;
  };
}

export default function ActivityFeed() {
  const t = useTranslations('account.activity');
  const tDetail = useTranslations('recipes.detail');
  const achievementLabels = useAchievementLabels();
  const format = useLocaleFormat();
  const [data, setData] = useState<ActivityData | null>(null);

  const describe = (event: ActivityEvent) => {
    if (event.type === 'recipe_saved' && event.recipeTitle && event.authorName) {
      return t('savedBy', { title: event.recipeTitle, author: event.authorName });
    }
    if (event.type === 'achievement' && event.achievementKey) {
      const title = achievementLabels.title(event.achievementKey, '');
      const description = achievementLabels.description(event.achievementKey, '');
      if (title && description) return `${title} - ${description}`;
    }
    return event.description;
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/activity')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch((err) => console.error('Failed to load activity:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  const events = data?.events ?? [];
  const cookingJournal = data?.cookingJournal ?? [];
  const thisWeek = data?.thisWeek ?? { recipesCreated: 0, recipesSaved: 0, recipesCooked: 0 };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Activity Feed - Left Column */}
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('recent')}</h2>
          {events.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {t('empty')}
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${event.color} text-white`}
                  >
                    {(() => {
                      const Icon = ICON_MAP[event.icon];
                      return Icon ? <Icon className="h-6 w-6" /> : <span className="text-2xl">{event.icon}</span>;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{t(`events.${event.type}`)}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{describe(event)}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{format.relativeTime(event.at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cooking Journal */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('journal')}</h2>
            <Link
              href="/recipes"
              className="text-sm font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400"
            >
              {t('logAnother')}
            </Link>
          </div>
          {cookingJournal.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.rich('journalEmpty', {
                action: tDetail('cookedThis'),
                b: (chunks) => <span className="font-medium">{chunks}</span>,
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {cookingJournal.map((entry) => (
                <Link
                  href={`/recipes/${entry.recipeId}`}
                  key={entry.id}
                  className="flex gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                    {entry.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.image} alt={entry.recipe} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><UtensilsCrossed className="h-8 w-8 text-slate-300" /></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{entry.recipe}</h3>
                    {entry.rating !== null && (
                      <div className="my-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < entry.rating! ? 'text-yellow-400' : 'text-slate-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{entry.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{format.date(entry.cookedAt, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - This Week */}
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('thisWeek')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{t('recipesCreated')}</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{thisWeek.recipesCreated}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <Heart className="h-5 w-5 text-teal-600" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{t('recipesSaved')}</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{thisWeek.recipesSaved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <ChefHat className="h-5 w-5" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{t('recipesCooked')}</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{thisWeek.recipesCooked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
