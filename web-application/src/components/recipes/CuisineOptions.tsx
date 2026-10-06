'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ALL_CUISINES, CUISINE_GROUPS, type CuisineGroup } from '@/lib/cuisines';
import { useRecipeLabels } from '@/hooks/useLocaleFormat';

interface CuisineOptionsProps {
  /** The select's current value, kept selectable even if the list no longer offers it */
  current?: string;
}

const GROUPS: CuisineGroup[] = ['regional', 'national', 'other'];

/**
 * `<option>`s for a cuisine `<select>`, grouped by region / country and
 * sorted within each group in the reader's language. Render it inside the
 * select, after any "all" or "choose one" option.
 */
export default function CuisineOptions({ current }: CuisineOptionsProps) {
  const t = useTranslations('recipes.cuisineGroups');
  const labels = useRecipeLabels();
  const collator = new Intl.Collator(useLocale());

  return (
    <>
      {current && !ALL_CUISINES.includes(current) && (
        <option value={current}>{labels.cuisine(current)}</option>
      )}
      {GROUPS.map((group) => (
        <optgroup key={group} label={t(group)}>
          {CUISINE_GROUPS[group]
            .map((value) => ({ value, label: labels.cuisine(value) }))
            .sort((a, b) => collator.compare(a.label, b.label))
            .map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </optgroup>
      ))}
    </>
  );
}
