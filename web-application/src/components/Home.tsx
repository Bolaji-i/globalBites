'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslation();

  // Featured cuisines from around the world
  const cuisines = [
    {
      name: 'Italian',
      description: 'Classic pasta, pizza, and Mediterranean flavors',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
      flag: '🇮🇹',
      recipes: 245
    },
    {
      name: 'Japanese',
      description: 'Sushi, ramen, and traditional delicacies',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
      flag: '🇯🇵',
      recipes: 189
    },
    {
      name: 'Mexican',
      description: 'Tacos, burritos, and spicy specialties',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      flag: '🇲🇽',
      recipes: 198
    },
    {
      name: 'Indian',
      description: 'Curry, tandoori, and aromatic spices',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      flag: '🇮🇳',
      recipes: 312
    },
    {
      name: 'French',
      description: 'Elegant pastries, soufflés, and haute cuisine',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
      flag: '🇫🇷',
      recipes: 167
    },
    {
      name: 'Thai',
      description: 'Pad Thai, curry, and tropical flavors',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
      flag: '🇹🇭',
      recipes: 156
    },
    {
      name: 'Chinese',
      description: 'Dim sum, stir-fry, and regional specialties',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
      flag: '🇨🇳',
      recipes: 278
    },
    {
      name: 'Greek',
      description: 'Gyros, moussaka, and fresh Mediterranean',
      image: 'https://images.unsplash.com/photo-1544510808-01fe4ec9dfa8?w=800&q=80',
      flag: '🇬🇷',
      recipes: 134
    }
  ];

  // Popular recipes
  const popularRecipes = [
    {
      title: 'Authentic Neapolitan Pizza',
      cuisine: 'Italian',
      time: '45 min',
      difficulty: 'Medium',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'
    },
    {
      title: 'Classic Chicken Tikka Masala',
      cuisine: 'Indian',
      time: '50 min',
      difficulty: 'Medium',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80'
    },
    {
      title: 'Traditional Sushi Rolls',
      cuisine: 'Japanese',
      time: '35 min',
      difficulty: 'Hard',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80'
    },
    {
      title: 'Beef Tacos Al Pastor',
      cuisine: 'Mexican',
      time: '30 min',
      difficulty: 'Easy',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            alt="Global cuisines"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.home.hero.title}
              <span className="block mt-2 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                {t.home.hero.subtitle}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-200">
              {t.home.hero.description}
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border-2 border-white/20 bg-white/10 px-6 py-4 pr-12 text-white placeholder-gray-300 backdrop-blur-md transition-all focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-3 transition-transform hover:scale-105">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-sm text-gray-300">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-sm text-gray-300">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-gray-300">Food Lovers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cuisines Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Explore by Cuisine
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Travel the world through flavors. Select a cuisine to discover authentic recipes and cooking techniques.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cuisines.map((cuisine) => (
              <div
                key={cuisine.name}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-800"
              >
                {/* Cuisine Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={cuisine.image}
                    alt={cuisine.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Flag Badge */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-2xl backdrop-blur-sm">
                    {cuisine.flag}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">{cuisine.name}</h3>
                  <p className="mb-3 text-sm text-gray-200">{cuisine.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cuisine.recipes} recipes</span>
                    <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Trending Recipes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Most loved recipes by our community of food enthusiasts
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {popularRecipes.map((recipe, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl bg-gray-50 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-900"
              >
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-900 dark:text-pink-300">
                      {recipe.cuisine}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{recipe.rating}</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {recipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {recipe.difficulty}
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 text-sm font-semibold text-white transition-all hover:from-pink-600 hover:to-rose-600">
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to Start Cooking?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            Join thousands of food lovers exploring authentic recipes from around the world
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-pink-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              Sign Up Free
            </Link>
            <button className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10">
              Browse Recipes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
