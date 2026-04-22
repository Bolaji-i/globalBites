'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/hooks/useTranslation';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  difficulty: string | null;
  prepTime: number | null;
  cookTime: number | null;
  author: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    favorites: number;
  };
}

interface CuisineStat {
  cuisine: string;
  count: number;
}

// Cuisine metadata with images and flags
const cuisineMetadata: Record<string, { flag: string; image: string; description: string }> = {
  'Italian': {
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
    description: 'Classic pasta, pizza, and Mediterranean flavors'
  },
  'Japanese': {
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    description: 'Sushi, ramen, and traditional delicacies'
  },
  'Mexican': {
    flag: '🇲🇽',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    description: 'Tacos, burritos, and spicy specialties'
  },
  'Indian': {
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    description: 'Curry, tandoori, and aromatic spices'
  },
  'French': {
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
    description: 'Elegant pastries, soufflés, and haute cuisine'
  },
  'Thai': {
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
    description: 'Pad Thai, curry, and tropical flavors'
  },
  'Chinese': {
    flag: '🇨🇳',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
    description: 'Dim sum, stir-fry, and regional specialties'
  },
  'Greek': {
    flag: '🇬🇷',
    image: 'https://images.unsplash.com/photo-1544510808-01fe4ec9dfa8?w=800&q=80',
    description: 'Gyros, moussaka, and fresh Mediterranean'
  },
  'Korean': {
    flag: '🇰🇷',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    description: 'Korean BBQ, kimchi, and bold flavors'
  },
  'Vietnamese': {
    flag: '🇻🇳',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    description: 'Pho, banh mi, and fresh herbs'
  },
  'American': {
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    description: 'Burgers, BBQ, and comfort food'
  },
  'Spanish': {
    flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=80',
    description: 'Tapas, paella, and Mediterranean delights'
  }
};

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [cuisineStats, setCuisineStats] = useState<CuisineStat[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured recipes and stats in parallel
      const [featuredRes, statsRes] = await Promise.all([
        fetch('/api/recipes?featured=true&limit=4', { cache: 'no-store' }),
        fetch('/api/recipes?stats=true', { cache: 'no-store' })
      ]);

      if (featuredRes.ok) {
        const featuredData = await featuredRes.json();
        setFeaturedRecipes(featuredData.recipes || []);
        setTotalRecipes(featuredData.total || 0);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setCuisineStats(statsData.cuisineStats || []);
        setTotalUsers(statsData.totalUsers || 0);
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Create cuisines array from stats or use fallback
  const cuisines = cuisineStats.length > 0
    ? cuisineStats.slice(0, 8).map(stat => ({
        name: stat.cuisine,
        recipes: stat.count,
        ...cuisineMetadata[stat.cuisine] || {
          flag: '🍽️',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
          description: `Delicious ${stat.cuisine} recipes`
        }
      }))
    : Object.entries(cuisineMetadata).slice(0, 8).map(([name, meta]) => ({
        name,
        recipes: 0,
        ...meta
      }));

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
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border-2 border-white/20 bg-white/10 px-6 py-4 pr-12 text-white placeholder-gray-300 backdrop-blur-md transition-all focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-3 transition-transform hover:scale-105">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalRecipes > 0 ? totalRecipes.toLocaleString() : '0'}+</div>
                <div className="text-sm text-gray-300">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{cuisineStats.length > 0 ? cuisineStats.length : '50'}+</div>
                <div className="text-sm text-gray-300">Cuisines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalUsers > 0 ? totalUsers.toLocaleString() : '0'}+</div>
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
                    <Link 
                      href={`/recipes?cuisine=${encodeURIComponent(cuisine.name)}`}
                      className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
                    >
                      Explore →
                    </Link>
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
              {featuredRecipes.length > 0 ? 'Featured Recipes' : 'Start Sharing Recipes'}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {featuredRecipes.length > 0 
                ? 'Most loved recipes by our community of food enthusiasts'
                : 'Be the first to share your favorite recipes with our community!'
              }
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl bg-gray-50 shadow-lg dark:bg-gray-900 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="group overflow-hidden rounded-2xl bg-gray-50 shadow-lg transition-all hover:shadow-2xl dark:bg-gray-900"
                >
                  {/* Recipe Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {recipe.image ? (
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-6xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      {recipe.cuisine && (
                        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-900 dark:text-pink-300">
                          {recipe.cuisine}
                        </span>
                      )}
                      {recipe._count && recipe._count.favorites > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-red-500">❤️</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{recipe._count.favorites}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                      {recipe.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {(recipe.prepTime || recipe.cookTime) && (
                        <div className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 text-sm font-semibold text-white text-center transition-all group-hover:from-pink-600 group-hover:to-rose-600">
                      View Recipe
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No recipes yet. Be the first to share one!
              </p>
              <Link
                href="/recipes/new"
                className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-pink-600 hover:to-rose-600"
              >
                Create a Recipe
              </Link>
            </div>
          )}

          {featuredRecipes.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/recipes"
                className="inline-block rounded-full border-2 border-pink-500 px-8 py-3 text-lg font-semibold text-pink-500 transition-all hover:bg-pink-500 hover:text-white"
              >
                Browse All Recipes →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">
            {session ? 'Keep Exploring!' : 'Ready to Start Cooking?'}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            {session 
              ? 'Discover more authentic recipes from around the world'
              : 'Join thousands of food lovers exploring authentic recipes from around the world'
            }
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {!session && (
              <Link
                href="/register"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-pink-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
              >
                Sign Up Free
              </Link>
            )}
            <Link
              href="/recipes"
              className={`rounded-full px-8 py-4 text-lg font-semibold transition-all ${
                session
                  ? 'bg-white text-pink-600 shadow-lg hover:bg-gray-100 hover:shadow-xl'
                  : 'border-2 border-white text-white hover:bg-white/10'
              }`}
            >
              Browse Recipes
            </Link>
            {session && (
              <Link
                href="/recipes/new"
                className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Create Recipe
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
