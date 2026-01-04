import { CustomerPortal } from '@polar-sh/sveltekit';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_APP_URL, PUBLIC_POLAR_SERVER } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { locals } = event;

	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const portalHandler = CustomerPortal({
		accessToken: POLAR_ACCESS_TOKEN,
		server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
		returnUrl: `${PUBLIC_APP_URL}/settings`,
		getCustomerId: () => locals.user!.id
	});

	return portalHandler(event);
};
