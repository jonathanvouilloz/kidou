import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { POLAR_PRODUCT_ID_PRO } from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import { polar } from '$lib/server/polar';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		throw redirect(303, '/auth/login');
	}

	const checkout = await polar.checkouts.create({
		products: [POLAR_PRODUCT_ID_PRO],
		customerEmail: event.locals.user.email,
		customerExternalId: event.locals.user.id,
		successUrl: `${PUBLIC_APP_URL}/settings?checkout=success`
	});

	throw redirect(303, checkout.url);
};
