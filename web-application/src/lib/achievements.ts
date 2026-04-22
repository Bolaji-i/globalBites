import prisma from './prisma';

/**
 * Re-evaluate all achievements for a user and unlock any they now qualify for.
 * Returns newly-unlocked achievement keys.
 *
 * Categories understood here match the seeded `category` column:
 *   - "recipes" with key "first_recipe"/"master_chef" → recipesCreated threshold
 *   - "recipes" with key "recipe_collector"           → favoritesCount threshold
 *   - "countries" key "world_explorer"                → distinct cooked countries
 *   - "countries" key "cuisine_curious"               → distinct cooked cuisines
 *   - "streak"                                        → cooking streak in days
 */
export async function evaluateAchievements(userId: string): Promise<string[]> {
  const [allAchievements, alreadyUnlocked, recipesCreated, favoritesCount, cookingLogs] =
    await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
      prisma.recipe.count({ where: { authorId: userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.cookingLog.findMany({
        where: { userId },
        select: {
          cookedAt: true,
          recipe: { select: { cuisine: true, country: true } },
        },
      }),
    ]);

  const unlockedIds = new Set(alreadyUnlocked.map((u) => u.achievementId));

  const countries = new Set(
    cookingLogs.map((l) => l.recipe.country).filter((c): c is string => !!c),
  );
  const cuisines = new Set(
    cookingLogs.map((l) => l.recipe.cuisine).filter((c): c is string => !!c),
  );
  const streak = computeStreak(cookingLogs.map((l) => l.cookedAt));

  const toUnlock: { id: string; key: string }[] = [];

  for (const a of allAchievements) {
    if (unlockedIds.has(a.id)) continue;

    let qualifies = false;
    if (a.category === 'recipes') {
      if (a.key === 'recipe_collector') qualifies = favoritesCount >= a.threshold;
      else qualifies = recipesCreated >= a.threshold;
    } else if (a.category === 'countries') {
      if (a.key === 'cuisine_curious') qualifies = cuisines.size >= a.threshold;
      else qualifies = countries.size >= a.threshold;
    } else if (a.category === 'streak') {
      qualifies = streak >= a.threshold;
    }

    if (qualifies) toUnlock.push({ id: a.id, key: a.key });
  }

  if (toUnlock.length > 0) {
    await prisma.userAchievement.createMany({
      data: toUnlock.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    });
  }

  return toUnlock.map((a) => a.key);
}

export function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const daySet = new Set<string>();
  for (const d of dates) daySet.add(d.toISOString().slice(0, 10));

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const cursor = new Date(today);
  if (!daySet.has(cursor.toISOString().slice(0, 10))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
