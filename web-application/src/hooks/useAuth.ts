'use client';

import { useSession } from 'next-auth/react';

/**
 * Custom hook to access authentication state
 * Only use in Client Components
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    session,
  };
}
