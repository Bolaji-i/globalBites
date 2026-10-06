'use client';

import { Button, Eyebrow } from '@/components/ui';

const offerings = [
  {
    title: 'Recipe discovery',
    body: 'Explore authentic recipes from cultures and cuisines across the world, written by the people who cook them.',
  },
  {
    title: 'Seven languages',
    body: 'Read recipes in the language you think in. Cooking instructions should never be the hard part.',
  },
  {
    title: 'Community kitchen',
    body: 'Share the dishes you grew up with, and find the ones other people did.',
  },
  {
    title: 'Anywhere you cook',
    body: 'Built for the phone propped against the flour bag as much as the laptop on the counter.',
  },
];

export default function About() {
  return (
    <div className="bg-paper-50 dark:bg-paper-950">
      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 lg:px-8 lg:pt-28">
        <div className="max-w-3xl">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-paper-900 sm:text-6xl dark:text-paper-50">
            Every recipe has a place it came from.
          </h1>
          <p className="mt-8 font-display text-xl leading-relaxed text-paper-600 dark:text-paper-300">
            globalBites connects people who cook with the traditions behind the food.
            We are building an archive of authentic recipes — written by the people
            who make them, in the languages they make them in.
          </p>
        </div>
      </section>

      {/* Mission — two-column editorial spread */}
      <section className="border-t border-paper-200 dark:border-paper-800">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>Our mission</Eyebrow>
            </div>
            <div className="lg:col-span-8">
              <p className="font-display text-2xl leading-relaxed text-paper-900 dark:text-paper-100">
                We break down the distance between a dish and the place it belongs to,
                and bring the world&rsquo;s flavours within reach of anyone with a kitchen.
              </p>
              <p className="mt-6 font-display text-lg leading-relaxed text-paper-600 dark:text-paper-300">
                Most recipe sites flatten regional cooking into a search result.
                We would rather keep the context: who cooks this, where, and why it
                is made the way it is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer — numbered index */}
      <section className="border-t border-paper-200 dark:border-paper-800">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>What we offer</Eyebrow>
            </div>
            <ol className="lg:col-span-8">
              {offerings.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-paper-200 py-7 first:border-t dark:border-paper-800"
                >
                  <span className="font-sans text-sm tabular-nums text-paper-400 dark:text-paper-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-paper-900 dark:text-paper-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-display leading-relaxed text-paper-600 dark:text-paper-300">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Vision — pull quote */}
      <section className="border-t border-paper-200 dark:border-paper-800">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <blockquote className="text-center">
            <p className="font-display text-3xl leading-[1.3] text-paper-900 sm:text-4xl dark:text-paper-50">
              &ldquo;A world where anyone can cook an unfamiliar dish with
              confidence — and understand where it came from.&rdquo;
            </p>
            <footer className="mt-8">
              <Eyebrow>Our vision</Eyebrow>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Colophon */}
      <section className="border-t border-paper-200 dark:border-paper-800">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>Colophon</Eyebrow>
            </div>
            <div className="lg:col-span-8">
              <p className="font-display text-lg leading-relaxed text-paper-600 dark:text-paper-300">
                Built with Next.js and React, typeset in Fraunces and Inter,
                with data in PostgreSQL via Prisma.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/register" size="lg">
                  Create an account
                </Button>
                <Button href="/recipes" variant="secondary" size="lg">
                  Browse recipes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
