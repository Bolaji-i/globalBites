'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRecipeLabels } from '@/hooks/useLocaleFormat';
import CuisineOptions from './CuisineOptions';
import { countryOptions } from '@/lib/countries';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface RecipeFormProps {
  recipeId?: string;
}

interface RecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  cuisine: string;
  country: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  tags: string[];
}

const initialFormData: RecipeData = {
  title: '',
  description: '',
  ingredients: [''],
  instructions: [''],
  image: '',
  cuisine: '',
  country: '',
  difficulty: 'medium',
  prepTime: '',
  cookTime: '',
  servings: '',
  tags: [],
};

export default function RecipeForm({ recipeId }: RecipeFormProps) {
  const { data: session, status } = useSession();
  const t = useTranslations('recipes.form');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const locale = useLocale();
  const countries = useMemo(() => countryOptions(locale), [locale]);
  const router = useRouter();
  const [formData, setFormData] = useState<RecipeData>(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(!!recipeId);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditMode = !!recipeId;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error('Recipe not found');
      }
      const data = await response.json();
      const recipe = data.recipe || data; // Handle both { recipe } and direct recipe response
      
      // Check if user owns this recipe
      if (recipe.authorId !== session?.user?.id && recipe.author?.id !== session?.user?.id) {
        router.push(`/recipes/${recipeId}`);
        return;
      }

      const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
      const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: ingredients.length > 0 ? ingredients : [''],
        instructions: steps.length > 0 ? steps : [''],
        image: recipe.image || '',
        cuisine: recipe.cuisine || '',
        country: recipe.country || '',
        difficulty: recipe.difficulty || 'medium',
        prepTime: recipe.prepTime?.toString() || '',
        cookTime: recipe.cookTime?.toString() || '',
        servings: recipe.servings?.toString() || '',
        tags: recipe.tags || [],
      });
      if (recipe.image) {
        setImagePreview(recipe.image);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      router.push('/recipes');
    } finally {
      setLoadingRecipe(false);
    }
  }, [recipeId, session?.user?.id, router]);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId, fetchRecipe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length <= 1) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, convert to base64 (in production, you'd upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // A tag still sitting in the input counts, even if "Add" was never pressed
    const pendingTag = tagInput.trim().toLowerCase();
    const tags =
      pendingTag && !formData.tags.includes(pendingTag)
        ? [...formData.tags, pendingTag]
        : formData.tags;

    // Filter out empty ingredients and instructions.
    // The API stores instructions under `steps`.
    const { instructions, ...fields } = formData;
    const cleanedData = {
      ...fields,
      description: formData.description.trim(),
      tags,
      ingredients: formData.ingredients.filter(i => i.trim()),
      steps: instructions.filter(i => i.trim()),
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
      cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
      servings: formData.servings ? parseInt(formData.servings) : null,
      published: true, // Publish recipes by default
    };

    // Validation
    if (!cleanedData.title.trim()) {
      setError(t('titleRequired'));
      setLoading(false);
      return;
    }
    if (cleanedData.ingredients.length === 0) {
      setError(t('ingredientRequired'));
      setLoading(false);
      return;
    }
    if (cleanedData.steps.length === 0) {
      setError(t('instructionRequired'));
      setLoading(false);
      return;
    }

    try {
      const url = isEditMode ? `/api/recipes/${recipeId}` : '/api/recipes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('saveFailed'));
      }

      const data = await response.json();
      const recipe = data.recipe || data; // Handle both { recipe } and direct recipe response
      
      // Refresh the router cache to ensure recipe lists show the new/updated recipe
      router.refresh();
      router.push(`/recipes/${recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loadingRecipe) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isEditMode ? t('editTitle') : t('createTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {isEditMode 
              ? t('editSubtitle')
              : t('createSubtitle')
            }
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('titlePlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('descriptionPlaceholder')}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('image')}
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt={t('preview')} fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
            </div>

            {/* Cuisine & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('cuisine')}
                </label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="">{t('selectCuisine')}</option>
                  <CuisineOptions current={formData.cuisine} />
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('country')}
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="">{t('selectCountry')}</option>
                  {/* A recipe saved with a name the list no longer offers keeps it */}
                  {formData.country && !countries.some(c => c.value === formData.country) && (
                    <option value={formData.country}>{labels.country(formData.country)}</option>
                  )}
                  {countries.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty & Times */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('difficulty')}
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="easy">{labels.difficulty('easy')}</option>
                  <option value="medium">{labels.difficulty('medium')}</option>
                  <option value="hard">{labels.difficulty('hard')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('prepTime')}
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  min="0"
                  placeholder="15"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('cookTime')}
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleChange}
                  min="0"
                  placeholder="30"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('servings')}
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  min="1"
                  placeholder="4"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('ingredients')} *
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      placeholder={t('ingredientPlaceholder', { number: index + 1 })}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', index)}
                      disabled={formData.ingredients.length <= 1}
                      className="px-4 py-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="text-teal-600 hover:text-teal-600 text-sm font-medium"
                >
                  + {t('addIngredient')}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('instructions')} *
              </label>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-8 h-12 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                      placeholder={t('stepPlaceholder', { number: index + 1 })}
                      rows={2}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('instructions', index)}
                      disabled={formData.instructions.length <= 1}
                      className="px-4 py-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions')}
                  className="text-teal-600 hover:text-teal-600 text-sm font-medium"
                >
                  + {t('addStep')}
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('tags')}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder={t('tagPlaceholder')}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-800"
                >
                  {t('add')}
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {tc('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? tc('saving') : isEditMode ? t('update') : t('create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
