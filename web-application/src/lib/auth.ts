import { auth } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get the current session on the server side
 * Use this in Server Components and Server Actions
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated
 * Use this for authorization checks
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes or Server Actions that require auth
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized - Authentication required');
  }
  
  return session.user;
}
