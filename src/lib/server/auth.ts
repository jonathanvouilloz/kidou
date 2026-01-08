import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from './db/schema';
import { users } from './db/schema';
import {
	BETTER_AUTH_SECRET,
	POLAR_ACCESS_TOKEN,
	POLAR_WEBHOOK_SECRET,
	POLAR_PRODUCT_ID_PRO
} from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import {
	sendEmail,
	getVerificationEmailHtml,
	getPasswordResetEmailHtml,
	getDeleteAccountEmailHtml
} from './email';

// Polar SDK client
const polarClient = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production'
});

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
	trustedOrigins: [PUBLIC_APP_URL, 'https://kidou.dev', 'https://www.kidou.dev'],
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
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				void sendEmail({
					to: user.email,
					subject: 'Confirm account deletion - Kidou',
					html: getDeleteAccountEmailHtml(url, user.name ?? user.email)
				});
			}
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [{ productId: POLAR_PRODUCT_ID_PRO, slug: 'pro' }],
					successUrl: '/settings?checkout=success',
					authenticatedUsersOnly: true
				}),
				portal(),
				webhooks({
					secret: POLAR_WEBHOOK_SECRET,
					onSubscriptionActive: async (payload) => {
						const customerId = payload.data.customer?.id;
						const externalId = payload.data.customer?.externalId;

						console.log('[Polar] Subscription active:', { customerId, externalId });

						if (externalId) {
							await db
								.update(users)
								.set({
									plan: 'pro',
									polarCustomerId: customerId,
									updatedAt: new Date()
								})
								.where(eq(users.id, externalId));
						}
					},
					onSubscriptionCanceled: async (payload) => {
						const externalId = payload.data.customer?.externalId;

						console.log('[Polar] Subscription canceled:', { externalId });

						if (externalId) {
							await db
								.update(users)
								.set({
									plan: 'free',
									updatedAt: new Date()
								})
								.where(eq(users.id, externalId));
						}
					},
					onSubscriptionRevoked: async (payload) => {
						const externalId = payload.data.customer?.externalId;

						console.log('[Polar] Subscription revoked:', { externalId });

						if (externalId) {
							await db
								.update(users)
								.set({
									plan: 'free',
									updatedAt: new Date()
								})
								.where(eq(users.id, externalId));
						}
					}
				})
			]
		})
	]
});

export type Session = typeof auth.$Infer.Session;
