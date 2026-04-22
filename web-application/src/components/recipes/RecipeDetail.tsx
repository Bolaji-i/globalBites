'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[] | null;
  steps: string[] | null;
  image: string | null;
  cuisine: string | null;
  country: string | null;
  difficulty: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  tags: string[] | null;
  createdAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  _count?: {
    favorites: number;
  };
}

interface RecipeDetailProps {
  recipeId: string;
}

export default function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [logging, setLogging] = useState(false);
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/recipes');
          return;
        }
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json();
      const recipeData = data.recipe || data; // Handle both { recipe } and direct recipe response
      setRecipe(recipeData);
      setFavoriteCount(recipeData._count?.favorites || 0);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  }, [recipeId, router]);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`);
      const data = await response.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  useEffect(() => {
    if (session?.user) {
      checkFavoriteStatus();
    }
  }, [session, checkFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }

    try {
      if (isFavorited) {
        await fetch(`/api/recipes/${recipeId}/favorite`, { method: 'DELETE' });
        setIsFavorited(false);
        setFavoriteCount(c => c - 1);
      } else {
        await fetch(`/api/recipes/${recipeId}/favorite`, { method: 'POST' });
        setIsFavorited(true);
        setFavoriteCount(c => c + 1);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const logCook = async () => {
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }
    setLogging(true);
    setLogMessage(null);
    try {
      const res = await fetch(`/api/recipes/${recipeId}/cook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to log cook (${res.status})`);
      }
      const data = await res.json();
      const unlocked: string[] = data.newlyUnlocked ?? [];
      setLogMessage(
        unlocked.length > 0
          ? `Logged! 🎉 Unlocked: ${unlocked.join(', ')}`
          : 'Logged to your cooking journal!',
      );
      setTimeout(() => setLogMessage(null), 4000);
    } catch (error) {
      console.error('Error logging cook:', error);
      setLogMessage('Failed to log cook');
    } finally {
      setLogging(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/recipes');
      } else {
        alert('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe not found</h2>
          <Link href="/recipes" className="text-orange-500 hover:text-orange-600">
            Browse all recipes
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === recipe.author?.id;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] bg-gray-200 dark:bg-gray-700">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-9xl">
            🍽️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/recipes"
          className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          ← Back to recipes
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isFavorited
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            {isFavorited ? '❤️' : '🤍'} {favoriteCount}
          </button>
          <button
            onClick={logCook}
            disabled={logging}
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            🍳 {logging ? 'Logging...' : 'I cooked this'}
          </button>
          {isOwner && (
            <>
              <Link
                href={`/recipes/${recipeId}/edit`}
                className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {logMessage && (
        <div className="container mx-auto px-4 pt-4">
          <div className="max-w-4xl mx-auto rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-800 dark:text-orange-200">
            {logMessage}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title & Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.cuisine && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.cuisine}
                </span>
              )}
              {recipe.country && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  📍 {recipe.country}
                </span>
              )}
              {recipe.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {recipe.description}
              </p>
            )}

            {/* Author & Date */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {recipe.author?.image ? (
                  <Image
                    src={recipe.author.image}
                    alt={recipe.author.firstName || 'Author'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-xl">
                    {recipe.author?.firstName?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : 'Unknown Author'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {recipe.prepTime && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.prepTime} min</div>
              </div>
            )}
            {recipe.cookTime && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Cook Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.cookTime} min</div>
              </div>
            )}
            {totalTime > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl mb-1">⏰</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{totalTime} min</div>
              </div>
            )}
            {recipe.servings && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Servings</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.servings}</div>
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🥗 Ingredients
                </h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`ingredient-${index}`}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <label
                          htmlFor={`ingredient-${index}`}
                          className="text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          {ingredient}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No ingredients listed.</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  📝 Instructions
                </h2>
                {recipe.steps && recipe.steps.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 pt-1">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No instructions provided.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
