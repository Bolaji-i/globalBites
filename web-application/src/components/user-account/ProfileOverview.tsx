'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${days < 60 ? '' : 's'} ago`;
  return `${Math.floor(days / 365)} year${days < 730 ? '' : 's'} ago`;
}

export default function ProfileOverview({ user }: ProfileOverviewProps) {
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
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-lg"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Recipes
            </Link>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Recipe
            </Link>
          </div>
        </div>

        {/* Bio Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">About Me</h2>
          {isEditingBio ? (
            <div className="space-y-3">
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                rows={4}
                placeholder="Tell others about yourself..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveBio}
                  disabled={savingBio}
                  className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-medium text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                >
                  {savingBio ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEditBio}
                  disabled={savingBio}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300">
                {bio || <span className="italic text-gray-400">No bio yet. Click below to add one.</span>}
              </p>
              <button
                onClick={startEditBio}
                className="mt-4 text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400"
              >
                {bio ? 'Edit Bio' : 'Add Bio'}
              </button>
            </>
          )}
        </div>

        {/* Recent Recipes */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Recipes</h2>
            <Link href="/recipes" className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
              View All
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          ) : data && data.recentRecipes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {data.recentRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                >
                  <div className="relative h-40 bg-gray-200 dark:bg-gray-600">
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
                      <div className="mb-1 text-xs text-pink-600 dark:text-pink-400">{recipe.cuisine}</div>
                    )}
                    <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>❤️ {recipe.saves} saves</span>
                      <span>{relativeTime(recipe.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                You haven&apos;t created any recipes yet.
              </p>
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white hover:from-pink-600 hover:to-rose-600"
              >
                Create your first recipe
              </Link>
            </div>
          )}
        </div>

        {/* Cuisine Passport */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🌍 Cuisine Passport</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {data ? `${data.stats.countriesExplored} countries explored through recipes` : 'Loading...'}
          </p>
          {data && data.cuisinePassport.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.cuisinePassport.map((entry) => (
                <div
                  key={entry.country}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-2xl">
                    {COUNTRY_FLAGS[entry.country] || COUNTRY_FLAGS[entry.cuisine] || '🍽️'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{entry.country}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.count} recipe{entry.count === 1 ? '' : 's'} tried
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <p className="text-sm italic text-gray-400">
              Start cooking recipes to fill your passport.
            </p>
          ) : null}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recipes Saved</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {data ? data.stats.recipesSaved : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recipes Tried</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {data ? data.stats.recipesTried : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Countries Explored</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {data ? data.stats.countriesExplored : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          <div className="space-y-3">
            {data?.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20'
                    : 'bg-gray-100 opacity-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{achievement.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
            {!loading && !data?.achievements.length && (
              <p className="text-sm italic text-gray-400">No achievements available.</p>
            )}
          </div>
        </div>

        {/* Cooking Streak */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <h2 className="text-xl font-bold">Cooking Streak</h2>
          </div>
          <div className="text-4xl font-bold">
            {data ? `${data.streak} Day${data.streak === 1 ? '' : 's'}` : '--'}
          </div>
          <p className="mt-2 text-sm text-white/90">
            {data && data.streak > 0
              ? 'Keep it up! Cook today to maintain your streak.'
              : 'Cook a recipe and log it to start your streak.'}
          </p>
        </div>
      </div>
    </div>
  );
}
