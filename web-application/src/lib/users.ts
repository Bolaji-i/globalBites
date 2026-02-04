import bcrypt from 'bcryptjs';

/**
 * User type definition
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

/**
 * Mock user database (in production, this would be a real database)
 * This is stored in memory - will reset on server restart
 */
export const users: User[] = [];

// Add the test user to the mock database
users.push({
  id: '1',
  name: 'Sarah Johnson',
  email: 'test@globalbites.com',
  password: bcrypt.hashSync('password123', 10),
  createdAt: new Date('2024-01-01'),
});

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Create a new user
 */
export async function createUser(name: string, email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser: User = {
    id: (users.length + 1).toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(newUser);
  return newUser;
}

/**
 * Check if user exists
 */
export function userExists(email: string): boolean {
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}
