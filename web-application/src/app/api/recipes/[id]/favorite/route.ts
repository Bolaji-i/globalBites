import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { addFavorite, removeFavorite, isFavorited } from '@/lib/recipes';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recipes/[id]/favorite
 * Check if recipe is favorited by current user
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const { id } = await params;
    const favorited = await isFavorited(session.user.id, id);

    return NextResponse.json({ isFavorited: favorited });
  } catch (error) {
    console.error('Check favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes/[id]/favorite
 * Add recipe to favorites
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to favorite a recipe' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if already favorited
    const alreadyFavorited = await isFavorited(session.user.id, id);
    if (alreadyFavorited) {
      return NextResponse.json(
        { error: 'Already favorited', message: 'Recipe is already in your favorites' },
        { status: 400 }
      );
    }

    await addFavorite(session.user.id, id);

    return NextResponse.json({ success: true, message: 'Recipe added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/[id]/favorite
 * Remove recipe from favorites
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to remove a favorite' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await removeFavorite(session.user.id, id);

    return NextResponse.json({ success: true, message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
