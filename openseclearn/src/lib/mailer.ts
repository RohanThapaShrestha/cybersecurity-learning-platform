/**
 * Email transport using Nodemailer.
 * Configured via SMTP_EMAIL and SMTP_PASSWORD env vars.
 * Falls back to console logging if not configured (dev mode).
 */

import nodemailer from 'nodemailer';

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

// Create transport only if SMTP credentials are available
const transporter = SMTP_EMAIL && SMTP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    })
  : null;

/**
 * Send a 6-digit OTP email for password reset.
 * In dev mode (no SMTP config), logs the OTP to console.
 */
export async function sendOTPEmail(
  to: string,
  otp: string
): Promise<{ success: boolean; devMode?: boolean }> {
  // Dev mode fallback — log OTP to console
  if (!transporter) {
    console.log('\n' + '='.repeat(50));
    console.log('📧 DEV MODE — OTP Email');
    console.log(`To: ${to}`);
    console.log(`OTP Code: ${otp}`);
    console.log('(Configure SMTP_EMAIL & SMTP_PASSWORD in .env.local to send real emails)');
    console.log('='.repeat(50) + '\n');
    return { success: true, devMode: true };
  }

  try {
    await transporter.sendMail({
      from: `"OpenSecLearn" <${SMTP_EMAIL}>`,
      to,
      subject: 'Password Reset — OpenSecLearn',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0e17; color: #e0e0e0; border-radius: 16px; border: 1px solid #1a2035;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #0a0e17; font-size: 24px; font-weight: bold;">◈</div>
            <h1 style="margin: 16px 0 4px; font-size: 22px; color: #ffffff;">Password Reset</h1>
            <p style="margin: 0; color: #888; font-size: 14px;">OpenSecLearn Security</p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #ccc;">
            You requested a password reset for your account. Use the OTP code below to verify your identity:
          </p>
          
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; padding: 16px 40px; background: rgba(0,255,136,0.08); border: 2px solid rgba(0,255,136,0.3); border-radius: 12px;">
              <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00ff88;">${otp}</span>
            </div>
          </div>
          
          <p style="font-size: 13px; color: #888; text-align: center;">
            This code expires in <strong style="color: #ff6b6b;">10 minutes</strong>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #1a2035; margin: 24px 0;" />
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            If you didn't request this, you can safely ignore this email.<br/>
            Your password will not be changed.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return { success: false };
  }
}
