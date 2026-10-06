import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { findUserByEmail, verifyPassword } from '@/lib/users';

export const authConfig: NextAuthConfig = {
  // Use Prisma adapter for database sessions and OAuth accounts
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Google OAuth Provider (only if credentials are configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),

    // GitHub OAuth Provider (only if credentials are configured)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })]
      : []),

    // Email/Password Provider
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in database
        const user = await findUserByEmail(credentials.email as string);

        if (user && user.password) {
          const isPasswordValid = await verifyPassword(user, credentials.password as string);

          if (isPasswordValid) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              // No image: uploaded pictures are base64 data URLs, far too
              // large for the session cookie. Pages read it from the database.
            };
          }
        }

        return null;
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }

      // Handle session updates (e.g., a changed display name)
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }

      // The token is stored in a cookie, so an inline image must never ride
      // along in it. This also shrinks tokens issued before this guard existed.
      delete token.image;
      if (typeof token.picture === 'string' && token.picture.startsWith('data:')) {
        delete token.picture;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add user data to session
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      
      return session;
    },
  },

  // Session configuration - use JWT for credentials provider compatibility
  session: {
    strategy: 'jwt' as const,
  },

  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
};

// Create NextAuth handler with destructuring
const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export auth helpers for server components
export { auth, signIn, signOut };

// Export handlers for API routes
export const GET = handlers.GET;
export const POST = handlers.POST;
