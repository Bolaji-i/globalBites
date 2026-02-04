'use client';

export default function Statistics({ user }: { user: any }) {
  const monthlyStats = [
    { month: 'Jan', recipes: 12, cooked: 8, saved: 15 },
    { month: 'Feb', recipes: 18, cooked: 14, saved: 22 },
    { month: 'Mar', recipes: 15, cooked: 11, saved: 19 },
    { month: 'Apr', recipes: 22, cooked: 17, saved: 28 },
    { month: 'May', recipes: 20, cooked: 15, saved: 25 },
    { month: 'Jun', recipes: 25, cooked: 20, saved: 30 },
  ];

  const topCuisines = [
    { cuisine: 'Italian', count: 45, percentage: 18, color: 'bg-green-500' },
    { cuisine: 'Japanese', count: 38, percentage: 15, color: 'bg-red-500' },
    { cuisine: 'Mexican', count: 35, percentage: 14, color: 'bg-yellow-500' },
    { cuisine: 'Indian', count: 32, percentage: 13, color: 'bg-orange-500' },
    { cuisine: 'Thai', count: 28, percentage: 11, color: 'bg-purple-500' },
    { cuisine: 'Others', count: 72, percentage: 29, color: 'bg-gray-400' },
  ];

  const flavorProfile = [
    { taste: 'Spicy', level: 85, color: 'bg-red-500' },
    { taste: 'Sweet', level: 60, color: 'bg-pink-500' },
    { taste: 'Savory', level: 95, color: 'bg-yellow-600' },
    { taste: 'Sour', level: 40, color: 'bg-green-500' },
    { taste: 'Bitter', level: 25, color: 'bg-gray-600' },
  ];

  const milestones = [
    { title: 'First Recipe', date: 'Jan 15, 2025', icon: '🎯' },
    { title: '10 Countries Explored', date: 'Mar 22, 2025', icon: '🌍' },
    { title: '100 Recipes Saved', date: 'Jun 8, 2025', icon: '❤️' },
    { title: '100+ Followers', date: 'Aug 15, 2025', icon: '👥' },
    { title: 'Master Chef Badge', date: 'Oct 3, 2025', icon: '🏆' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">📖</div>
          <div className="text-3xl font-bold">{user.stats.totalRecipesTried}</div>
          <div className="text-sm text-white/80">Total Recipes Tried</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">🌍</div>
          <div className="text-3xl font-bold">{user.stats.countriesExplored}</div>
          <div className="text-sm text-white/80">Countries Explored</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">⏱️</div>
          <div className="text-3xl font-bold">127h</div>
          <div className="text-sm text-white/80">Time in Kitchen</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">🔥</div>
          <div className="text-3xl font-bold">45</div>
          <div className="text-sm text-white/80">Day Streak</div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Monthly Activity</h2>
        <div className="space-y-2">
          {monthlyStats.map((stat) => {
            const maxValue = Math.max(...monthlyStats.map((s) => s.recipes + s.cooked + s.saved));
            const totalWidth = ((stat.recipes + stat.cooked + stat.saved) / maxValue) * 100;

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Cuisines */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Top Cuisines</h2>
          <div className="space-y-4">
            {topCuisines.map((cuisine) => (
              <div key={cuisine.cuisine}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{cuisine.cuisine}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {cuisine.count} recipes ({cuisine.percentage}%)
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div className={`h-full ${cuisine.color}`} style={{ width: `${cuisine.percentage * 3.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flavor Profile */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Your Flavor Profile</h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Based on your recipe preferences and cooking history
          </p>
          <div className="space-y-4">
            {flavorProfile.map((flavor) => (
              <div key={flavor.taste}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{flavor.taste}</span>
                  <span className="text-gray-600 dark:text-gray-400">{flavor.level}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div className={`h-full ${flavor.color}`} style={{ width: `${flavor.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Your Journey Milestones</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-pink-500 via-rose-500 to-red-500" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Icon */}
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-2xl shadow-lg">
                  {milestone.icon}
                </div>

                {/* Content */}
                <div className="flex-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6 text-white shadow-lg">
        <h2 className="mb-6 text-xl font-bold">Your Community Impact</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-3xl font-bold">2,847</div>
            <div className="text-sm text-white/80">Total Recipe Views</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">1,234</div>
            <div className="text-sm text-white/80">Recipes Saved by Others</div>
          </div>
          <div>
            <div className="mb-1 text-3xl font-bold">89</div>
            <div className="text-sm text-white/80">People Inspired</div>
          </div>
        </div>
        <div className="mt-6 rounded-lg bg-white/20 p-4 backdrop-blur-sm">
          <p className="text-sm">
            🎉 You've inspired 89 people to try new cuisines! Your recipes have been viewed over 2,800 times.
          </p>
        </div>
      </div>
    </div>
  );
}
