import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const FROM_ADDRESS = 'Kidou <noreply@notifications.kidou.dev>';

// Lazy initialization to avoid build errors when RESEND_API_KEY is not set
let resend: Resend | null = null;

function getResend(): Resend {
	if (!resend) {
		if (!env.RESEND_API_KEY) {
			throw new Error('RESEND_API_KEY is not configured');
		}
		resend = new Resend(env.RESEND_API_KEY);
	}
	return resend;
}

interface SendEmailParams {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
	try {
		const client = getResend();
		const { data, error } = await client.emails.send({
			from: FROM_ADDRESS,
			to,
			subject,
			html,
			text: html.replace(/<[^>]*>/g, '')
		});

		if (error) {
			console.error('Failed to send email:', error);
			return { success: false, error };
		}

		return { success: true, data };
	} catch (err) {
		console.error('Email sending error:', err);
		return { success: false, error: err };
	}
}

export function getVerificationEmailHtml(url: string, username: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #0a0a0a; font-family: 'Monaco', 'Menlo', 'Consolas', monospace;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; padding: 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 24px; color: #ffffff; font-weight: 500;">kidou</span><span style="color: #00ff00;">_</span>
    </div>
    <p style="color: #888888; margin: 0 0 16px 0; font-size: 14px;">
      <span style="color: #00ff00;">$</span> verify --user ${username}
    </p>
    <p style="color: #ffffff; margin: 0 0 24px 0; font-size: 14px;">
      Click the link below to verify your email address:
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px;">
        Verify Email
      </a>
    </div>
    <p style="color: #666666; margin: 24px 0 0 0; font-size: 12px; text-align: center;">
      If you didn't create an account on Kidou, ignore this email.
    </p>
  </div>
</body>
</html>`;
}

export function getPasswordResetEmailHtml(url: string, username: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #0a0a0a; font-family: 'Monaco', 'Menlo', 'Consolas', monospace;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; padding: 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 24px; color: #ffffff; font-weight: 500;">kidou</span><span style="color: #00ff00;">_</span>
    </div>
    <p style="color: #888888; margin: 0 0 16px 0; font-size: 14px;">
      <span style="color: #00ff00;">$</span> reset-password --user ${username}
    </p>
    <p style="color: #ffffff; margin: 0 0 24px 0; font-size: 14px;">
      Click the link below to reset your password:
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px;">
        Reset Password
      </a>
    </div>
    <p style="color: #666666; margin: 24px 0 0 0; font-size: 12px; text-align: center;">
      This link expires in 1 hour. If you didn't request a password reset, ignore this email.
    </p>
  </div>
</body>
</html>`;
}

export function getDeleteAccountEmailHtml(url: string, username: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #0a0a0a; font-family: 'Monaco', 'Menlo', 'Consolas', monospace;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; padding: 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 24px; color: #ffffff; font-weight: 500;">kidou</span><span style="color: #ff4444;">_</span>
    </div>
    <p style="color: #888888; margin: 0 0 16px 0; font-size: 14px;">
      <span style="color: #ff4444;">$</span> delete-account --user ${username}
    </p>
    <p style="color: #ffffff; margin: 0 0 24px 0; font-size: 14px;">
      Click the link below to permanently delete your Kidou account:
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #ff4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px;">
        Delete My Account
      </a>
    </div>
    <p style="color: #ff6666; margin: 24px 0 0 0; font-size: 12px; text-align: center;">
      This action is irreversible. All your projects and data will be permanently deleted.
    </p>
    <p style="color: #666666; margin: 12px 0 0 0; font-size: 12px; text-align: center;">
      If you didn't request this, ignore this email and your account will remain safe.
    </p>
  </div>
</body>
</html>`;
}
