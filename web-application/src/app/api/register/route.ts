import { NextRequest, NextResponse } from 'next/server';
import { createUser, userExists } from '@/lib/users';

/**
 * POST /api/register
 * Create a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Please provide first name, last name, email, and password' },
        { status: 400 }
      );
    }

    // Validate name lengths
    if (firstName.trim().length < 1 || lastName.trim().length < 1) {
      return NextResponse.json(
        { error: 'Invalid name', message: 'First name and last name cannot be empty' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email', message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Weak password', message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const exists = await userExists(email);
    if (exists) {
      return NextResponse.json(
        { error: 'User exists', message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await createUser({ firstName, lastName, email, password });

    // Return success (don't send password back)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error', message: 'An error occurred while creating your account' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/register?email=xxx (for checking if email exists)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
  }

  const exists = await userExists(email);

  return NextResponse.json({ exists });
}
