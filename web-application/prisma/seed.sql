INSERT INTO "achievements" ("id", "key", "title", "description", "icon", "threshold", "category") VALUES
  ('ach_first_recipe', 'first_recipe', 'First Recipe', 'Created your first recipe', '🎯', 1, 'recipes'),
  ('ach_master_chef', 'master_chef', 'Master Chef', 'Created 20+ recipes', '🏆', 20, 'recipes'),
  ('ach_world_explorer', 'world_explorer', 'World Explorer', 'Tried recipes from 25+ countries', '🌍', 25, 'countries'),
  ('ach_cuisine_curious', 'cuisine_curious', 'Cuisine Curious', 'Tried recipes from 5 different cuisines', '🍽️', 5, 'countries'),
  ('ach_streak_starter', 'streak_starter', 'Streak Starter', 'Cooked for 7 days straight', '🔥', 7, 'streak'),
  ('ach_streak_master', 'streak_master', '30-Day Streak', 'Cooked for 30 days straight', '🔥', 30, 'streak'),
  ('ach_recipe_collector', 'recipe_collector', 'Recipe Collector', 'Saved 100+ recipes to favorites', '❤️', 100, 'recipes')
ON CONFLICT ("key") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "icon" = EXCLUDED."icon",
  "threshold" = EXCLUDED."threshold",
  "category" = EXCLUDED."category";
