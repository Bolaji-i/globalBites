'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function MyRecipes({ user }: { user: any }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const myCreatedRecipes = [
    {
      id: 1,
      title: 'Authentic Pad Thai',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
      cuisine: 'Thai',
      difficulty: 'Medium',
      time: '30 min',
      rating: 4.8,
      views: 1234,
      saves: 45,
      status: 'published',
    },
    {
      id: 2,
      title: 'Classic Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
      cuisine: 'Italian',
      difficulty: 'Easy',
      time: '45 min',
      rating: 4.9,
      views: 2341,
      saves: 89,
      status: 'published',
    },
  ];

  const savedRecipes = [
    {
      id: 3,
      title: 'Traditional Sushi Rolls',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
      cuisine: 'Japanese',
      difficulty: 'Hard',
      time: '60 min',
      rating: 4.7,
      author: 'Chef Tanaka',
    },
    {
      id: 4,
      title: 'Beef Tacos Al Pastor',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      cuisine: 'Mexican',
      difficulty: 'Medium',
      time: '40 min',
      rating: 4.6,
      author: 'Maria Lopez',
    },
  ];

  const collections = [
    { id: 1, name: 'Weeknight Dinners', count: 23, color: 'bg-blue-500' },
    { id: 2, name: 'Holiday Specials', count: 12, color: 'bg-green-500' },
    { id: 3, name: 'Quick & Easy', count: 34, color: 'bg-yellow-500' },
    { id: 4, name: 'Desserts', count: 18, color: 'bg-pink-500' },
  ];

  const filters = [
    { id: 'all', label: 'All Recipes', count: myCreatedRecipes.length + savedRecipes.length },
    { id: 'created', label: 'Created', count: myCreatedRecipes.length },
    { id: 'saved', label: 'Saved', count: savedRecipes.length },
  ];

  return (
    <div className="space-y-6">
      {/* Collections Grid */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Collections</h2>
          <button className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group cursor-pointer rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all hover:shadow-lg dark:from-gray-700 dark:to-gray-600"
            >
              <div className={`mb-3 inline-block rounded-full ${collection.color} p-3 text-white`}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{collection.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{collection.count} recipes</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Created Recipes */}
        {(activeFilter === 'all' || activeFilter === 'created') && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">My Created Recipes</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {myCreatedRecipes.map((recipe) => (
                <div key={recipe.id} className="group overflow-hidden rounded-xl bg-gray-50 transition-shadow hover:shadow-lg dark:bg-gray-700">
                  <div className="relative h-48">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute right-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      Published
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                        {recipe.cuisine}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.difficulty}</span>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{recipe.title}</h4>
                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {recipe.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>👁️ {recipe.views}</span>
                        <span>❤️ {recipe.saves}</span>
                      </div>
                      <button className="text-sm font-medium text-pink-600 hover:text-pink-500 dark:text-pink-400">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Recipes */}
        {(activeFilter === 'all' || activeFilter === 'saved') && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Saved Recipes</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {savedRecipes.map((recipe) => (
                <div key={recipe.id} className="group overflow-hidden rounded-xl bg-gray-50 transition-shadow hover:shadow-lg dark:bg-gray-700">
                  <div className="relative h-48">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <button className="absolute right-2 top-2 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-800/90">
                      <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                        {recipe.cuisine}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{recipe.difficulty}</span>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{recipe.title}</h4>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">by {recipe.author}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {recipe.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
