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

interface RecipeModalProps {
  recipeId: string;
  isOpen: boolean;
  onClose: () => void;
  onRecipeDeleted?: () => void;
}

export default function RecipeModal({ recipeId, isOpen, onClose, onRecipeDeleted }: RecipeModalProps) {
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
    if (!recipeId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json();
      const recipeData = data.recipe || data;
      setRecipe(recipeData);
      setFavoriteCount(recipeData._count?.favorites || 0);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  const checkFavoriteStatus = useCallback(async () => {
    if (!recipeId) return;
    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`);
      const data = await response.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [recipeId]);

  useEffect(() => {
    if (isOpen && recipeId) {
      fetchRecipe();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, recipeId, fetchRecipe]);

  useEffect(() => {
    if (isOpen && session?.user) {
      checkFavoriteStatus();
    }
  }, [isOpen, session, checkFavoriteStatus]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleFavorite = async () => {
    if (!session?.user) {
      onClose();
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
      onClose();
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
        throw new Error(err.error || 'Failed to log cook');
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
        onClose();
        onRecipeDeleted?.();
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

  if (!isOpen) return null;

  const isOwner = session?.user?.id === recipe?.author?.id;
  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors shadow-lg"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ) : !recipe ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe not found</h2>
            <button onClick={onClose} className="text-orange-500 hover:text-orange-600">
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-8xl">
                  🍽️
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {recipe.cuisine && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {recipe.cuisine}
                    </span>
                  )}
                  {recipe.country && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      📍 {recipe.country}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      recipe.difficulty === 'easy' ? 'bg-green-500' :
                      recipe.difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      isFavorited
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                </div>
              </div>
            </div>

            <div className="p-6">
              {logMessage && (
                <div className="mb-4 rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-800 dark:text-orange-200">
                  {logMessage}
                </div>
              )}
              {/* Title & Description */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {recipe.title}
              </h1>
              
              {recipe.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {recipe.description}
                </p>
              )}

              {/* Author & Actions */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {recipe.author?.image ? (
                    <Image
                      src={recipe.author.image}
                      alt={recipe.author.firstName || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-lg">
                      {recipe.author?.firstName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : 'Unknown Author'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipeId}/edit`}
                      onClick={onClose}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {deleting ? '...' : '🗑️ Delete'}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {recipe.prepTime && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">⏱️</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Prep</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{recipe.prepTime} min</div>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">🔥</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Cook</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{recipe.cookTime} min</div>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">⏰</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{totalTime} min</div>
                  </div>
                )}
                {recipe.servings && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">👥</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Servings</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{recipe.servings}</div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-5 gap-6">
                {/* Ingredients */}
                <div className="md:col-span-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🥗 Ingredients
                  </h2>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <input
                            type="checkbox"
                            id={`modal-ingredient-${index}`}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <label
                            htmlFor={`modal-ingredient-${index}`}
                            className="text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {ingredient}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No ingredients listed.</p>
                  )}
                </div>

                {/* Instructions */}
                <div className="md:col-span-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    📝 Instructions
                  </h2>
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <ol className="space-y-4">
                      {recipe.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No instructions provided.</p>
                  )}
                </div>
              </div>

              {/* Open Full Page Link */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <Link
                  href={`/recipes/${recipeId}`}
                  onClick={onClose}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  Open full recipe page →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
