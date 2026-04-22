import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { 
  getRecipes, 
  createRecipe, 
  getFeaturedRecipes,
  getCuisineStats 
} from '@/lib/recipes';
import { prisma } from '@/lib/users';

/**
 * GET /api/recipes
 * Get recipes with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || undefined;
    const cuisine = searchParams.get('cuisine') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const maxPrepTime = searchParams.get('maxPrepTime') 
      ? parseInt(searchParams.get('maxPrepTime')!) 
      : undefined;
    const authorId = searchParams.get('authorId') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';
    const stats = searchParams.get('stats') === 'true';

    // Return cuisine statistics
    if (stats) {
      const [cuisineStats, totalRecipes, totalUsers] = await Promise.all([
        getCuisineStats(),
        prisma.recipe.count(),
        prisma.user.count()
      ]);
      return NextResponse.json({ 
        cuisineStats,
        totalRecipes,
        totalUsers
      });
    }

    // Return featured recipes
    if (featured) {
      const [featuredRecipes, total] = await Promise.all([
        getFeaturedRecipes(limit),
        prisma.recipe.count()
      ]);
      return NextResponse.json({ recipes: featuredRecipes, total });
    }

    // Return filtered recipes with pagination
    const result = await getRecipes({
      query,
      cuisine,
      difficulty,
      maxPrepTime,
      authorId,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes
 * Create a new recipe
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to create a recipe' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      image,
      cuisine,
      country,
      difficulty,
      prepTime,
      cookTime,
      servings,
      ingredients,
      steps,
      tags,
      published,
    } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Recipe title is required' },
        { status: 400 }
      );
    }

    const recipe = await createRecipe({
      title: title.trim(),
      description: description?.trim(),
      image,
      cuisine: cuisine?.trim(),
      country: country?.trim(),
      difficulty,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      ingredients: ingredients || [],
      steps: steps || [],
      tags: tags || [],
      published: published ?? false,
      authorId: session.user.id,
    });

    return NextResponse.json(
      { success: true, recipe },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
