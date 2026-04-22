'use client';

import { useState, useCallback, useMemo } from 'react';

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
              You have unsaved changes
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:text-amber-300 dark:hover:bg-amber-800/50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Now'}
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
            Settings saved successfully!
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
            Failed to save settings. Please try again.
          </span>
        </div>
      )}

      {/* Profile Information */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                value={settings.firstName}
                onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                value={settings.lastName}
                onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Dietary Restrictions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
            { key: 'vegan', label: 'Vegan', icon: '🌱' },
            { key: 'glutenFree', label: 'Gluten-Free', icon: '🌾' },
            { key: 'dairyFree', label: 'Dairy-Free', icon: '🥛' },
            { key: 'nutFree', label: 'Nut-Free', icon: '🥜' },
          ].map((item) => (
            <label key={item.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-2 focus:ring-pink-500/20"
              />
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cooking Preferences */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Cooking Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Skill Level
            </label>
            <select
              value={settings.skillLevel}
              onChange={(e) => setSettings({ ...settings, skillLevel: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Measurement System
              </label>
              <select
                value={settings.measurementSystem}
                onChange={(e) => setSettings({ ...settings, measurementSystem: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="metric">Metric (kg, L, °C)</option>
                <option value="imperial">Imperial (lb, gal, °F)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Recipe Recommendations</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Get personalized recipe suggestions</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailRecipeRecommendations}
                onChange={(e) => setSettings({ ...settings, emailRecipeRecommendations: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">New Followers</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">When someone follows you</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailNewFollowers}
                onChange={(e) => setSettings({ ...settings, emailNewFollowers: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Comments & Replies</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Activity on your recipes</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailComments}
                onChange={(e) => setSettings({ ...settings, emailComments: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Weekly Digest</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Summary of your week</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.emailWeeklyDigest}
                onChange={(e) => setSettings({ ...settings, emailWeeklyDigest: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications on your device</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Privacy & Security</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="public">Public - Anyone can see</option>
              <option value="followers">Followers Only</option>
              <option value="private">Private - Only me</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Show Email Address</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Display on your profile</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Show Location</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Display on your profile</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.showLocation}
                onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Allow Direct Messages</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Let others message you</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.allowMessages}
                onChange={(e) => setSettings({ ...settings, allowMessages: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full dark:bg-gray-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/20">
        <h2 className="mb-4 text-xl font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
        <div className="space-y-3">
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30">
            Change Password
          </button>
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30">
            Download My Data
          </button>
          <button className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          disabled={!hasChanges || isSaving}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:via-rose-600 hover:to-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
