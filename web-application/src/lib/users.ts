import bcrypt from 'bcryptjs';
import prisma from './prisma';

// Re-export prisma for use in other files
export { prisma };

/**
 * User type definition (matches Prisma schema)
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  password: string | null;
  image?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  skillLevel?: string | null;
  measurementSystem?: string | null;
  language?: string | null;
  profileVisibility?: string | null;
  showEmail: boolean;
  showLocation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User data for creating a new user
 */
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * User data for updating an existing user
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  skillLevel?: string;
  measurementSystem?: string;
  language?: string;
  profileVisibility?: string;
  showEmail?: boolean;
  showLocation?: boolean;
}

/**
 * Helper to get full name from user
 */
export function getFullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
    },
  });

  return newUser;
}

/**
 * Update user profile
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      email: data.email?.toLowerCase().trim(),
    },
  });

  return updatedUser;
}

/**
 * Update user password
 */
export async function updateUserPassword(id: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

/**
 * Check if user exists by email
 */
export async function userExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  return !!user;
}

/**
 * Delete user account
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}

/**
 * Verify user password
 */
export async function verifyPassword(user: User, password: string): Promise<boolean> {
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(password, user.password);
}

