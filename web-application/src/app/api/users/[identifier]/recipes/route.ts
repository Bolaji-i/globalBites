import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/users';

/**
 * GET /api/users/[identifier]/recipes
 * Get recipes by a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Find user by username or ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { id: identifier }
        ]
      },
      select: { id: true, profileVisibility: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If profile is private, don't show recipes
    if (user.profileVisibility === 'private') {
      return NextResponse.json({
        recipes: [],
        total: 0,
        page,
        totalPages: 0,
        message: 'This profile is private'
      });
    }

    // Get published recipes by user
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where: {
          authorId: user.id,
          published: true
        },
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          cuisine: true,
          difficulty: true,
          prepTime: true,
          cookTime: true,
          createdAt: true,
          _count: {
            select: { favorites: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.recipe.count({
        where: {
          authorId: user.id,
          published: true
        }
      })
    ]);

    return NextResponse.json({
      recipes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get user recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user recipes' },
      { status: 500 }
    );
  }
}
