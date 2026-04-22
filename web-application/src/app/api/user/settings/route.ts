import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { updateUser, findUserById } from '@/lib/users';
import prisma from '@/lib/prisma';

/**
 * GET /api/user/settings
 * Get current user's settings
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view settings' },
        { status: 401 }
      );
    }

    const user = await findUserById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not found', message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      image: user.image,
      bio: user.bio,
      location: user.location,
      website: user.website,
      skillLevel: user.skillLevel,
      measurementSystem: user.measurementSystem,
      language: user.language,
      profileVisibility: user.profileVisibility,
      showEmail: user.showEmail,
      showLocation: user.showLocation,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Server error', message: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/settings
 * Update current user's settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to update settings' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      username,
      email, 
      bio, 
      location, 
      image,
      website,
      skillLevel,
      measurementSystem,
      language,
      profileVisibility,
      showEmail,
      showLocation,
    } = body;

    // Validate required fields
    if (firstName !== undefined && !firstName.trim()) {
      return NextResponse.json(
        { error: 'Validation error', message: 'First name cannot be empty' },
        { status: 400 }
      );
    }

    if (lastName !== undefined && !lastName.trim()) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Last name cannot be empty' },
        { status: 400 }
      );
    }

    // Validate username format and uniqueness if provided
    if (username !== undefined && username.trim()) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' },
          { status: 400 }
        );
      }
      
      // Check if username is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      });
      
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Build update data (only include fields that were provided)
    const updateData: Record<string, string | boolean | null | undefined> = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (username !== undefined) updateData.username = username ? username.toLowerCase().trim() : null;
    if (email !== undefined) updateData.email = email.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (image !== undefined) updateData.image = image;
    if (website !== undefined) updateData.website = website;
    if (skillLevel !== undefined) updateData.skillLevel = skillLevel;
    if (measurementSystem !== undefined) updateData.measurementSystem = measurementSystem;
    if (language !== undefined) updateData.language = language;
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (showEmail !== undefined) updateData.showEmail = showEmail;
    if (showLocation !== undefined) updateData.showLocation = showLocation;

    // Update user in database
    const updatedUser = await updateUser(session.user.id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        skillLevel: updatedUser.skillLevel,
        measurementSystem: updatedUser.measurementSystem,
        language: updatedUser.language,
        profileVisibility: updatedUser.profileVisibility,
        showEmail: updatedUser.showEmail,
        showLocation: updatedUser.showLocation,
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Server error', message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
