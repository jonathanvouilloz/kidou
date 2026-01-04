import { CustomerPortal } from '@polar-sh/sveltekit';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = CustomerPortal({
	accessToken: POLAR_ACCESS_TOKEN,
	server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
	returnUrl: `${PUBLIC_APP_URL}/settings`,
	getCustomerId: async (event) => {
		if (!event.locals.user) {
			throw redirect(303, '/auth/login');
		}

		const [userData] = await db
			.select({ polarCustomerId: users.polarCustomerId })
			.from(users)
			.where(eq(users.id, event.locals.user.id));

		if (!userData?.polarCustomerId) {
			throw error(400, 'No subscription found. Please subscribe first.');
		}

		return userData.polarCustomerId;
	}
});
