export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex flex-col items-center justify-center gap-8 px-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GlobalBites
            </span>
          </h1>
          <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Your gateway to discovering culinary delights from around the world
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg bg-white/50 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-lg font-semibold">
              Application Running Successfully
            </span>
          </div>
          
          <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
            <p>✓ Next.js 16 with App Router</p>
            <p>✓ TypeScript Support</p>
            <p>✓ Tailwind CSS Styling</p>
            <p>✓ Docker Configuration Ready</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Documentation
          </a>
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-blue-600 px-6 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
            href="https://github.com/Bolaji-i/globalBites"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 GitHub Repository
          </a>
        </div>
      </main>
    </div>
  );
}
