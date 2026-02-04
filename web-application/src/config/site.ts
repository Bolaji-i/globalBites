/**
 * Site-wide configuration and metadata
 */
export const siteConfig = {
  name: 'globalBites',
  description: 'Discover culinary delights from around the world',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  
  links: {
    twitter: 'https://twitter.com/globalbites',
    github: 'https://github.com/yourusername/globalbites',
    instagram: 'https://instagram.com/globalbites',
  },
  
  creator: {
    name: 'GlobalBites Team',
    url: 'https://globalbites.com',
  },
  
  features: {
    authentication: true,
    userAccounts: true,
    socialLogin: true,
    emailVerification: false, // TODO: Enable when implemented
    passwordReset: false, // TODO: Enable when implemented
  },
  
  cuisines: [
    { id: 'italian', name: 'Italian', flag: '🇮🇹', emoji: '🍝' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵', emoji: '🍣' },
    { id: 'mexican', name: 'Mexican', flag: '🇲🇽', emoji: '🌮' },
    { id: 'indian', name: 'Indian', flag: '🇮🇳', emoji: '🍛' },
    { id: 'french', name: 'French', flag: '🇫🇷', emoji: '🥐' },
    { id: 'thai', name: 'Thai', flag: '🇹🇭', emoji: '🍜' },
    { id: 'chinese', name: 'Chinese', flag: '🇨🇳', emoji: '🥟' },
    { id: 'greek', name: 'Greek', flag: '🇬🇷', emoji: '🥙' },
  ],
  
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
