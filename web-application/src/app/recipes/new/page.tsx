import RecipeForm from '@/components/recipes/RecipeForm';

export const metadata = {
  title: 'Create Recipe | GlobalBites',
  description: 'Share your favorite recipe with the world',
};

export default function NewRecipePage() {
  return <RecipeForm />;
}
