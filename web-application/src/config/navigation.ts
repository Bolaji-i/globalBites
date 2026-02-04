/**
 * Navigation configuration for the site
 */
export const mainNav = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Account',
    href: '/account',
    requiresAuth: true,
  },
] as const;

export const footerNav = {
  main: [
    { title: 'About Us', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Terms of Service', href: '/terms' },
  ],
  cuisines: [
    { title: 'Italian', href: '/cuisines/italian' },
    { title: 'Japanese', href: '/cuisines/japanese' },
    { title: 'Mexican', href: '/cuisines/mexican' },
    { title: 'Indian', href: '/cuisines/indian' },
    { title: 'View All', href: '/cuisines' },
  ],
  account: [
    { title: 'Sign In', href: '/sign-in' },
    { title: 'Register', href: '/register' },
    { title: 'My Account', href: '/account', requiresAuth: true },
  ],
  social: [
    { title: 'Twitter', href: 'https://twitter.com/globalbites' },
    { title: 'Instagram', href: 'https://instagram.com/globalbites' },
    { title: 'Facebook', href: 'https://facebook.com/globalbites' },
    { title: 'GitHub', href: 'https://github.com/yourusername/globalbites' },
  ],
} as const;

export const accountNav = [
  {
    title: 'Overview',
    href: '/account',
    icon: 'home',
  },
  {
    title: 'My Recipes',
    href: '/account/recipes',
    icon: 'book',
  },
  {
    title: 'Activity',
    href: '/account/activity',
    icon: 'activity',
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: 'settings',
  },
  {
    title: 'Statistics',
    href: '/account/statistics',
    icon: 'chart',
  },
] as const;

export type MainNav = typeof mainNav;
export type FooterNav = typeof footerNav;
export type AccountNav = typeof accountNav;
