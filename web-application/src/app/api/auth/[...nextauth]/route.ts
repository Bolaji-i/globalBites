import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/users';

export const authConfig: NextAuthConfig = {
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    
    // GitHub OAuth Provider
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    
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

        // Find user in shared user database
        const user = findUserByEmail(credentials.email as string);

        if (user) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          
          if (isPasswordValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
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
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add user ID to session
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      
      return session;
    },
  },

  // Session configuration
  session: {
    strategy: 'jwt' as const, // Use JWT for sessions (no database required initially)
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
