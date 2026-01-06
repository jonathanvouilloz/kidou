import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { BETTER_AUTH_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { sendEmail, getVerificationEmailHtml, getPasswordResetEmailHtml } from './email';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications
		}
	}),
	secret: BETTER_AUTH_SECRET,
	baseURL: PUBLIC_APP_URL,
	trustedOrigins: [PUBLIC_APP_URL],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: 'Reset your Kidou password',
				html: getPasswordResetEmailHtml(url, user.name ?? user.email)
			});
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: 'Verify your Kidou email',
				html: getVerificationEmailHtml(url, user.name ?? user.email)
			});
		}
	},
	user: {
		additionalFields: {
			username: {
				type: 'string',
				required: true,
				unique: true,
				minLength: 3,
				maxLength: 50
			},
			avatarUrl: {
				type: 'string',
				required: false
			},
			accentColor: {
				type: 'string',
				required: false,
				defaultValue: '#FFFFFF'
			}
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day
	}
});

export type Session = typeof auth.$Infer.Session;
