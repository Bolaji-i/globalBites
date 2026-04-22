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
              image: user.image,
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
        token.image = user.image;
      }
      
      // Handle session updates (e.g., profile picture change)
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add user data to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
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
