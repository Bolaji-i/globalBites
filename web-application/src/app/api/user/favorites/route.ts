import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/users';

/**
 * GET /api/user/favorites
 * Get the current user's saved/favorited recipes
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

    // Get favorited recipes with counts
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          recipe: {
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
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  image: true
                }
              },
              _count: {
                select: { favorites: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.favorite.count({
        where: {
          userId: session.user.id
        }
      })
    ]);

    // Transform to recipe-centric format
    const recipes = favorites
      .filter(fav => fav.recipe.published) // Only show published recipes
      .map(fav => ({
        ...fav.recipe,
        totalTime: (fav.recipe.prepTime || 0) + (fav.recipe.cookTime || 0),
        saves: fav.recipe._count.favorites,
        savedAt: fav.createdAt,
        authorName: fav.recipe.author 
          ? `${fav.recipe.author.firstName} ${fav.recipe.author.lastName}`.trim() 
          : 'Unknown'
      }));

    return NextResponse.json({
      recipes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
