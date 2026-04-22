import RecipeDetail from '@/components/recipes/RecipeDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  return <RecipeDetail recipeId={id} />;
}
