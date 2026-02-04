# 📁 Project Structure Guide

This document explains the organization of the GlobalBites codebase and best practices for maintaining it.

---

## 📂 Directory Overview

```
web-application/
├── docs/                          # 📚 Documentation
│   ├── AUTHENTICATION_SETUP.md   # Auth implementation guide
│   ├── DATABASE_SCHEMA.md        # Database design docs
│   └── implementation/           # Feature implementation notes
│
├── src/
│   ├── app/                      # 🛣️ Next.js App Router
│   │   ├── (auth)/              # 🔐 Auth route group (doesn't affect URLs)
│   │   │   ├── sign-in/         # /sign-in page
│   │   │   ├── register/        # /register page
│   │   │   └── forgot-password/ # /forgot-password page
│   │   │
│   │   ├── about/               # /about page
│   │   ├── account/             # /account page (protected)
│   │   ├── api/                 # API routes
│   │   │   └── auth/            # NextAuth.js API endpoints
│   │   ├── layout.tsx           # Root layout with SessionProvider
│   │   ├── page.tsx             # Home page (/)
│   │   └── globals.css          # Global styles
│   │
│   ├── components/               # 🧩 React Components
│   │   ├── authentication/      # Auth-related components
│   │   │   ├── SignIn.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   │
│   │   ├── user-account/        # Account page components
│   │   │   ├── UserAccount.tsx
│   │   │   ├── ProfileOverview.tsx
│   │   │   ├── MyRecipes.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── AccountSettings.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── Header.tsx           # Site header with auth state
│   │   ├── Home.tsx             # Home page content
│   │   ├── About.tsx            # About page content
│   │   └── SessionProvider.tsx  # NextAuth session wrapper
│   │
│   ├── lib/                      # 🔧 Utility Functions
│   │   ├── auth.ts              # Server-side auth helpers
│   │   └── utils.ts             # General utilities
│   │
│   ├── hooks/                    # 🪝 Custom React Hooks
│   │   ├── useAuth.ts           # Auth state hook
│   │   ├── useUser.ts           # User info hook
│   │   └── index.ts             # Common hooks (debounce, etc.)
│   │
│   ├── config/                   # ⚙️ Configuration
│   │   ├── site.ts              # Site metadata & settings
│   │   └── navigation.ts        # Navigation structure
│   │
│   └── types/                    # 📝 TypeScript Types
│       └── auth.ts              # Auth type definitions
│
├── public/                       # 🖼️ Static Assets
├── .env.local                    # 🔒 Environment variables (not in git)
├── .env.example                  # 📋 Environment template
├── package.json                  # 📦 Dependencies
├── tsconfig.json                 # ⚙️ TypeScript config
├── next.config.ts                # ⚙️ Next.js config
└── README.md                     # 📖 Main project readme
```

---

## 🎯 Directory Purposes

### `/src/app` - Application Routes
- **Purpose:** Next.js App Router pages and API routes
- **Convention:** Folder names become URL paths
- **Route Groups:** Use `(groupname)` for organization without affecting URLs
  - Example: `(auth)/sign-in` → URL is `/sign-in`, not `/(auth)/sign-in`

### `/src/components` - Reusable Components
- **Purpose:** React components used across multiple pages
- **Organization:**
  - Group related components in folders (e.g., `authentication/`, `user-account/`)
  - Use `index.ts` for barrel exports when needed
  - Top-level components for major sections (Header, Home, etc.)

### `/src/lib` - Server Utilities
- **Purpose:** Utility functions for server-side code
- **Files:**
  - `auth.ts` - Authentication helpers (getSession, requireAuth, etc.)
  - `utils.ts` - General utilities (formatting, validation, etc.)
- **Usage:** Import in Server Components, Server Actions, API routes

### `/src/hooks` - Client Hooks
- **Purpose:** Custom React hooks for client-side logic
- **Files:**
  - `useAuth.ts` - Access auth state in components
  - `useUser.ts` - Get current user information
  - `index.ts` - Common hooks (debounce, click outside, etc.)
