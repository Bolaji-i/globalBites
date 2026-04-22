import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/users';

/**
 * GET /api/user/recipes
 * Get the current user's created recipes (including drafts)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const status = searchParams.get('status'); // 'published', 'draft', or null for all

    // Build where clause
    const whereClause: Record<string, unknown> = {
      authorId: session.user.id
    };

    if (status === 'published') {
      whereClause.published = true;
    } else if (status === 'draft') {
      whereClause.published = false;
    }

    // Get recipes with counts
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          cuisine: true,
          country: true,
          difficulty: true,
          prepTime: true,
          cookTime: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { favorites: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.recipe.count({
        where: whereClause
      })
    ]);

    // Transform recipes to include computed fields
    const transformedRecipes = recipes.map(recipe => ({
      ...recipe,
      totalTime: (recipe.prepTime || 0) + (recipe.cookTime || 0),
      saves: recipe._count.favorites,
      status: recipe.published ? 'published' : 'draft'
    }));

    return NextResponse.json({
      recipes: transformedRecipes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
