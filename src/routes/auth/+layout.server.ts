import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Valide le parametre redirect pour eviter les open redirects
function isValidRedirect(url: string | null): url is string {
	if (!url) return false;
	// Doit commencer par / et ne pas contenir de protocole
	return url.startsWith('/') && !url.includes('://');
}

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const redirectParam = url.searchParams.get('redirect');

	// Si deja connecte, rediriger vers la destination ou le dashboard
	if (locals.user) {
		if (isValidRedirect(redirectParam)) {
			throw redirect(303, redirectParam);
		}
		throw redirect(303, '/dashboard');
	}

	return {
		redirectTo: isValidRedirect(redirectParam) ? redirectParam : null
	};
};
