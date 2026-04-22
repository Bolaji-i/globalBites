'use client';

import { useTranslations } from 'next-intl';

// Re-export useTranslations from next-intl for easy migration
export { useTranslations };

// Backward compatible hook that returns the full translation object structure
export function useTranslation() {
  const common = useTranslations('common');
  const header = useTranslations('header');
  const home = useTranslations('home');
  const about = useTranslations('about');
  const auth = useTranslations('auth');
  const account = useTranslations('account');
  const cuisines = useTranslations('cuisines');

  return {
    common: {
      signIn: common('signIn'),
      register: common('register'),
      signOut: common('signOut'),
      account: common('account'),
      myAccount: common('myAccount'),
      about: common('about'),
      home: common('home'),
      search: common('search'),
      loading: common('loading'),
      error: common('error'),
      success: common('success'),
    },
    header: {
      tagline: header('tagline'),
      aboutUs: header('aboutUs'),
      recipes: header('recipes'),
      signInButton: header('signInButton'),
      registerButton: header('registerButton'),
    },
    home: {
      hero: {
        title: home('hero.title'),
        subtitle: home('hero.subtitle'),
        description: home('hero.description'),
        searchPlaceholder: home('hero.searchPlaceholder'),
        searchButton: home('hero.searchButton'),
      },
      cuisines: {
        title: home('cuisines.title'),
        subtitle: home('cuisines.subtitle'),
        viewRecipes: home('cuisines.viewRecipes'),
      },
      trending: {
        title: home('trending.title'),
        subtitle: home('trending.subtitle'),
        mins: home('trending.mins'),
        servings: home('trending.servings'),
      },
      cta: {
        title: home('cta.title'),
        subtitle: home('cta.subtitle'),
        button: home('cta.button'),
      },
    },
    about: {
      title: about('title'),
      subtitle: about('subtitle'),
      mission: {
        title: about('mission.title'),
        description: about('mission.description'),
      },
      vision: {
        title: about('vision.title'),
        description: about('vision.description'),
      },
      values: {
        title: about('values.title'),
        authenticity: about('values.authenticity'),
        authenticityDesc: about('values.authenticityDesc'),
        community: about('values.community'),
        communityDesc: about('values.communityDesc'),
        discovery: about('values.discovery'),
        discoveryDesc: about('values.discoveryDesc'),
      },
    },
    auth: {
      signIn: {
        title: auth('signIn.title'),
        subtitle: auth('signIn.subtitle'),
        email: auth('signIn.email'),
        emailPlaceholder: auth('signIn.emailPlaceholder'),
        password: auth('signIn.password'),
        passwordPlaceholder: auth('signIn.passwordPlaceholder'),
        rememberMe: auth('signIn.rememberMe'),
        forgotPassword: auth('signIn.forgotPassword'),
        signInButton: auth('signIn.signInButton'),
        signingIn: auth('signIn.signingIn'),
        orContinueWith: auth('signIn.orContinueWith'),
        noAccount: auth('signIn.noAccount'),
        signUpLink: auth('signIn.signUpLink'),
        invalidCredentials: auth('signIn.invalidCredentials'),
      },
      register: {
        title: auth('register.title'),
        subtitle: auth('register.subtitle'),
        fullName: auth('register.fullName'),
        fullNamePlaceholder: auth('register.fullNamePlaceholder'),
        email: auth('register.email'),
        emailPlaceholder: auth('register.emailPlaceholder'),
        password: auth('register.password'),
        passwordPlaceholder: auth('register.passwordPlaceholder'),
        confirmPassword: auth('register.confirmPassword'),
        confirmPasswordPlaceholder: auth('register.confirmPasswordPlaceholder'),
        agreeToTerms: auth('register.agreeToTerms'),
        termsOfService: auth('register.termsOfService'),
        and: auth('register.and'),
        privacyPolicy: auth('register.privacyPolicy'),
        registerButton: auth('register.registerButton'),
        creating: auth('register.creating'),
        haveAccount: auth('register.haveAccount'),
        signInLink: auth('register.signInLink'),
      },
      forgotPassword: {
        title: auth('forgotPassword.title'),
        subtitle: auth('forgotPassword.subtitle'),
        email: auth('forgotPassword.email'),
        emailPlaceholder: auth('forgotPassword.emailPlaceholder'),
        sendButton: auth('forgotPassword.sendButton'),
        sending: auth('forgotPassword.sending'),
        backToSignIn: auth('forgotPassword.backToSignIn'),
        checkEmail: auth('forgotPassword.checkEmail'),
      },
    },
    account: {
      welcome: account('welcome'),
      tabs: {
        overview: account('tabs.overview'),
        myRecipes: account('tabs.myRecipes'),
        activity: account('tabs.activity'),
        settings: account('tabs.settings'),
        statistics: account('tabs.statistics'),
      },
      recipes: account('recipes'),
      followers: account('followers'),
      following: account('following'),
    },
    cuisines: {
      italian: cuisines('italian'),
      japanese: cuisines('japanese'),
      mexican: cuisines('mexican'),
      indian: cuisines('indian'),
      french: cuisines('french'),
      thai: cuisines('thai'),
      chinese: cuisines('chinese'),
      greek: cuisines('greek'),
    },
  };
}
