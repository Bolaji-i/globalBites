import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/users';

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find the token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expires) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      });

      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/reset-password
 * Validate reset token
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', valid: false },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid reset link'
      });
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json({
        valid: false,
        error: 'Reset link has expired'
      });
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email
    });

  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token', valid: false },
      { status: 500 }
    );
  }
}
