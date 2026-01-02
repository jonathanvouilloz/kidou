import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { BETTER_AUTH_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';

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
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
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
