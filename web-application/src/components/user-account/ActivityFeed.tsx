'use client';

export default function ActivityFeed({ user }: { user: any }) {
  const activities = [
    {
      id: 1,
      type: 'recipe_created',
      title: 'Created a new recipe',
      description: 'Authentic Pad Thai',
      time: '2 hours ago',
      icon: '📝',
      color: 'bg-green-500',
    },
    {
      id: 2,
      type: 'recipe_saved',
      title: 'Saved a recipe',
      description: 'Classic French Croissants by Chef Pierre',
      time: '5 hours ago',
      icon: '❤️',
      color: 'bg-pink-500',
    },
    {
      id: 3,
      type: 'review_posted',
      title: 'Posted a review',
      description: 'Rated "Chicken Tikka Masala" 5 stars',
      time: '1 day ago',
      icon: '⭐',
      color: 'bg-yellow-500',
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Unlocked achievement',
      description: 'World Explorer - Tried 25+ countries',
      time: '2 days ago',
      icon: '🏆',
      color: 'bg-purple-500',
    },
    {
      id: 5,
      type: 'follower',
      title: 'New follower',
      description: 'John Doe started following you',
      time: '3 days ago',
      icon: '👤',
      color: 'bg-blue-500',
    },
  ];

  const cookingJournal = [
    {
      id: 1,
      recipe: 'Homemade Ramen',
      date: 'Jan 25, 2026',
      rating: 5,
      notes: 'Amazing! The broth was perfect. Will make again.',
      photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    },
    {
      id: 2,
      recipe: 'Beef Wellington',
      date: 'Jan 22, 2026',
      rating: 4,
      notes: 'Good but the pastry was a bit thick. Need more practice.',
      photo: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80',
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Activity Feed - Left Column */}
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${activity.color} text-2xl`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Journal */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cooking Journal</h2>
            <button className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
              Add Entry
            </button>
          </div>
          <div className="space-y-4">
            {cookingJournal.map((entry) => (
              <div key={entry.id} className="flex gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={entry.photo} alt={entry.recipe} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{entry.recipe}</h3>
                  <div className="my-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < entry.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{entry.notes}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Engagement Stats */}
      <div className="space-y-6">
        {/* This Week */}
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
              <span className="text-xl font-bold text-gray-900 dark:text-white">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                  <span className="text-lg">❤️</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Recipes Saved</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-lg">🍳</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Recipes Cooked</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">8</span>
            </div>
          </div>
        </div>

        {/* Following Activity */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">People You Follow</h3>
          <div className="space-y-3">
            {[
              { name: 'Chef Maria', activity: 'Posted Italian Risotto', time: '1h ago' },
              { name: 'John Cooks', activity: 'Saved your recipe', time: '3h ago' },
              { name: 'Sushi Master', activity: 'Created Dragon Roll', time: '5h ago' },
            ].map((person, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{person.activity}</p>
                  <p className="text-xs text-gray-500">{person.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
