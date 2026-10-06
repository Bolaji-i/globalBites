'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface IngredientChecklistProps {
  recipeId: string;
  ingredients: string[];
  /** Tighter spacing and smaller type, for the recipe pop-up */
  compact?: boolean;
}

// [index, ingredient text] — the text lets us drop ticks if the recipe is edited
type StoredTick = [number, string];

const storageKey = (recipeId: string) => `globalbites-ingredients-${recipeId}`;

function loadTicks(recipeId: string, ingredients: string[]): Set<number> {
  try {
    const stored: StoredTick[] = JSON.parse(localStorage.getItem(storageKey(recipeId)) || '[]');
    return new Set(
      stored.filter(([index, text]) => ingredients[index] === text).map(([index]) => index)
    );
  } catch {
    return new Set();
  }
}

function saveTicks(recipeId: string, ingredients: string[], ticks: Set<number>) {
  try {
    if (ticks.size === 0) {
      localStorage.removeItem(storageKey(recipeId));
    } else {
      const stored: StoredTick[] = [...ticks].map((index) => [index, ingredients[index]]);
      localStorage.setItem(storageKey(recipeId), JSON.stringify(stored));
    }
  } catch {
    // Storage unavailable (private mode, quota): ticks just won't persist
  }
}

/**
 * Cook-along ingredient list: tick items off as you gather or use them.
 * Ticks are remembered per recipe in this browser, so they survive a reload
 * and are shared between the recipe page and the pop-up.
 *
 * Only mount this on the client, and give it `key={recipeId}` so a different
 * recipe starts from its own saved ticks.
 */
export default function IngredientChecklist({
  recipeId,
  ingredients,
  compact = false,
}: IngredientChecklistProps) {
  const t = useTranslations('recipes.detail');
  const [ticks, setTicks] = useState(() => loadTicks(recipeId, ingredients));

  const update = (next: Set<number>) => {
    setTicks(next);
    saveTicks(recipeId, ingredients, next);
  };

  const toggle = (index: number) => {
    const next = new Set(ticks);
    if (!next.delete(index)) next.add(index);
    update(next);
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 ${
          compact ? 'mb-2' : 'mb-3'
        }`}
      >
        <span>
          {ticks.size > 0
            ? t('checklistProgress', { done: ticks.size, total: ingredients.length })
            : t('checklistHint')}
        </span>
        {ticks.size > 0 && (
          <button
            type="button"
            onClick={() => update(new Set())}
            className="shrink-0 font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            {t('checklistReset')}
          </button>
        )}
      </div>

      <ul className={compact ? 'space-y-2' : 'space-y-3'}>
        {ingredients.map((ingredient, index) => {
          const id = `ingredient-${recipeId}-${compact ? 'compact-' : ''}${index}`;
          const done = ticks.has(index);
          return (
            <li key={index} className={`flex items-start ${compact ? 'gap-2 text-sm' : 'gap-3'}`}>
              <input
                type="checkbox"
                id={id}
                checked={done}
                onChange={() => toggle(index)}
                className={`${
                  compact ? 'mt-0.5' : 'mt-1'
                } h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500`}
              />
              <label
                htmlFor={id}
                className={`cursor-pointer transition-colors ${
                  done
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {ingredient}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
