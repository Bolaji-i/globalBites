import { en, type Translation } from './en';
import { es } from './es';
import type { LanguageCode } from '@/contexts/LanguageContext';

// Simplified translations for other languages (you can expand these later)
const fr: Translation = {
  ...en,
  common: {
    ...en.common,
    signIn: 'Se Connecter',
    register: 'S\'inscrire',
    signOut: 'Se Déconnecter',
    account: 'Compte',
    myAccount: 'Mon Compte',
    about: 'À Propos',
    home: 'Accueil',
  },
  header: {
    ...en.header,
    aboutUs: 'À Propos de Nous',
    signInButton: 'Se Connecter',
    registerButton: 'S\'inscrire',
  },
};

const it: Translation = {
  ...en,
  common: {
    ...en.common,
    signIn: 'Accedi',
    register: 'Registrati',
    signOut: 'Esci',
    account: 'Account',
    myAccount: 'Il Mio Account',
    about: 'Chi Siamo',
    home: 'Home',
  },
  header: {
    ...en.header,
    aboutUs: 'Chi Siamo',
    signInButton: 'Accedi',
    registerButton: 'Registrati',
  },
};

const de: Translation = {
  ...en,
  common: {
    ...en.common,
    signIn: 'Anmelden',
    register: 'Registrieren',
    signOut: 'Abmelden',
    account: 'Konto',
    myAccount: 'Mein Konto',
    about: 'Über Uns',
    home: 'Startseite',
  },
  header: {
    ...en.header,
    aboutUs: 'Über Uns',
    signInButton: 'Anmelden',
    registerButton: 'Registrieren',
  },
};

const ja: Translation = {
  ...en,
  common: {
    ...en.common,
    signIn: 'ログイン',
    register: '登録',
    signOut: 'ログアウト',
    account: 'アカウント',
    myAccount: 'マイアカウント',
    about: '私たちについて',
    home: 'ホーム',
  },
  header: {
    ...en.header,
    aboutUs: '私たちについて',
    signInButton: 'ログイン',
    registerButton: '登録',
  },
};

const zh: Translation = {
  ...en,
  common: {
    ...en.common,
    signIn: '登录',
    register: '注册',
    signOut: '退出',
    account: '账户',
    myAccount: '我的账户',
    about: '关于我们',
    home: '主页',
  },
  header: {
    ...en.header,
    aboutUs: '关于我们',
    signInButton: '登录',
    registerButton: '注册',
  },
};

export const translations: Record<LanguageCode, Translation> = {
  en,
  es,
  fr,
  it,
  de,
  ja,
  zh,
};

export function getTranslation(lang: LanguageCode) {
  return translations[lang] || translations.en;
}
