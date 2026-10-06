'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRecipeLabels } from '@/hooks/useLocaleFormat';
import { Button, Eyebrow, SectionHead, MetaLine } from '@/components/ui';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  difficulty: string | null;
  prepTime: number | null;
  cookTime: number | null;
  author: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    favorites: number;
  };
}

interface CuisineStat {
  cuisine: string;
  count: number;
}

/**
 * Flags only. The previous version pinned a hardcoded Unsplash photo to each
 * of twelve cuisines — generic stock that appears on every other recipe site,
 * and one of the URLs had already rotted to a 404. Cuisines are presented as
 * a typographic index instead; photography is reserved for real recipes.
 */
const cuisineFlags: Record<string, string> = {
  Italian: '🇮🇹',
  Japanese: '🇯🇵',
  Mexican: '🇲🇽',
  Indian: '🇮🇳',
  French: '🇫🇷',
  Thai: '🇹🇭',
  Chinese: '🇨🇳',
  Greek: '🇬🇷',
  Korean: '🇰🇷',
  Vietnamese: '🇻🇳',
  American: '🇺🇸',
  Spanish: '🇪🇸',
  Ghanaian: '🇬🇭',
  Nigerian: '🇳🇬',
  Turkish: '🇹🇷',
  Lebanese: '🇱🇧',
};

