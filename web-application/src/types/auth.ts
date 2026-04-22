import { DefaultSession } from 'next-auth';

// Extend the default Session type to include user ID
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

// Extend the default JWT type
declare module 'next-auth' {
  interface JWT {
    id: string;
  }
}

// User type for the application
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
