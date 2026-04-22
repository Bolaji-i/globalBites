import RecipeForm from '@/components/recipes/RecipeForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  return <RecipeForm recipeId={id} />;
}
