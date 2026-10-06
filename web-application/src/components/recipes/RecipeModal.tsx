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

interface RecipeModalProps {
  recipeId: string;
  isOpen: boolean;
  onClose: () => void;
  onRecipeDeleted?: () => void;
}

export default function RecipeModal({ recipeId, isOpen, onClose, onRecipeDeleted }: RecipeModalProps) {
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
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-slate-950 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-6" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            </div>
          </div>
        ) : !recipe ? (
          <div className="p-8 text-center">
            <UtensilsCrossed className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('notFound')}</h2>
            <button onClick={onClose} className="text-teal-600 hover:text-teal-600">
              {tc('close')}
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 bg-slate-200 dark:bg-slate-800 flex-shrink-0">
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
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                  {recipe.cuisine && (
                    <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {labels.cuisine(recipe.cuisine)}
                    </span>
                  )}
                  {recipe.country && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 inline-block" /> {labels.country(recipe.country)}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      recipe.difficulty === 'easy' ? 'bg-green-500' :
                      recipe.difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {labels.difficulty(recipe.difficulty)}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      isFavorited
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
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
                </div>
              </div>
            </div>

            <div className="p-6">
              {logMessage && (
                <div className="mb-4 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-4 py-3 text-sm text-teal-800 dark:text-teal-200">
                  {logMessage}
                </div>
              )}
              {/* Title & Description */}
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {recipe.title}
              </h1>
              
              {recipe.description && (
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {recipe.description}
                </p>
              )}

              {/* Author & Actions */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {recipe.author?.image ? (
                    <Image
                      src={recipe.author.image}
                      alt={recipe.author.firstName || t('author')}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-lg">
                      {recipe.author?.firstName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {recipe.author ? `${recipe.author.firstName} ${recipe.author.lastName}` : tc('unknownAuthor')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format.date(recipe.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipeId}/edit`}
                      onClick={onClose}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Pencil className="h-4 w-4 inline-block" /> {tc('edit')}
                    </Link>
                    <button
                      onClick={() => setConfirmingDelete(true)}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 inline-block" /> {tc('delete')}
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {recipe.prepTime && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                    <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('prep')}</div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{tc('minutes', { count: recipe.prepTime })}</div>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                    <Flame className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('cook')}</div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{tc('minutes', { count: recipe.cookTime })}</div>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                    <Clock className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('total')}</div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{tc('minutes', { count: totalTime })}</div>
                  </div>
                )}
                {recipe.servings && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('servings')}</div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{recipe.servings}</div>
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
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs"
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <ListChecks className="h-5 w-5" /> {t('ingredients')}
                  </h2>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <IngredientChecklist
                      key={recipe.id}
                      recipeId={recipe.id}
                      ingredients={recipe.ingredients}
                      compact
                    />
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noIngredients')}</p>
                  )}
                </div>

                {/* Instructions */}
                <div className="md:col-span-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> {t('instructions')}
                  </h2>
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <ol className="space-y-4">
                      {recipe.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 text-sm">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noInstructions')}</p>
                  )}
                </div>
              </div>

              {/* Open Full Page Link */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <Link
                  href={`/recipes/${recipeId}`}
                  onClick={onClose}
                  className="text-teal-600 hover:text-teal-600 text-sm font-medium"
                >
                  {t('openFull')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmingDelete && recipe && (
        <DeleteRecipeDialog
          recipeId={recipeId}
          recipeTitle={recipe.title}
          onClose={() => setConfirmingDelete(false)}
          onDeleted={() => {
            setConfirmingDelete(false);
            onClose();
            onRecipeDeleted?.();
          }}
        />
      )}
    </div>
  );
}
