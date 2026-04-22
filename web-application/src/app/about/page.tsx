import Link from 'next/link';
import Header from '@/components/Header';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function AboutPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen">
      <Header />
      
      <section 
        className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              About{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
                globalBites
              </span>
            </h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Mission Statement */}
            <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">🌍</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                <strong>globalBites</strong> is a revolutionary platform that connects food enthusiasts 
                with authentic culinary experiences from around the world. We break down geographical 
                barriers and bring the world's flavors to your fingertips.
              </p>
            </div>

            {/* What We Offer */}
            <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">✨</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What We Offer</h2>
              </div>
              <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-500">🍽️</span>
                  <span><strong>Recipe Discovery:</strong> Explore thousands of authentic recipes from diverse cultures and cuisines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-500">🌐</span>
                  <span><strong>Multi-Language Support:</strong> Access content in your preferred language, making cooking accessible to everyone</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-500">👨‍🍳</span>
                  <span><strong>Community Sharing:</strong> Share your own recipes and connect with fellow food lovers worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-pink-500">📱</span>
                  <span><strong>Cross-Platform Experience:</strong> Seamlessly access recipes on web and mobile devices</span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">🎯</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                We envision a world where anyone can cook authentic international dishes with confidence. 
                By democratizing access to global cuisines, we aim to foster cultural understanding and 
                appreciation through the universal language of food. Whether you're a beginner or a 
                seasoned chef, <strong>globalBites</strong> empowers you to explore, create, and share 
                culinary masterpieces from every corner of the globe.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">⚡</span>
                <h2 className="text-2xl font-bold">Built With Modern Technology</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Next.js 16 & React 19</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>React Native & Expo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Node.js & Express</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              {isAuthenticated ? (
                <>
                  <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
                    Ready to explore? Pick up where you left off.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/recipes"
                      className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
                    >
                      Browse Recipes
                    </Link>
                    <Link
                      href="/account"
                      className="rounded-lg border-2 border-pink-500 px-8 py-3 text-lg font-semibold text-pink-600 transition-all hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950"
                    >
                      Go to Account
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
                    Join our growing community of food enthusiasts!
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link
                      href="/register"
                      className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/recipes"
                      className="rounded-lg border-2 border-pink-500 px-8 py-3 text-lg font-semibold text-pink-600 transition-all hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-950"
                    >
                      Learn More
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
