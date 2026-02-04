'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProfileOverview from './ProfileOverview';
import MyRecipes from './MyRecipes';
import ActivityFeed from './ActivityFeed';
import AccountSettings from './AccountSettings';
import Statistics from './Statistics';

export default function UserAccount() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - replace with real data from authentication
  const user = {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahcooks',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    location: 'New York, USA',
    bio: 'Food lover exploring cuisines from around the world. Passionate about authentic recipes and cultural cooking traditions.',
    joinedDate: 'January 2025',
    stats: {
      recipesCreated: 24,
      recipesSaved: 156,
      followers: 342,
      following: 189,
      countriesExplored: 28,
      totalRecipesTried: 89,
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'recipes', label: 'My Recipes', icon: '📖' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 pb-32">
        <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-white/90">@{user.username}</p>
              <p className="mt-2 text-sm text-white/80">
                📍 {user.location} • Joined {user.joinedDate}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 rounded-2xl bg-white/10 p-4 backdrop-blur-lg md:gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user.stats.recipesCreated}</div>
                <div className="text-xs text-white/80">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user.stats.followers}</div>
                <div className="text-xs text-white/80">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user.stats.following}</div>
                <div className="text-xs text-white/80">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto -mt-24 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 overflow-x-auto rounded-2xl bg-white shadow-lg dark:bg-gray-800">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && <ProfileOverview user={user} />}
          {activeTab === 'recipes' && <MyRecipes user={user} />}
          {activeTab === 'activity' && <ActivityFeed user={user} />}
          {activeTab === 'settings' && <AccountSettings user={user} />}
          {activeTab === 'statistics' && <Statistics user={user} />}
        </div>
      </div>
    </div>
  );
}
