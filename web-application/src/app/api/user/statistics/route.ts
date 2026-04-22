import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { computeStreak } from '@/lib/achievements';

/**
 * GET /api/user/statistics
 * Aggregated stats: overview cards, 6-month activity, top cuisines, milestones, community impact.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 5);
  sixMonthsAgo.setUTCDate(1);
  sixMonthsAgo.setUTCHours(0, 0, 0, 0);

  const [
    recipesTriedLogs,
    countriesRows,
    cookingLogsAll,
    allRecipes,
    favoritesByUser,
    recipesWithCookTime,
    milestoneAchievements,
    firstRecipe,
    favoritesOfUsersRecipes,
    monthlyCreated,
    monthlyCooked,
    monthlySaved,
  ] = await Promise.all([
    prisma.cookingLog.findMany({
      where: { userId },
      select: {
        cookedAt: true,
        recipe: { select: { country: true, cuisine: true, cookTime: true } },
      },
    }),
    prisma.cookingLog.findMany({
      where: { userId },
      select: { recipe: { select: { country: true } } },
    }),
    prisma.cookingLog.findMany({
      where: { userId },
      select: { cookedAt: true },
    }),
    prisma.recipe.findMany({
      where: { authorId: userId },
      select: { id: true, cookTime: true, createdAt: true },
    }),
    prisma.favorite.findMany({
      where: { userId },
      select: { createdAt: true },
    }),
    prisma.recipe.findMany({
      where: { authorId: userId },
      select: { cookTime: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'asc' },
    }),
    prisma.recipe.findFirst({
      where: { authorId: userId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, title: true },
    }),
    prisma.favorite.count({
      where: { recipe: { authorId: userId } },
    }),
    prisma.recipe.findMany({
      where: { authorId: userId, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.cookingLog.findMany({
      where: { userId, cookedAt: { gte: sixMonthsAgo } },
      select: { cookedAt: true },
    }),
    prisma.favorite.findMany({
      where: { userId, createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Overview
  const recipesTried = recipesTriedLogs.length;
  const countriesExplored = new Set(
    countriesRows.map((r) => r.recipe.country).filter((c): c is string => !!c),
  ).size;
  const kitchenMinutes = recipesTriedLogs.reduce(
    (sum, l) => sum + (l.recipe.cookTime || 0),
    0,
  );
  const streak = computeStreak(cookingLogsAll.map((l) => l.cookedAt));

  // Monthly activity — last 6 months
  const months: { key: string; label: string; recipes: number; cooked: number; saved: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push({
      key: `${d.getUTCFullYear()}-${d.getUTCMonth()}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
      recipes: 0,
      cooked: 0,
      saved: 0,
    });
  }
  const monthIndex = new Map(months.map((m, i) => [m.key, i]));
  const bump = (date: Date, field: 'recipes' | 'cooked' | 'saved') => {
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const idx = monthIndex.get(key);
    if (idx !== undefined) months[idx][field] += 1;
  };
  for (const r of monthlyCreated) bump(r.createdAt, 'recipes');
  for (const c of monthlyCooked) bump(c.cookedAt, 'cooked');
  for (const f of monthlySaved) bump(f.createdAt, 'saved');

  // Top cuisines — count from cooking logs by cuisine
  const cuisineMap = new Map<string, number>();
  for (const l of recipesTriedLogs) {
    const cuisine = l.recipe.cuisine;
    if (!cuisine) continue;
    cuisineMap.set(cuisine, (cuisineMap.get(cuisine) || 0) + 1);
  }
  const cuisineEntries = Array.from(cuisineMap.entries()).sort((a, b) => b[1] - a[1]);
  const totalCuisineCooks = cuisineEntries.reduce((s, [, c]) => s + c, 0) || 1;
  const palette = [
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-purple-500',
  ];
  const top = cuisineEntries.slice(0, 5).map(([cuisine, count], i) => ({
    cuisine,
    count,
    percentage: Math.round((count / totalCuisineCooks) * 100),
    color: palette[i],
  }));
  const otherCount = cuisineEntries.slice(5).reduce((s, [, c]) => s + c, 0);
  if (otherCount > 0) {
    top.push({
      cuisine: 'Others',
      count: otherCount,
      percentage: Math.round((otherCount / totalCuisineCooks) * 100),
      color: 'bg-gray-400',
    });
  }

  // Milestones — from unlocked achievements, plus "First Recipe" if they've created one
  const milestones: { title: string; date: string; icon: string }[] = [];
  if (firstRecipe) {
    milestones.push({
      title: 'First Recipe',
      date: firstRecipe.createdAt.toISOString(),
      icon: '🎯',
    });
  }
  for (const ua of milestoneAchievements) {
    milestones.push({
      title: ua.achievement.title,
      date: ua.unlockedAt.toISOString(),
      icon: ua.achievement.icon,
    });
  }
  milestones.sort((a, b) => (a.date < b.date ? -1 : 1));

  return NextResponse.json({
    overview: {
      recipesTried,
      countriesExplored,
      kitchenHours: Math.round(kitchenMinutes / 60),
      streak,
    },
    monthly: months.map((m) => ({
      month: m.label,
      recipes: m.recipes,
      cooked: m.cooked,
      saved: m.saved,
    })),
    topCuisines: top,
    milestones,
    communityImpact: {
      recipesCreated: allRecipes.length,
      favoritesByOthers: favoritesOfUsersRecipes,
      favoritesByUser: favoritesByUser.length,
      totalCookTimeAvailable: recipesWithCookTime.reduce(
        (s, r) => s + (r.cookTime || 0),
        0,
      ),
    },
  });
}
