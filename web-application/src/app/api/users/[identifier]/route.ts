import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/users';

/**
 * GET /api/users/[identifier]
 * Get public user profile by username or ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    // Try to find user by username first, then by ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { id: identifier }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        profileVisibility: true,
        showLocation: true,
        createdAt: true,
        _count: {
          select: {
            recipes: {
              where: { published: true }
            },
            favorites: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check profile visibility
    if (user.profileVisibility === 'private') {
      return NextResponse.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        image: user.image,
        isPrivate: true
      });
    }

    // Return public profile data
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      image: user.image,
      bio: user.bio,
      location: user.showLocation ? user.location : null,
      website: user.website,
      createdAt: user.createdAt,
      recipeCount: user._count.recipes,
      favoriteCount: user._count.favorites,
      isPrivate: false
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
