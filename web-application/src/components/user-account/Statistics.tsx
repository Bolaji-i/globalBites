'use client';

import { useEffect, useState } from 'react';

interface StatsData {
  overview: {
    recipesTried: number;
    countriesExplored: number;
    kitchenHours: number;
    streak: number;
  };
  monthly: { month: string; recipes: number; cooked: number; saved: number }[];
  topCuisines: { cuisine: string; count: number; percentage: number; color: string }[];
  milestones: { title: string; date: string; icon: string }[];
  communityImpact: {
    recipesCreated: number;
    favoritesByOthers: number;
    favoritesByUser: number;
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Statistics() {
  const [data, setData] = useState<StatsData | null>(null);
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
            <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-700" />
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
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">📖</div>
          <div className="text-3xl font-bold">{overview.recipesTried}</div>
          <div className="text-sm text-white/80">Total Recipes Tried</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">🌍</div>
          <div className="text-3xl font-bold">{overview.countriesExplored}</div>
          <div className="text-sm text-white/80">Countries Explored</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">⏱️</div>
          <div className="text-3xl font-bold">{overview.kitchenHours}h</div>
          <div className="text-sm text-white/80">Time in Kitchen</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">🔥</div>
          <div className="text-3xl font-bold">{overview.streak}</div>
          <div className="text-sm text-white/80">Day Streak</div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Monthly Activity</h2>
        {monthly.every((m) => m.recipes + m.cooked + m.saved === 0) ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No activity in the last 6 months yet.
          </div>
        ) : (
          <div className="space-y-2">
            {monthly.map((stat) => {
              const totalWidth = ((stat.recipes + stat.cooked + stat.saved) / maxMonthly) * 100;
              return (
                <div key={stat.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">{stat.month}</div>
                  <div className="flex-1">
                    <div className="relative h-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      <div
                        className="absolute h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"
                        style={{ width: `${totalWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{stat.recipes}</span> created
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{stat.cooked}</span> cooked
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{stat.saved}</span> saved
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-pink-500" />
            <span className="text-gray-600 dark:text-gray-400">Created</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-gray-600 dark:text-gray-400">Cooked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Saved</span>
          </div>
        </div>
      </div>

      {/* Top Cuisines */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Top Cuisines</h2>
        {topCuisines.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Log a cook on any recipe to start building your cuisine breakdown.
          </div>
        ) : (
          <div className="space-y-4">
            {topCuisines.map((cuisine) => (
              <div key={cuisine.cuisine}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{cuisine.cuisine}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {cuisine.count} {cuisine.count === 1 ? 'cook' : 'cooks'} ({cuisine.percentage}%)
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div className={`h-full ${cuisine.color}`} style={{ width: `${cuisine.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Your Journey Milestones</h2>
        {milestones.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No milestones reached yet — create your first recipe to get started.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-pink-500 via-rose-500 to-red-500" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-2xl shadow-lg">
                    {milestone.icon}
                  </div>
                  <div className="flex-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(milestone.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Community Impact */}
      <div className="rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6 text-white shadow-lg">
        <h2 className="mb-6 text-xl font-bold">Your Community Impact</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.recipesCreated}</div>
            <div className="text-sm text-white/80">Recipes Created</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.favoritesByOthers}</div>
            <div className="text-sm text-white/80">Saves by Other Users</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">{impact.favoritesByUser}</div>
            <div className="text-sm text-white/80">Recipes You Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
