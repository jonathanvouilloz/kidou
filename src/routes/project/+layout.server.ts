import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Autoriser l'acces non authentifie a /project/new pour le delayed registration
	if (url.pathname === '/project/new') {
		return {
			user: locals.user ?? null
		};
	}

	// Toutes les autres routes /project/* requierent l'authentification
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	return {
		user: locals.user
	};
};
