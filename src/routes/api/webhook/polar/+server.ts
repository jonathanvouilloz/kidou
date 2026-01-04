import { Webhooks } from '@polar-sh/sveltekit';
import { POLAR_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = Webhooks({
	webhookSecret: POLAR_WEBHOOK_SECRET,

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
});
