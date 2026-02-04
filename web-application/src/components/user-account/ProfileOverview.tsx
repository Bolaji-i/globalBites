'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProfileOverview({ user }: { user: any }) {
  const recentRecipes = [
    {
      id: 1,
      title: 'Authentic Pad Thai',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
      cuisine: 'Thai',
      saves: 45,
      time: '2 days ago',
    },
    {
      id: 2,
      title: 'Classic Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
      cuisine: 'Italian',
      saves: 89,
      time: '5 days ago',
    },
    {
      id: 3,
      title: 'Chicken Tikka Masala',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
      cuisine: 'Indian',
      saves: 124,
      time: '1 week ago',
    },
  ];

  const cuisinePassport = [
    { country: 'Italy', flag: '🇮🇹', recipes: 18, color: 'bg-green-500' },
    { country: 'Japan', flag: '🇯🇵', recipes: 12, color: 'bg-red-500' },
    { country: 'Mexico', flag: '🇲🇽', recipes: 15, color: 'bg-green-600' },
    { country: 'India', flag: '🇮🇳', recipes: 20, color: 'bg-orange-500' },
    { country: 'Thailand', flag: '🇹🇭', recipes: 10, color: 'bg-blue-500' },
    { country: 'France', flag: '🇫🇷', recipes: 8, color: 'bg-blue-600' },
  ];

  const achievements = [
    { id: 1, icon: '🏆', title: 'Master Chef', description: 'Created 20+ recipes', unlocked: true },
    { id: 2, icon: '🌍', title: 'World Explorer', description: 'Tried 25+ countries', unlocked: true },
    { id: 3, icon: '🔥', title: '30-Day Streak', description: 'Cooked for 30 days straight', unlocked: true },
    { id: 4, icon: '⭐', title: 'Rising Star', description: 'Reached 500 followers', unlocked: false },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Bio Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">About Me</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>
          <button className="mt-4 text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
            Edit Bio
          </button>
        </div>

        {/* Recent Recipes */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Recipes</h2>
            <Link href="#" className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
              View All
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="group cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                <div className="relative h-40">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <div className="mb-1 text-xs text-pink-600 dark:text-pink-400">{recipe.cuisine}</div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{recipe.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>❤️ {recipe.saves} saves</span>
                    <span>{recipe.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisine Passport */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            🌍 Cuisine Passport
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {user.stats.countriesExplored} countries explored through recipes
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {cuisinePassport.map((country) => (
              <div
                key={country.country}
                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${country.color} text-2xl`}>
                  {country.flag}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{country.country}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{country.recipes} recipes tried</div>
                </div>
              </div>
            ))}
          </div>
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
              <span className="font-bold text-gray-900 dark:text-white">{user.stats.recipesSaved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recipes Tried</span>
              <span className="font-bold text-gray-900 dark:text-white">{user.stats.totalRecipesTried}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Countries Explored</span>
              <span className="font-bold text-gray-900 dark:text-white">{user.stats.countriesExplored}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
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
          </div>
        </div>

        {/* Cooking Streak */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <h2 className="text-xl font-bold">Cooking Streak</h2>
          </div>
          <div className="text-4xl font-bold">12 Days</div>
          <p className="mt-2 text-sm text-white/90">Keep it up! Cook today to maintain your streak.</p>
        </div>
      </div>
    </div>
  );
}
