import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

/**
 * GET /api/user/profile-overview
 * Returns the authenticated user's profile overview data:
 * - recent recipes they created
 * - cuisine passport (cuisines from cooking log, with counts)
 * - achievements (all with locked/unlocked state)
 * - cooking streak (consecutive days with cooking activity)
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const [recentRecipes, cookingLogs, allAchievements, userAchievements, recipeCount, favoriteCount] = await Promise.all([
    // Last 3 recipes the user created
    prisma.recipe.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        image: true,
        cuisine: true,
        createdAt: true,
        _count: { select: { favorites: true } },
      },
    }),
    // All cooking log entries with recipe cuisine/country for passport + streak
    prisma.cookingLog.findMany({
      where: { userId },
      orderBy: { cookedAt: 'desc' },
      select: {
        cookedAt: true,
        recipe: { select: { cuisine: true, country: true } },
      },
    }),
    prisma.achievement.findMany({ orderBy: { threshold: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId } }),
    prisma.recipe.count({ where: { authorId: userId } }),
    prisma.favorite.count({ where: { userId } }),
  ]);

  // Build cuisine passport: { country, cuisine, count }[]
  const passportMap = new Map<string, { country: string; cuisine: string; count: number }>();
  for (const log of cookingLogs) {
    const country = log.recipe.country || log.recipe.cuisine || 'Unknown';
    const key = country;
    const existing = passportMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      passportMap.set(key, {
        country,
        cuisine: log.recipe.cuisine || country,
        count: 1,
      });
    }
  }
  const cuisinePassport = Array.from(passportMap.values()).sort((a, b) => b.count - a.count);

  // Compute cooking streak: count of consecutive days ending today (or yesterday) with activity
  const streak = computeStreak(cookingLogs.map((l) => l.cookedAt));

  // Merge achievements with unlocked state
  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
  const achievements = allAchievements.map((a) => ({
    id: a.id,
    key: a.key,
    title: a.title,
    description: a.description,
    icon: a.icon,
    unlocked: unlockedIds.has(a.id),
  }));

  return NextResponse.json({
    recentRecipes: recentRecipes.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      cuisine: r.cuisine,
      saves: r._count.favorites,
      createdAt: r.createdAt,
    })),
    cuisinePassport,
    achievements,
    streak,
    stats: {
      recipesCreated: recipeCount,
      recipesSaved: favoriteCount,
      recipesTried: cookingLogs.length,
      countriesExplored: passportMap.size,
    },
  });
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  // Normalize to UTC date strings (YYYY-MM-DD) and dedupe
  const daySet = new Set<string>();
  for (const d of dates) {
    daySet.add(d.toISOString().slice(0, 10));
  }

  // Walk backward from today; if today has no entry, start from yesterday
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let cursor = new Date(today);
  const todayKey = today.toISOString().slice(0, 10);
  if (!daySet.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
