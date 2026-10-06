'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import DeleteRecipeDialog from './DeleteRecipeDialog';
import IngredientChecklist from './IngredientChecklist';
import { useAchievementLabels, useLocaleFormat, useRecipeLabels } from '@/hooks/useLocaleFormat';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, Heart, ChefHat, Pencil, Trash2, MapPin, Flame, Users, ListChecks, BookOpen, Clock } from 'lucide-react';

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
  const t = useTranslations('recipes.detail');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const achievements = useAchievementLabels();
  const format = useLocaleFormat();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
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
          ? t('loggedUnlocked', { achievements: unlocked.map((key) => achievements.title(key)).join(', ') })
          : t('logged'),
      );
      setTimeout(() => setLogMessage(null), 4000);
    } catch (error) {
      console.error('Error logging cook:', error);
      setLogMessage(t('logFailed'));
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('notFound')}</h2>
          <Link href="/recipes" className="text-teal-600 hover:text-teal-600">
            {t('browseAll')}
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === recipe.author?.id;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] bg-slate-200 dark:bg-slate-800">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <UtensilsCrossed className="h-24 w-24 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/recipes"
          className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-900 transition-colors"
        >
          {t('back')}
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isFavorited
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} /> {favoriteCount}
          </button>
          <button
            onClick={logCook}
            disabled={logging}
            className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <ChefHat className="h-4 w-4" /> {logging ? t('logging') : t('cookedThis')}
          </button>
          {isOwner && (
            <>
              <Link
                href={`/recipes/${recipeId}/edit`}
                className="bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" /> {tc('edit')}
              </Link>
              <button
                onClick={() => setConfirmingDelete(true)}
                className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" /> {tc('delete')}
              </button>
            </>
          )}
        </div>
      </div>

      {logMessage && (
        <div className="container mx-auto px-4 pt-4">
          <div className="max-w-4xl mx-auto rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-4 py-3 text-sm text-teal-800 dark:text-teal-200">
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
                <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                  {labels.cuisine(recipe.cuisine)}
                </span>
              )}
              {recipe.country && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {labels.country(recipe.country)}
                </span>
              )}
              {recipe.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {labels.difficulty(recipe.difficulty)}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {recipe.description}
              </p>
            )}

            {/* Author & Date */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {recipe.author?.image ? (
                  <Image
                    src={recipe.author.image}
                    alt={recipe.author.firstName || t('author')}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-xl">
                    {recipe.author?.firstName?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : tc('unknownAuthor')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {format.date(recipe.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {recipe.prepTime && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('prepTime')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{tc('minutes', { count: recipe.prepTime })}</div>
              </div>
            )}
            {recipe.cookTime && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm">
                <Flame className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('cookTime')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{tc('minutes', { count: recipe.cookTime })}</div>
              </div>
            )}
            {totalTime > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('totalTime')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{tc('minutes', { count: totalTime })}</div>
              </div>
            )}
            {recipe.servings && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 text-center shadow-sm">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('servings')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{recipe.servings}</div>
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{t('tags')}</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm"
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
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ListChecks className="h-5 w-5" /> {t('ingredients')}
                </h2>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <IngredientChecklist key={recipe.id} recipeId={recipe.id} ingredients={recipe.ingredients} />
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">{t('noIngredients')}</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> {t('instructions')}
                </h2>
                {recipe.steps && recipe.steps.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 pt-1">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">{t('noInstructions')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <DeleteRecipeDialog
          recipeId={recipeId}
          recipeTitle={recipe.title}
          onClose={() => setConfirmingDelete(false)}
          onDeleted={() => router.push('/recipes')}
        />
      )}
    </div>
  );
}