function recipeMeta(
  recipe: Recipe,
  minutes: (count: number) => string,
  difficulty: (value: string) => string
): Array<string | null> {
  const total = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  return [
    total > 0 ? minutes(total) : null,
    recipe.difficulty ? difficulty(recipe.difficulty) : null,
  ];
}

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [cuisineStats, setCuisineStats] = useState<CuisineStat[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const labels = useRecipeLabels();
  const minutes = (count: number) => tc('minutes', { count });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, statsRes] = await Promise.all([
        fetch('/api/recipes?featured=true&limit=4', { cache: 'no-store' }),
        fetch('/api/recipes?stats=true', { cache: 'no-store' }),
      ]);

      if (featuredRes.ok) {
        const featuredData = await featuredRes.json();
        setFeaturedRecipes(featuredData.recipes || []);
        setTotalRecipes(featuredData.total || 0);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setCuisineStats(statsData.cuisineStats || []);
        setTotalUsers(statsData.totalUsers || 0);
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [lead, ...rest] = featuredRecipes;

  return (
    <div className="bg-paper-50 dark:bg-paper-950">
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 lg:px-8 lg:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{t('hero.subtitle')}</Eyebrow>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-paper-900 sm:text-6xl lg:text-7xl dark:text-paper-50">
              {t('hero.title')}
            </h1>
            <p className="mt-7 max-w-xl font-display text-xl leading-relaxed text-paper-600 dark:text-paper-300">
              {t('hero.description')}
            </p>

            {/* Search — a ruled line, not a pill. Reads as editorial furniture. */}
            <form onSubmit={handleSearch} className="mt-10 max-w-xl">
              <label htmlFor="recipe-search" className="sr-only">
                {tc('search')}
              </label>
              <div className="flex items-center gap-3 border-b border-paper-300 pb-3 transition-colors focus-within:border-accent-600 dark:border-paper-700 dark:focus-within:border-accent-400">
                <input
                  id="recipe-search"
                  type="text"
                  placeholder={tc('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-display text-lg text-paper-900 placeholder-paper-400 focus:outline-none dark:text-paper-50 dark:placeholder-paper-500"
                />
                <button
                  type="submit"
                  aria-label={tc('search')}
                  className="shrink-0 text-paper-500 transition-colors hover:text-accent-600 dark:hover:text-accent-400"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Standing figures, set as a ruled column */}
          <div className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-paper-200 border-y border-paper-200 dark:divide-paper-800 dark:border-paper-800">
              {[
                { label: t('stats.recipes'), value: totalRecipes },
                { label: t('stats.cuisines'), value: cuisineStats.length },
                { label: t('stats.contributors'), value: totalUsers },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between py-4">
                  <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper-500 dark:text-paper-400">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-3xl text-paper-900 dark:text-paper-50">
                    {stat.value.toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <SectionHead
          eyebrow={t('featured.eyebrow')}
          title={featuredRecipes.length > 0 ? t('featured.heading') : t('featured.headingEmpty')}
          lede={
            featuredRecipes.length > 0
              ? t('featured.lede')
              : t('featured.ledeEmpty')
          }
        />

        <div className="mt-14">
          {loading ? (
            <div className="space-y-14">
              <div className="grid animate-pulse gap-8 lg:grid-cols-12">
                <div className="aspect-[4/3] bg-paper-200 lg:col-span-7 dark:bg-paper-800" />
                <div className="space-y-4 lg:col-span-5">
                  <div className="h-3 w-24 bg-paper-200 dark:bg-paper-800" />
                  <div className="h-10 bg-paper-200 dark:bg-paper-800" />
                  <div className="h-4 w-3/4 bg-paper-200 dark:bg-paper-800" />
                </div>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="aspect-[4/3] bg-paper-200 dark:bg-paper-800" />
                    <div className="h-4 bg-paper-200 dark:bg-paper-800" />
                    <div className="h-3 w-1/2 bg-paper-200 dark:bg-paper-800" />
                  </div>
                ))}
              </div>
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="space-y-16">
              {/* Lead story — asymmetric, photo carries the weight */}
              {lead && (
                <Link href={`/recipes/${lead.id}`} className="group grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-100 lg:col-span-7 dark:bg-paper-900">
                    {lead.image ? (
                      <Image
                        src={lead.image}
                        alt={lead.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-paper-400">
                        {t('featured.noPhoto')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center lg:col-span-5">
                    {lead.cuisine && <Eyebrow>{labels.cuisine(lead.cuisine)}</Eyebrow>}
                    <h3 className="mt-4 font-display text-3xl leading-tight text-paper-900 transition-colors group-hover:text-accent-600 lg:text-4xl dark:text-paper-50 dark:group-hover:text-accent-400">
                      {lead.title}
                    </h3>
                    {lead.description && (
                      <p className="mt-4 line-clamp-3 font-display text-lg leading-relaxed text-paper-600 dark:text-paper-300">
                        {lead.description}
                      </p>
                    )}
                    <MetaLine items={recipeMeta(lead, minutes, labels.difficulty)} className="mt-5" />
                    <span className="mt-6 font-sans text-sm font-medium text-accent-600 dark:text-accent-400">
                      {t('featured.readRecipe')}
                    </span>
                  </div>
                </Link>
              )}

              {/* Secondary run */}
              {rest.length > 0 && (
                <div className="grid gap-10 border-t border-paper-200 pt-14 sm:grid-cols-3 dark:border-paper-800">
                  {rest.map((recipe) => (
                    <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
                      <div className="relative aspect-[4/3] overflow-hidden bg-paper-100 dark:bg-paper-900">
                        {recipe.image ? (
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 30vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-display text-sm text-paper-400">
                            {t('featured.noPhoto')}
                          </div>
                        )}
                      </div>
                      {recipe.cuisine && <Eyebrow className="mt-4">{labels.cuisine(recipe.cuisine)}</Eyebrow>}
                      <h3 className="mt-2 font-display text-xl leading-snug text-paper-900 transition-colors group-hover:text-accent-600 dark:text-paper-50 dark:group-hover:text-accent-400">
                        {recipe.title}
                      </h3>
                      <MetaLine items={recipeMeta(recipe, minutes, labels.difficulty)} className="mt-2" />
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-paper-200 pt-10 dark:border-paper-800">
                <Button href="/recipes" variant="secondary" size="lg">
                  {t('featured.browseAll')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-y border-paper-200 py-20 text-center dark:border-paper-800">
              <p className="font-display text-xl text-paper-600 dark:text-paper-300">
                {t('featured.empty')}
              </p>
              <Button href="/recipes/new" size="lg" className="mt-8">
                {t('featured.writeFirst')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Cuisine index ────────────────────────────────────────────────── */}
      {cuisineStats.length > 0 && (
        <section className="border-t border-paper-200 dark:border-paper-800">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
            <SectionHead
              eyebrow={t('index.eyebrow')}
              title={t('index.title')}
              lede={t('index.lede')}
            />

            <ul className="mt-12 grid gap-x-12 border-t border-paper-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-paper-800">
              {cuisineStats.map((stat) => (
                <li key={stat.cuisine} className="border-b border-paper-200 dark:border-paper-800">
                  <Link
                    href={`/recipes?cuisine=${encodeURIComponent(stat.cuisine)}`}
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="flex items-baseline gap-3">
                      <span aria-hidden="true">{cuisineFlags[stat.cuisine] || '🌐'}</span>
                      <span className="font-display text-lg text-paper-900 transition-colors group-hover:text-accent-600 dark:text-paper-50 dark:group-hover:text-accent-400">
                        {labels.cuisine(stat.cuisine)}
                      </span>
                    </span>
                    <span className="font-sans text-sm tabular-nums text-paper-400 dark:text-paper-500">
                      {stat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Colophon / CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-paper-200 dark:border-paper-800">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
          <Eyebrow className="text-center">
            {session ? t('cta.eyebrowMember') : t('cta.eyebrowGuest')}
          </Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-tight text-paper-900 sm:text-5xl dark:text-paper-50">
            {session ? t('cta.titleMember') : t('cta.titleGuest')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-display text-lg leading-relaxed text-paper-600 dark:text-paper-300">
            {session
              ? t('cta.ledeMember')
              : t('cta.ledeGuest')}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            {!session && (
              <Button href="/register" size="lg">
                {t('cta.createAccount')}
              </Button>
            )}
            <Button href={session ? '/recipes/new' : '/recipes'} variant="secondary" size="lg">
              {session ? t('cta.writeRecipe') : t('cta.browseRecipes')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
