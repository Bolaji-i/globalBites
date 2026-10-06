'use client';

import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { Salad, Leaf, Wheat, MilkOff, Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AccountSettingsProps {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    image?: string | null;
    website?: string;
    skillLevel?: string;
    measurementSystem?: string;
    language?: string;
    profileVisibility?: string;
    showEmail?: boolean;
    showLocation?: boolean;
  };
  onUpdate?: (data: { 
    firstName: string; 
    lastName: string; 
    username: string;
    email: string; 
    bio: string; 
    location: string;
    image?: string;
  }) => void;
}

interface SettingsState {
  // Profile Settings
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  // Dietary Restrictions
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  // Preferences
  skillLevel: string;
  language: string;
  measurementSystem: string;
  // Notifications
  emailRecipeRecommendations: boolean;
  emailNewFollowers: boolean;
  emailComments: boolean;
  emailWeeklyDigest: boolean;
  pushNotifications: boolean;
  // Privacy
  profileVisibility: string;
  showEmail: boolean;
  showLocation: boolean;
  allowMessages: boolean;
}

export default function AccountSettings({ user, onUpdate }: AccountSettingsProps) {
  const t = useTranslations('account.settings');
  const tc = useTranslations('common');
  // Initial settings based on user data
  const getInitialSettings = useCallback((): SettingsState => ({
    // Profile Settings
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    location: user.location || '',

    // Dietary Restrictions
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,

    // Preferences - use saved values or defaults
    skillLevel: user.skillLevel || 'intermediate',
    language: user.language || 'en',
    measurementSystem: user.measurementSystem || 'metric',

    // Notifications
    emailRecipeRecommendations: true,
    emailNewFollowers: true,
    emailComments: true,
    emailWeeklyDigest: false,
    pushNotifications: true,

    // Privacy - use saved values or defaults
    profileVisibility: user.profileVisibility || 'public',
    showEmail: user.showEmail ?? false,
    showLocation: user.showLocation ?? true,
    allowMessages: true,
  }), [user]);

  const [settings, setSettings] = useState<SettingsState>(getInitialSettings);
  const [originalSettings, setOriginalSettings] = useState<SettingsState>(getInitialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  // Handle cancel - revert to original settings
  const handleCancel = useCallback(() => {
    setSettings(originalSettings);
    setSaveStatus('idle');
  }, [originalSettings]);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Call API to save settings to database
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: settings.firstName,
          lastName: settings.lastName,
          username: settings.username,
          email: settings.email,
          bio: settings.bio,
          location: settings.location,
          // Preferences
          skillLevel: settings.skillLevel,
          measurementSystem: settings.measurementSystem,
          language: settings.language,
          // Privacy
          profileVisibility: settings.profileVisibility,
          showEmail: settings.showEmail,
          showLocation: settings.showLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }
      
      // On success, update original settings to match current
      setOriginalSettings(settings);
      setSaveStatus('success');
      
      // Notify parent component of the update
      if (onUpdate) {
        onUpdate({
          firstName: settings.firstName,
          lastName: settings.lastName,
          username: settings.username,
          email: settings.email,
          bio: settings.bio,
          location: settings.location,
        });
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [settings, onUpdate]);

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl bg-amber-50 p-4 shadow-md dark:bg-amber-900/30">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {t('unsaved')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:text-amber-300 dark:hover:bg-amber-800/50"
            >
              {t('discard')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {isSaving ? tc('saving') : t('saveNow')}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 dark:bg-green-900/30">
          <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            {t('saved')}
          </span>
        </div>
      )}

      {/* Error Message */}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 dark:bg-red-900/30">
          <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm font-medium text-red-800 dark:text-red-200">
            {t('saveFailed')}
          </span>
        </div>
      )}

      {/* Profile Information */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('profile')}</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('firstName')}
              </label>
              <input
                type="text"
                value={settings.firstName}
                onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('lastName')}
              </label>
              <input
                type="text"
                value={settings.lastName}
                onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('username')}
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('email')}
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('location')}
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('bio')}
            </label>
            <textarea
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('dietary')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { key: 'vegetarian', label: t('vegetarian'), icon: <Salad className="h-5 w-5 text-green-500" /> },
            { key: 'vegan', label: t('vegan'), icon: <Leaf className="h-5 w-5 text-green-600" /> },
            { key: 'glutenFree', label: t('glutenFree'), icon: <Wheat className="h-5 w-5 text-amber-500" /> },
            { key: 'dairyFree', label: t('dairyFree'), icon: <MilkOff className="h-5 w-5 text-blue-400" /> },
            { key: 'nutFree', label: t('nutFree'), icon: <Ban className="h-5 w-5 text-red-400" /> },
          ] as { key: string; label: string; icon: ReactNode }[]).map((item) => (
            <label key={item.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500/20"
              />
              {item.icon}
              <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cooking Preferences */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('preferences')}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('skillLevel')}
            </label>
            <select
              value={settings.skillLevel}
              onChange={(e) => setSettings({ ...settings, skillLevel: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
              <option value="expert">{t('expert')}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('language')}
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('measurement')}
              </label>
              <select
                value={settings.measurementSystem}
                onChange={(e) => setSettings({ ...settings, measurementSystem: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="metric">{t('metric')}</option>
                <option value="imperial">{t('imperial')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('notifications')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('recommendations')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('recommendationsDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailRecipeRecommendations}
                onChange={(e) => setSettings({ ...settings, emailRecipeRecommendations: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('newFollowers')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('newFollowersDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailNewFollowers}
                onChange={(e) => setSettings({ ...settings, emailNewFollowers: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('comments')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('commentsDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailComments}
                onChange={(e) => setSettings({ ...settings, emailComments: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('digest')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('digestDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailWeeklyDigest}
                onChange={(e) => setSettings({ ...settings, emailWeeklyDigest: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('push')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('pushDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{t('privacy')}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('visibility')}
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="public">{t('visibilityPublic')}</option>
              <option value="followers">{t('visibilityFollowers')}</option>
              <option value="private">{t('visibilityPrivate')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('showEmail')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('displayOnProfile')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('showLocation')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('displayOnProfile')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.showLocation}
                onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{t('allowMessages')}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t('allowMessagesDesc')}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.allowMessages}
                onChange={(e) => setSettings({ ...settings, allowMessages: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full dark:bg-slate-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/20">
        <h2 className="mb-4 text-xl font-bold text-red-900 dark:text-red-400">{t('dangerZone')}</h2>
        <div className="space-y-3">
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-900/30">
            {t('changePassword')}
          </button>
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-900/30">
            {t('downloadData')}
          </button>
          <button className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            {t('deleteAccount')}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          disabled={!hasChanges || isSaving}
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {tc('cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isSaving ? tc('saving') : t('saveChanges')}
        </button>
      </div>
    </div>
  );
}
