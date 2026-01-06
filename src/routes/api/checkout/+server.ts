import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { POLAR_PRODUCT_ID_PRO } from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import { polar } from '$lib/server/polar';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		throw redirect(303, '/auth/login');
	}

	// Validate environment variables
	if (!POLAR_PRODUCT_ID_PRO) {
		console.error('[Checkout] Missing POLAR_PRODUCT_ID_PRO');
		throw error(500, 'Payment system not configured');
	}

	try {
		console.log(`[Checkout] Creating checkout for user ${event.locals.user.id}, server: ${PUBLIC_POLAR_SERVER}`);

		const checkout = await polar.checkouts.create({
			products: [POLAR_PRODUCT_ID_PRO],
			customerEmail: event.locals.user.email,
			customerExternalId: event.locals.user.id,
			successUrl: `${PUBLIC_APP_URL}/settings?checkout=success`
		});

		console.log(`[Checkout] Success, redirecting to ${checkout.url}`);
		throw redirect(303, checkout.url);
	} catch (err) {
		// Re-throw redirects
		if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
			throw err;
		}

		console.error('[Checkout] Polar API error:', err);

		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Checkout failed: ${message}`);
	}
};
