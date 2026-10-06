'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Globe, Sparkles, UtensilsCrossed, ChefHat, Smartphone, Target, Zap, Check } from 'lucide-react';

interface AboutContentProps {
  isAuthenticated: boolean;
}

// Client half of the about page: the language is chosen in the browser, so
// the copy has to render here rather than in the server component.
export default function AboutContent({ isAuthenticated }: AboutContentProps) {
  const t = useTranslations('about');

  return (
    <section 
      className="min-h-screen bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.rich('heading', {
              brand: (chunks) => <span className="text-teal-600">{chunks}</span>,
            })}
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-teal-600"></div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Mission Statement */}
          <div className="rounded-lg bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:bg-slate-900/80">
            <div className="mb-4 flex items-center gap-3">
              <Globe className="h-9 w-9 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('mission.title')}</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {t.rich('missionDescription', { b: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>

          {/* What We Offer */}
          <div className="rounded-lg bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:bg-slate-900/80">
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-9 w-9 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('whatWeOffer')}</h2>
            </div>
            <ul className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <UtensilsCrossed className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                <span><strong>{t('offer.recipeDiscovery')}</strong> {t('offer.recipeDiscoveryDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                <span><strong>{t('offer.multiLanguage')}</strong> {t('offer.multiLanguageDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <ChefHat className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                <span><strong>{t('offer.communitySharing')}</strong> {t('offer.communitySharingDesc')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                <span><strong>{t('offer.crossPlatform')}</strong> {t('offer.crossPlatformDesc')}</span>
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="rounded-lg bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:bg-slate-900/80">
            <div className="mb-4 flex items-center gap-3">
              <Target className="h-9 w-9 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('vision.title')}</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {t.rich('visionDescription', { b: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="rounded-lg bg-teal-600 p-8 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-9 w-9 text-white" />
              <h2 className="text-2xl font-bold">{t('techTitle')}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Next.js 16 & React 19</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>React Native & Expo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Node.js & Express</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <p className="mb-6 text-xl text-slate-700 dark:text-slate-300">
                  {t('cta.readyToExplore')}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/recipes"
                    className="rounded-lg bg-teal-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-all hover:shadow-md"
                  >
                    {t('cta.browseRecipes')}
                  </Link>
                  <Link
                    href="/account"
                    className="rounded-lg border-2 border-teal-600 px-8 py-3 text-lg font-semibold text-teal-600 transition-all hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950"
                  >
                    {t('cta.goToAccount')}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mb-6 text-xl text-slate-700 dark:text-slate-300">
                  {t('cta.joinCommunity')}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/register"
                    className="rounded-lg bg-teal-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-all hover:shadow-md"
                  >
                    {t('cta.getStarted')}
                  </Link>
                  <Link
                    href="/recipes"
                    className="rounded-lg border-2 border-teal-600 px-8 py-3 text-lg font-semibold text-teal-600 transition-all hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950"
                  >
                    {t('cta.learnMore')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
