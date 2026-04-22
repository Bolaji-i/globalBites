import prisma from './prisma';

// Define Recipe type locally to avoid import issues with Prisma client generation
interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  country: string | null;
  difficulty: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  ingredients: unknown;
  steps: unknown;
  tags: string[];
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Recipe with author information
 */
export type RecipeWithAuthor = Recipe & {
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string | null;
    image: string | null;
  };
  _count?: {
    favorites: number;
  };
};

/**
 * Create recipe input data
 */
export interface CreateRecipeData {
  title: string;
  description?: string;
  image?: string;
  cuisine?: string;
  country?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
  published?: boolean;
  authorId: string;
}

/**
 * Update recipe input data
 */
export interface UpdateRecipeData {
  title?: string;
  description?: string;
  image?: string;
  cuisine?: string;
  country?: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
  published?: boolean;
}

/**
 * Recipe search/filter parameters
 */
export interface RecipeSearchParams {
  query?: string;
  cuisine?: string;
  difficulty?: string;
  maxPrepTime?: number;
  authorId?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Create a new recipe
 */
export async function createRecipe(data: CreateRecipeData): Promise<Recipe> {
  const recipe = await prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      cuisine: data.cuisine,
      country: data.country,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      ingredients: data.ingredients || [],
      steps: data.steps || [],
      tags: data.tags || [],
      published: data.published ?? false,
      authorId: data.authorId,
    },
  });

  return recipe;
}

/**
 * Get a recipe by ID
 */
export async function getRecipeById(id: string): Promise<RecipeWithAuthor | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: { favorites: true },
      },
    },
  });

  return recipe;
}

/**
 * Update a recipe
 */
export async function updateRecipe(id: string, data: UpdateRecipeData): Promise<Recipe> {
  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      ...data,
      ingredients: data.ingredients !== undefined ? data.ingredients : undefined,
      steps: data.steps !== undefined ? data.steps : undefined,
    },
  });

  return recipe;
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<void> {
  await prisma.recipe.delete({
    where: { id },
  });
}

// Type for recipe where input
interface RecipeWhereInput {
  published?: boolean;
  cuisine?: { equals: string; mode: 'insensitive' } | { contains: string; mode: 'insensitive' };
  difficulty?: string;
  prepTime?: { lte: number };
  authorId?: string;
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
    cuisine?: { contains: string; mode: 'insensitive' };
    tags?: { has: string };
  }>;
}

/**
 * Get recipes with filtering and pagination
 */
export async function getRecipes(params: RecipeSearchParams = {}): Promise<{
  recipes: RecipeWithAuthor[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const {
    query,
    cuisine,
    difficulty,
    maxPrepTime,
    authorId,
    published = true,
    page = 1,
    limit = 12,
  } = params;

  const where: RecipeWhereInput = {
    ...(published !== undefined && { published }),
    ...(cuisine && { cuisine: { equals: cuisine, mode: 'insensitive' as const } }),
    ...(difficulty && { difficulty }),
    ...(maxPrepTime && { prepTime: { lte: maxPrepTime } }),
    ...(authorId && { authorId }),
    ...(query && {
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { cuisine: { contains: query, mode: 'insensitive' as const } },
        { tags: { has: query.toLowerCase() } },
      ],
    }),
  };

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: { favorites: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    recipes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get recipes by user
 */
export async function getRecipesByUser(userId: string, includeUnpublished = false): Promise<RecipeWithAuthor[]> {
  const recipes = await prisma.recipe.findMany({
    where: {
      authorId: userId,
      ...(includeUnpublished ? {} : { published: true }),
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: { favorites: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return recipes;
}

/**
 * Get featured/popular recipes
 */
export async function getFeaturedRecipes(limit = 6): Promise<RecipeWithAuthor[]> {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: { favorites: true },
      },
    },
    orderBy: [
      { favorites: { _count: 'desc' } },
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  return recipes;
}

/**
 * Get cuisine statistics
 */
export async function getCuisineStats(): Promise<{ cuisine: string; count: number }[]> {
  const stats = await prisma.recipe.groupBy({
    by: ['cuisine'],
    where: {
      published: true,
      cuisine: { not: null },
    },
    _count: { cuisine: true },
    orderBy: { _count: { cuisine: 'desc' } },
    take: 10,
  });

  return stats
    .filter((s) => s.cuisine !== null)
    .map((s) => ({
      cuisine: s.cuisine!,
      count: s._count.cuisine,
    }));
}

/**
 * Add recipe to favorites
 */
export async function addFavorite(userId: string, recipeId: string): Promise<void> {
  await prisma.favorite.create({
    data: {
      userId,
      recipeId,
    },
  });
}

/**
 * Remove recipe from favorites
 */
export async function removeFavorite(userId: string, recipeId: string): Promise<void> {
  await prisma.favorite.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });
}

/**
 * Check if recipe is favorited by user
 */
export async function isFavorited(userId: string, recipeId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  return !!favorite;
}

/**
 * Get user's favorite recipes
 */
export async function getFavoriteRecipes(userId: string): Promise<RecipeWithAuthor[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      recipe: {
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: { favorites: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites.map((f: { recipe: RecipeWithAuthor }) => f.recipe);
}

/**
 * Get user statistics
 */
export async function getUserRecipeStats(userId: string): Promise<{
  recipesCreated: number;
  recipesSaved: number;
  totalFavorites: number;
}> {
  const [recipesCreated, recipesSaved, totalFavorites] = await Promise.all([
    prisma.recipe.count({ where: { authorId: userId } }),
    prisma.favorite.count({ where: { userId } }),
    prisma.favorite.count({
      where: {
        recipe: { authorId: userId },
      },
    }),
  ]);

  return {
    recipesCreated,
    recipesSaved,
    totalFavorites,
  };
}
