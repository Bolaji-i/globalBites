'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ActivityEvent {
  id: string;
  type: 'recipe_created' | 'recipe_saved' | 'cooked' | 'achievement';
  title: string;
  description: string;
  at: string;
  icon: string;
  color: string;
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

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ActivityFeed() {
  const [data, setData] = useState<ActivityData | null>(null);
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
        <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-700" />
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
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          {events.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No activity yet. Create a recipe, save a favorite, or log a cook to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${event.color} text-2xl`}
                  >
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{relativeTime(event.at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cooking Journal */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cooking Journal</h2>
            <Link
              href="/recipes"
              className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400"
            >
              Log another
            </Link>
          </div>
          {cookingJournal.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Nothing cooked yet. Open any recipe and tap <span className="font-medium">I cooked this</span>.
            </div>
          ) : (
            <div className="space-y-4">
              {cookingJournal.map((entry) => (
                <Link
                  href={`/recipes/${entry.recipeId}`}
                  key={entry.id}
                  className="flex gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    {entry.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.image} alt={entry.recipe} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{entry.recipe}</h3>
                    {entry.rating !== null && (
                      <div className="my-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < entry.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{entry.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{formatDate(entry.cookedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - This Week */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">This Week</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <span className="text-lg">📝</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Recipes Created</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{thisWeek.recipesCreated}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                  <span className="text-lg">❤️</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Recipes Saved</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{thisWeek.recipesSaved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-lg">🍳</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Recipes Cooked</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{thisWeek.recipesCooked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
