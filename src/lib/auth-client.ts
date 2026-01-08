import { createAuthClient } from 'better-auth/svelte';
import { polarClient } from '@polar-sh/better-auth/client';
import { PUBLIC_APP_URL } from '$env/static/public';

export const authClient = createAuthClient({
	baseURL: PUBLIC_APP_URL,
	plugins: [polarClient()]
});

export const {
	signIn,
	signUp,
	signOut,
	useSession,
	forgetPassword,
	resetPassword,
	sendVerificationEmail,
	changePassword,
	deleteUser
} = authClient;
