'use client';

import { useAuth } from './useAuth';

/**
 * Custom hook to get current user information
 * Returns null if not authenticated
 */
export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    name: user?.name ?? '',
    email: user?.email ?? '',
    image: user?.image ?? null,
  };
}
