import { Checkout } from '@polar-sh/sveltekit';
import { POLAR_ACCESS_TOKEN, POLAR_PRODUCT_ID_PRO } from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { locals } = event;

	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	// Build checkout URL with query params
	const checkoutHandler = Checkout({
		accessToken: POLAR_ACCESS_TOKEN,
		successUrl: `${PUBLIC_APP_URL}/settings?checkout=success`,
		server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production'
	});

	// Add product and customer info via URL
	const url = new URL(event.request.url);
	url.searchParams.set('products', POLAR_PRODUCT_ID_PRO);
	url.searchParams.set('customerEmail', locals.user.email);
	url.searchParams.set('customerExternalId', locals.user.id);

	// Create new request with updated URL
	const newRequest = new Request(url.toString(), event.request);
	const newEvent = { ...event, request: newRequest };

	return checkoutHandler(newEvent);
};
