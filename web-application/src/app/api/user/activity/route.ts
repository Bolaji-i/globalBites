import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

type ActivityEvent = {
  id: string;
  type: 'recipe_created' | 'recipe_saved' | 'cooked' | 'achievement';
  title: string;
  description: string;
  at: string;
  icon: string;
  color: string;
};

/**
 * GET /api/user/activity
 * Returns the authenticated user's recent activity feed, cooking journal, and weekly counts.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const weekAgo = new Date();
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

  const [
    recentRecipes,
    recentFavorites,
    recentCooks,
    recentAchievements,
    cookingJournal,
    recipesCreatedWeek,
    recipesSavedWeek,
    recipesCookedWeek,
  ] = await Promise.all([
    prisma.recipe.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
            author: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.cookingLog.findMany({
      where: { userId },
      orderBy: { cookedAt: 'desc' },
      take: 10,
      include: { recipe: { select: { id: true, title: true } } },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
      take: 10,
      include: { achievement: true },
    }),
    prisma.cookingLog.findMany({
      where: { userId },
      orderBy: { cookedAt: 'desc' },
      take: 5,
      include: {
        recipe: { select: { id: true, title: true, image: true } },
      },
    }),
    prisma.recipe.count({ where: { authorId: userId, createdAt: { gte: weekAgo } } }),
    prisma.favorite.count({ where: { userId, createdAt: { gte: weekAgo } } }),
    prisma.cookingLog.count({ where: { userId, cookedAt: { gte: weekAgo } } }),
  ]);

  const events: ActivityEvent[] = [
    ...recentRecipes.map<ActivityEvent>((r) => ({
      id: `recipe-${r.id}`,
      type: 'recipe_created',
      title: 'Created a new recipe',
      description: r.title,
      at: r.createdAt.toISOString(),
      icon: '📝',
      color: 'bg-green-500',
    })),
    ...recentFavorites.map<ActivityEvent>((f) => ({
      id: `fav-${f.id}`,
      type: 'recipe_saved',
      title: 'Saved a recipe',
      description: `${f.recipe.title}${
        f.recipe.author ? ` by ${f.recipe.author.firstName} ${f.recipe.author.lastName}` : ''
      }`,
      at: f.createdAt.toISOString(),
      icon: '❤️',
      color: 'bg-pink-500',
    })),
    ...recentCooks.map<ActivityEvent>((c) => ({
      id: `cook-${c.id}`,
      type: 'cooked',
      title: 'Cooked a recipe',
      description: c.recipe.title,
      at: c.cookedAt.toISOString(),
      icon: '🍳',
      color: 'bg-orange-500',
    })),
    ...recentAchievements.map<ActivityEvent>((ua) => ({
      id: `ach-${ua.id}`,
      type: 'achievement',
      title: 'Unlocked achievement',
      description: `${ua.achievement.title} - ${ua.achievement.description}`,
      at: ua.unlockedAt.toISOString(),
      icon: ua.achievement.icon,
      color: 'bg-purple-500',
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 15);

  return NextResponse.json({
    events,
    cookingJournal: cookingJournal.map((c) => ({
      id: c.id,
      recipeId: c.recipe.id,
      recipe: c.recipe.title,
      image: c.recipe.image,
      rating: c.rating,
      notes: c.notes,
      cookedAt: c.cookedAt.toISOString(),
    })),
    thisWeek: {
      recipesCreated: recipesCreatedWeek,
      recipesSaved: recipesSavedWeek,
      recipesCooked: recipesCookedWeek,
    },
  });
}
