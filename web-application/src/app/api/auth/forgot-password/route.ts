import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/users';
import { sendPasswordResetEmail } from '@/lib/email';

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() }
    });

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Token expires in 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Save the token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires,
      }
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Still return success to prevent email enumeration
      // but log the error for debugging
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
