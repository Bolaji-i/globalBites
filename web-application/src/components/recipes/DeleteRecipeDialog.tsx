'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { DoubleConfirmDialog } from '@/components/ui';

interface DeleteRecipeDialogProps {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
  onDeleted: () => void;
}

/**
 * Two-step confirmation for deleting a recipe. Render it only while open.
 */
export default function DeleteRecipeDialog({
  recipeId,
  recipeTitle,
  onClose,
  onDeleted,
}: DeleteRecipeDialogProps) {
  const t = useTranslations('recipes.delete');
  const tc = useTranslations('common');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = (chunks: ReactNode) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{chunks}</strong>
  );

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
      if (response.ok) {
        onDeleted();
        return;
      }
      setError(t('failed'));
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(t('failed'));
    }
    setDeleting(false);
  };

  return (
    <DoubleConfirmDialog
      steps={[
        {
          title: t('title'),
          message: t.rich('message', { title: recipeTitle, b: name }),
          action: t('continue'),
        },
        {
          title: t('finalTitle'),
          message: t.rich('finalMessage', { title: recipeTitle, b: name }),
          action: t('confirm'),
        },
      ]}
      cancelLabel={tc('cancel')}
      backLabel={t('back')}
      busyLabel={tc('deleting')}
      stepLabel={(step) => t('step', { step, total: 2 })}
      busy={deleting}
      error={error}
      onCancel={onClose}
      onConfirm={handleConfirm}
    />
  );
}
