import { Polar } from '@polar-sh/sveltekit';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_POLAR_SERVER } from '$env/static/public';

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production'
});