- **Usage:** Import in Client Components (marked with `'use client'`)

### `/src/config` - Configuration
- **Purpose:** Centralized configuration and constants
- **Files:**
  - `site.ts` - Site metadata, features, cuisines, languages
  - `navigation.ts` - Navigation structure for header, footer, etc.
- **Benefit:** Single source of truth, easy to maintain

### `/src/types` - TypeScript Definitions
- **Purpose:** Shared TypeScript types and interfaces
- **Convention:** Organize by feature (auth.ts, recipe.ts, etc.)

### `/docs` - Documentation
- **Purpose:** Implementation guides, schemas, and notes
- **Organization:**
  - Top-level docs for major features
  - `implementation/` for detailed implementation notes

---

## 🔑 Key Patterns

### 1. **Server vs Client Components**
```tsx
// Server Component (default)
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  return <div>...</div>;
}

// Client Component (use 'use client')
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Component() {
  const { user } = useAuth();
  return <div>...</div>;
}
```

### 2. **Import Aliases**
Use `@/` prefix for imports from `src/`:
```tsx
import { useAuth } from '@/hooks/useAuth';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
```

### 3. **Component Organization**
```tsx
// Bad: All components in one folder
/src/components/SignIn.tsx
/src/components/Register.tsx
/src/components/ProfileSettings.tsx

// Good: Grouped by feature
/src/components/authentication/SignIn.tsx
/src/components/authentication/Register.tsx
/src/components/user-account/ProfileSettings.tsx
```

### 4. **Configuration Usage**
```tsx
import { siteConfig } from '@/config/site';
import { mainNav } from '@/config/navigation';

// Use config instead of hardcoding
<title>{siteConfig.name}</title>
<nav>{mainNav.map(item => ...)}</nav>
```

---

## 📏 Best Practices

### ✅ DO:
- Use route groups `(groupname)` to organize routes without affecting URLs
- Keep components small and focused (single responsibility)
- Use custom hooks for reusable client-side logic
- Put server-side utilities in `/src/lib`
- Centralize configuration in `/src/config`
- Document complex features in `/docs`
- Use TypeScript types from `/src/types`

### ❌ DON'T:
- Put documentation in the root directory (use `/docs`)
- Mix server and client code without proper boundaries
- Hardcode configuration values (use `/src/config`)
- Create duplicate folders (e.g., `/src/app/components`)
- Import client hooks in Server Components
- Import server utilities in Client Components

---

## 🚀 Quick Reference

### Adding a New Feature

1. **Create route** (if needed): `/src/app/feature/page.tsx`
2. **Create components**: `/src/components/feature/`
3. **Add utilities**: `/src/lib/feature-utils.ts`
4. **Create hooks** (if client-side): `/src/hooks/useFeature.ts`
5. **Update config**: Add to `/src/config/site.ts` or `/src/config/navigation.ts`
6. **Add types**: `/src/types/feature.ts`
7. **Document**: `/docs/FEATURE_GUIDE.md`

### Common Tasks

**Protect a route:**
```tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session) redirect('/sign-in');
  // ... protected content
}
```

**Access auth in client component:**
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Component() {
  const { user, isAuthenticated } = useAuth();
  // ... use auth state
}
```

**Add a navigation item:**
```tsx
// In /src/config/navigation.ts
export const mainNav = [
  // ... existing items
  { title: 'New Page', href: '/new-page' },
] as const;
```

---

## 📚 Related Documentation

- [Authentication Setup](/docs/AUTHENTICATION_SETUP.md)
- [Database Schema](/docs/DATABASE_SCHEMA.md)
- [Implementation Notes](/docs/implementation/)

---

## 🎉 Benefits of This Structure

1. **Scalability** - Easy to add new features without clutter
2. **Maintainability** - Clear organization makes code easy to find
3. **Type Safety** - Centralized types prevent duplication
4. **Reusability** - Hooks and utilities promote code reuse
5. **Documentation** - Organized docs folder for all guides
6. **Performance** - Clear server/client boundaries optimize bundle size

---

*Last updated: January 27, 2026*
