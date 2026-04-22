import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { evaluateAchievements } from '@/lib/achievements';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/recipes/[id]/cook
 * Log that the authenticated user cooked this recipe.
 * Body (optional): { rating?: 1-5, notes?: string }
 * Side effect: re-evaluates achievements and unlocks any newly-qualifying ones.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({ where: { id }, select: { id: true } });
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  let body: { rating?: number; notes?: string } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  const rating =
    typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5
      ? Math.round(body.rating)
      : null;
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 1000) : null;

  const log = await prisma.cookingLog.create({
    data: {
      userId: session.user.id,
      recipeId: id,
      rating,
      notes,
    },
  });

  const newlyUnlocked = await evaluateAchievements(session.user.id);

  return NextResponse.json({ success: true, log, newlyUnlocked });
}
