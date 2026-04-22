import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'GlobalBites <noreply@globalbites.com>';
const APP_NAME = 'GlobalBites';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const subject = `Reset your ${APP_NAME} password`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%); border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">🍽️ ${APP_NAME}</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #18181b;">Reset Your Password</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #52525b;">
                      We received a request to reset your password for your ${APP_NAME} account. Click the button below to create a new password:
                    </p>
                    
                    <!-- Button -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%); text-decoration: none; border-radius: 8px; box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                      This link will expire in <strong>1 hour</strong> for security reasons.
                    </p>
                    
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                    
                    <!-- Link fallback -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #f4f4f5; border-radius: 8px;">
                      <p style="margin: 0 0 10px; font-size: 12px; color: #71717a;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0; font-size: 12px; word-break: break-all; color: #ec4899;">
                        ${resetUrl}
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0; font-size: 12px; color: #a1a1aa;">
                      Discover and share recipes from around the world.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Reset Your ${APP_NAME} Password

We received a request to reset your password for your ${APP_NAME} account.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
  `.trim();

  return sendEmail({ to: email, subject, html, text });
}
