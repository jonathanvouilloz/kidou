// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session } from '$lib/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			user: Session['user'] | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
