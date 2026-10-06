'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import RecipeModal from './RecipeModal';
import { ChefHat, UtensilsCrossed, Heart, Clock, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRecipeLabels } from '@/hooks/useLocaleFormat';
import CuisineOptions from './CuisineOptions';

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
    image: string | null;
  };
  _count?: {
    favorites: number;
  };
}

interface Filters {
  query: string;
  cuisine: string;
  difficulty: string;
  maxPrepTime: string;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function RecipeList() {
  const t = useTranslations('recipes.list');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    cuisine: '',
    difficulty: '',
    maxPrepTime: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('query', filters.query);
      if (filters.cuisine) params.set('cuisine', filters.cuisine);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.maxPrepTime) params.set('maxPrepTime', filters.maxPrepTime);
      params.set('page', page.toString());
      params.set('limit', '12');

      const response = await fetch(`/api/recipes?${params}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Refetch when window regains focus (e.g., after creating a recipe)
  useEffect(() => {
    const handleFocus = () => {
      fetchRecipes();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchRecipes]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ query: '', cuisine: '', difficulty: '', maxPrepTime: '' });
    setPage(1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <div className="bg-teal-700 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            <ChefHat className="h-8 w-8 inline-block" /> {t('title')}
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {tc('search')}
              </label>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('cuisine')}
              </label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              >
                <option value="">{t('allCuisines')}</option>
                <CuisineOptions current={filters.cuisine} />
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('difficulty')}
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              >
                <option value="">{t('any')}</option>
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{labels.difficulty(d)}</option>
                ))}
              </select>
            </div>

            {/* Max Prep Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('maxPrepTime')}
              </label>
              <select
                value={filters.maxPrepTime}
                onChange={(e) => handleFilterChange('maxPrepTime', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              >
                <option value="">{t('any')}</option>
                <option value="15">{t('mins', { count: 15 })}</option>
                <option value="30">{t('mins', { count: 30 })}</option>
                <option value="60">{t('hours', { count: 1 })}</option>
                <option value="120">{t('hours', { count: 2 })}</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.query || filters.cuisine || filters.difficulty || filters.maxPrepTime) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>

        {/* Create Recipe Button */}
        <div className="flex justify-end mb-6">
          <Link
            href="/recipes/new"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> {t('create')}
          </Link>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-800" />
                <div className="p-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <UtensilsCrossed className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('noneFound')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {filters.query || filters.cuisine || filters.difficulty || filters.maxPrepTime
                ? t('adjustFilters')
                : t('beFirst')}
            </p>
            <Link
              href="/recipes/new"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('create')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UtensilsCrossed className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  {recipe.cuisine && (
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-full text-xs font-medium">
                      {labels.cuisine(recipe.cuisine)}
                    </span>
                  )}
                  {recipe._count && recipe._count.favorites > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 fill-current" /> {recipe._count.favorites}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {recipe.title}
                  </h3>
                  {recipe.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      {recipe.prepTime && (
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tc('minutes', { count: recipe.prepTime + (recipe.cookTime || 0) })}</span>
                      )}
                      {recipe.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full ${
                          recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {labels.difficulty(recipe.difficulty)}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400">
                      {tc('by', { name: recipe.author.firstName })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {tc('previous')}
            </button>
            <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
              {tc('pageOf', { page, total: totalPages })}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {tc('next')}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Recipe Modal */}
    <RecipeModal
      recipeId={selectedRecipeId || ''}
      isOpen={!!selectedRecipeId}
      onClose={() => setSelectedRecipeId(null)}
      onRecipeDeleted={fetchRecipes}
    />
    </>
  );
}
