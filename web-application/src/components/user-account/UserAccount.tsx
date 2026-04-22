'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ProfileOverview from './ProfileOverview';
import MyRecipes from './MyRecipes';
import ActivityFeed from './ActivityFeed';
import AccountSettings from './AccountSettings';
import Statistics from './Statistics';
import ProfilePictureUpload from './ProfilePictureUpload';

export interface UserAccountUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  location: string;
  bio: string;
  website: string;
  skillLevel: string;
  measurementSystem: string;
  language: string;
  profileVisibility: string;
  showEmail: boolean;
  showLocation: boolean;
  joinedDate: string;
}

interface UserAccountProps {
  user: UserAccountUser;
}

export default function UserAccount({ user }: UserAccountProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImage, setCurrentImage] = useState(user.image);
  const { update } = useSession();

  const handleImageChange = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    // Persist to the database
    await fetch('/api/user/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageUrl }),
    });
    // Update the session so the navbar avatar refreshes
    await update({ image: imageUrl });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'recipes', label: 'My Recipes', icon: '📖' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 pb-32">
        <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-300 text-4xl font-bold text-gray-600">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <ProfilePictureUpload
                currentImage={currentImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200&background=ec4899&color=fff`}
                userName={user.name}
                onImageChange={handleImageChange}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              {user.username && <p className="text-white/90">@{user.username}</p>}
              <p className="mt-2 text-sm text-white/80">
                {user.location && <>📍 {user.location} • </>}Joined {user.joinedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto -mt-24 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 overflow-x-auto rounded-2xl bg-white shadow-lg dark:bg-gray-800">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && <ProfileOverview user={user} />}
          {activeTab === 'recipes' && <MyRecipes user={user} />}
          {activeTab === 'activity' && <ActivityFeed />}
          {activeTab === 'settings' && <AccountSettings user={user} />}
          {activeTab === 'statistics' && <Statistics />}
        </div>
      </div>
    </div>
  );
}
