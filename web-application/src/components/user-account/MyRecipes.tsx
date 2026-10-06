'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Heart, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocaleFormat, useRecipeLabels } from '@/hooks/useLocaleFormat';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string | null;
  cuisine: string;
  country: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  saves: number;
  status: string;
  published: boolean;
  createdAt: string;
  authorName?: string;
}

interface MyRecipesProps {
  user: { id: string };
}

export default function MyRecipes({ user }: MyRecipesProps) {
  const t = useTranslations('account.myRecipes');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const format = useLocaleFormat();
  const [activeFilter, setActiveFilter] = useState('created');
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [createdTotal, setCreatedTotal] = useState(0);
  const [savedTotal, setSavedTotal] = useState(0);

  const fetchCreatedRecipes = useCallback(async () => {
    try {
      const response = await fetch('/api/user/recipes', {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        setCreatedRecipes(data.recipes || []);
        setCreatedTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching created recipes:', error);
    }
  }, []);

  const fetchSavedRecipes = useCallback(async () => {
    try {
      const response = await fetch('/api/user/favorites', {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(data.recipes || []);
        setSavedTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCreatedRecipes(), fetchSavedRecipes()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchCreatedRecipes, fetchSavedRecipes]);

  const filters = [
    { id: 'created', label: t('created'), count: createdTotal },
    { id: 'saved', label: t('saved'), count: savedTotal },
    { id: 'all', label: t('all'), count: createdTotal + savedTotal },
  ];

  const formatTime = (minutes: number) => {
    if (minutes < 60) return tc('minutes', { count: minutes });
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  activeFilter === filter.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
          <Link
            href="/recipes/new"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 sm:self-auto"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newRecipe')}
          </Link>
        </div>

        {/* Created Recipes */}
        {(activeFilter === 'all' || activeFilter === 'created') && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {t('createdTitle', { count: createdTotal })}
            </h3>
            {createdRecipes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center dark:bg-slate-800">
                <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {t('noCreated')}
                </p>
                <Link
                    href="/recipes/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-white font-medium hover:bg-teal-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('createFirst')}
                  </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {createdRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group overflow-hidden rounded-xl bg-slate-50 transition-shadow hover:shadow-sm dark:bg-slate-800"
                  >
                    <div className="relative h-48">
                      {recipe.image ? (
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-200 dark:bg-slate-700">
                          <UtensilsCrossed className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      <div className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        recipe.published ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {recipe.published ? t('published') : t('draft')}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                          {recipe.cuisine ? labels.cuisine(recipe.cuisine) : recipe.country ? labels.country(recipe.country) : t('global')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{recipe.difficulty && labels.difficulty(recipe.difficulty)}</span>
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {recipe.title}
                      </h4>
                      <div className="mb-3 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(recipe.totalTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> {recipe.saves}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {format.date(recipe.createdAt, { year: 'numeric', month: 'numeric', day: 'numeric' })}
                        </span>
                        <span className="text-sm font-medium text-teal-600 hover:text-teal-600 dark:text-teal-400">
                          {t('view')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Recipes */}
        {(activeFilter === 'all' || activeFilter === 'saved') && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {t('savedTitle', { count: savedTotal })}
            </h3>
            {savedRecipes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center dark:bg-slate-800">
                <Heart className="h-10 w-10 text-teal-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {t('noSaved')}
                </p>
                <Link
                    href="/recipes"
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-white font-medium hover:bg-teal-700 transition-colors"
                  >
                    {t('browse')}
                  </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group overflow-hidden rounded-xl bg-slate-50 transition-shadow hover:shadow-sm dark:bg-slate-800"
                  >
                    <div className="relative h-48">
                      {recipe.image ? (
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-200 dark:bg-slate-700">
                          <UtensilsCrossed className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute right-2 top-2 rounded-full bg-white/90 p-2 backdrop-blur-sm dark:bg-slate-900/90">
                        <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                          {recipe.cuisine ? labels.cuisine(recipe.cuisine) : recipe.country ? labels.country(recipe.country) : t('global')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{recipe.difficulty && labels.difficulty(recipe.difficulty)}</span>
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {recipe.title}
                      </h4>
                      <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                        {tc('by', { name: recipe.authorName || tc('unknownAuthor') })}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(recipe.totalTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> {recipe.saves}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
