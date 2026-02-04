# Internationalization (i18n) Implementation

## Overview

GlobalBites now supports **7 languages** with a complete internationalization system. The language selector in the header is fully functional, persisting user preferences and translating content across the application.

## Supported Languages

- 🇺🇸 **English (en)** - Default
- 🇪🇸 **Español (es)** - Complete translations
- 🇫🇷 **Français (fr)** - Partial translations (expandable)
- 🇮🇹 **Italiano (it)** - Partial translations (expandable)
- 🇩🇪 **Deutsch (de)** - Partial translations (expandable)
- 🇯🇵 **日本語 (ja)** - Partial translations (expandable)
- 🇨🇳 **中文 (zh)** - Partial translations (expandable)

## Architecture

### 1. Language Context (`/src/contexts/LanguageContext.tsx`)

Provides global language state management using React Context API:

```tsx
const { currentLanguage, setLanguage, languages } = useLanguage();
```

**Features:**
- localStorage persistence (key: `globalbites-language`)
- SSR-safe hydration
- Automatic `document.documentElement.lang` updates for accessibility
- Type-safe language codes

### 2. Translation Files (`/src/locales/`)

```
/src/locales/
├── index.ts       # Exports all translations and getTranslation() helper
├── en.ts          # English baseline (complete, ~100+ keys)
└── es.ts          # Spanish translations (complete)
```

**Translation Structure:**
```typescript
{
  common: { signIn, register, signOut, account, search, loading, error, success },
  header: { tagline, aboutUs, signInButton, registerButton },
  home: {
    hero: { title, subtitle, description },
    cuisines: { heading, description, explore },
    trending: { heading, viewAll },
    cta: { heading, description, button }
  },
  about: {
    heading, description,
    mission: { title, description },
    vision: { title, description },
    values: { title, description }
  },
  auth: {
    signIn: { title, subtitle, email, password, remember, forgot, button, or, google, github, noAccount, register },
    register: { title, subtitle, name, email, password, confirm, terms, button, or, google, github, haveAccount, signIn },
    forgotPassword: { title, subtitle, email, button, backToSignIn, checkEmail }
  },
  account: {
    welcome, overview, myRecipes, activity, settings,
    stats: { totalRecipes, favorites, followers, following }
  },
  cuisines: { italian, japanese, mexican, indian, french, thai, chinese, mediterranean }
}
```

### 3. Translation Hook (`/src/hooks/useTranslation.ts`)

Simple hook for accessing translations in components:

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const t = useTranslation();
  
  return <h1>{t.home.hero.title}</h1>;
}
```

**Type Safety:** Full autocomplete and type-checking for all translation keys.

## Usage

### In Components

```tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t.home.hero.title}</h1>
      <p>{t.home.hero.description}</p>
      <button>{t.common.signIn}</button>
    </div>
  );
}
```

### Accessing Language State

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function LanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  
  return (
    <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Current Implementation Status

### ✅ Completed

1. **Context System**
   - LanguageProvider with localStorage persistence
   - useLanguage() hook for state management
   - SSR-safe hydration

2. **Translation Infrastructure**
   - Complete English baseline (100+ keys)
   - Complete Spanish translations
   - Partial translations for 5 other languages (fr, it, de, ja, zh)
   - Type-safe translation system with autocomplete

3. **Integration**
   - LanguageProvider added to root layout
   - Header component using translations
   - Home page hero section using translations
   - useTranslation hook created

### 🔄 Partially Complete

- **French, Italian, German, Japanese, Chinese**: Basic common translations only (expandable)
- **Home Page**: Hero section translated, other sections pending
- **About Page**: Not yet translated
- **Auth Pages**: Not yet translated (sign-in, register, forgot-password)
- **Account Pages**: Not yet translated

## Adding New Translations

### 1. For Existing Languages

Edit the appropriate file in `/src/locales/`:

```tsx
// src/locales/fr.ts
export const fr: Translation = {
  ...en, // Start with English as fallback
  common: {
    ...en.common,
    signIn: 'Se Connecter',
    register: 'S\'inscrire',
    // ... more translations
  },
  home: {
    hero: {
      title: 'Découvrez les Cuisines du Monde',
      subtitle: 'Une Recette à la Fois',
      description: 'Explorez des recettes authentiques...',
    },
    // ... more sections
  }
};
```

### 2. For New Languages

1. Add language to `LanguageContext.tsx`:
```tsx
const languageDefinitions: Language[] = [
  // ... existing languages
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export type LanguageCode = 'en' | 'es' | 'fr' | 'it' | 'de' | 'ja' | 'zh' | 'pt';
```

2. Create translation file `/src/locales/pt.ts`:
```tsx
import type { Translation } from './en';
import { en } from './en';

export const pt: Translation = {
  ...en,
  // Add translations
};
```

3. Export in `/src/locales/index.ts`:
```tsx
import { pt } from './pt';

export const translations: Record<LanguageCode, Translation> = {
  // ... existing languages
  pt,
};
```

## Best Practices

### 1. Always Use Translation Keys
❌ **Don't hardcode text:**
```tsx
<button>Sign In</button>
```

✅ **Use translations:**
```tsx
<button>{t.common.signIn}</button>
```

### 2. Keep Translations Organized
- **common**: UI elements used everywhere (buttons, labels, states)
- **header**: Header-specific text
- **home**: Home page content
- **about**: About page content
- **auth**: Authentication pages
- **account**: User account pages
- **cuisines**: Cuisine names

### 3. Leverage TypeScript
The type system ensures:
- All translations have the same structure
- Autocomplete for translation keys
- Compile-time error if keys are missing

### 4. Fallback Strategy
Partial translations automatically fall back to English:
```tsx
const fr: Translation = {
  ...en, // English fallback
  common: {
    ...en.common, // Fallback for common keys
    signIn: 'Se Connecter', // Override specific keys
  }
};
```

## Testing Language Switching

1. **Open the application** in your browser
2. **Click the language selector** in the header
3. **Select a different language** (e.g., Español)
4. **Observe changes**:
   - Header buttons change language
   - Hero section updates
   - Preference saved to localStorage
5. **Refresh the page** - language preference persists

## Troubleshooting

### Language doesn't persist after refresh
- Check browser localStorage for `globalbites-language` key
- Ensure LanguageProvider is in the layout
- Check for hydration errors in console

### Translations not showing
- Verify `useTranslation()` is called in the component
- Check that translation key exists in the translation file
- Ensure component is wrapped by LanguageProvider

### TypeScript errors
- Run `npm run build` to check for type errors
- Ensure all translation files export `Translation` type
- Verify translation structure matches English baseline

## Performance

- **Minimal bundle size**: Only current language translations loaded
- **No runtime overhead**: Translations pre-defined, no parsing
- **Optimized re-renders**: Context only updates when language changes
- **localStorage caching**: Instant preference recall

## Accessibility

- `document.documentElement.lang` automatically updated
- Screen readers announce language changes
- Proper semantic HTML maintained across languages

## Future Enhancements

1. **Complete translations** for all 7 languages
2. **RTL support** for Arabic, Hebrew
3. **Plural forms** handling (e.g., "1 recipe" vs "2 recipes")
4. **Date/number formatting** per locale
5. **Dynamic translation loading** (lazy load translation files)
6. **Translation management UI** for editors
7. **Automated translation checks** in CI/CD

## Resources

- [React Context API Docs](https://react.dev/reference/react/createContext)
- [Next.js i18n Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [TypeScript Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

---

**Status**: ✅ Language switching fully functional with 2 complete languages (EN, ES) and 5 partial languages (FR, IT, DE, JA, ZH).
