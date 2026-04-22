'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;
  recipeCount: number;
  favoriteCount: number;
  isPrivate: boolean;
}

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  difficulty: string | null;
  prepTime: number | null;
  cookTime: number | null;
  createdAt: string;
  _count: {
    favorites: number;
  };
}

interface UserProfilePageProps {
  params: Promise<{ identifier: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params);
  const identifier = resolvedParams.identifier;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${identifier}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile');
        }
        return;
      }
      const data = await response.json();
      setProfile(data);
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  const fetchRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const response = await fetch(`/api/users/${identifier}/recipes?page=${page}&limit=12`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
        setTotalPages(data.totalPages);
      }
    } catch {
      console.error('Failed to fetch recipes');
    } finally {
      setRecipesLoading(false);
    }
  }, [identifier, page]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile && !profile.isPrivate) {
      fetchRecipes();
    }
  }, [profile, fetchRecipes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'User not found'}
          </h2>
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.firstName}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                  {profile.firstName.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.username && (
                <p className="text-white/80 text-lg">@{profile.username}</p>
              )}
              {profile.bio && (
                <p className="mt-2 max-w-xl text-white/90">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                {profile.location && (
                  <span className="flex items-center gap-1 text-white/80">
                    📍 {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/80 hover:text-white"
                  >
                    🔗 Website
                  </a>
                )}
                <span className="flex items-center gap-1 text-white/80">
                  📅 Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="md:ml-auto flex gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">{profile.recipeCount}</div>
                <div className="text-white/80">Recipes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{profile.favoriteCount}</div>
                <div className="text-white/80">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {profile.isPrivate ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              This profile is private
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Only the owner can see their recipes and activity
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recipes by {profile.firstName}
            </h2>

            {recipesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No recipes yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {profile.firstName} hasn&apos;t shared any recipes yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                      {recipe.image ? (
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          🍽️
                        </div>
                      )}
                      {recipe.cuisine && (
                        <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium">
                          {recipe.cuisine}
                        </span>
                      )}
                      {recipe._count.favorites > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          ❤️ {recipe._count.favorites}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {recipe.title}
                      </h3>
                      {recipe.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {recipe.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {recipe.prepTime && (
                          <span>⏱️ {recipe.prepTime + (recipe.cookTime || 0)} min</span>
                        )}
                        {recipe.difficulty && (
                          <span className={`px-2 py-0.5 rounded-full ${
                            recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {recipe.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
