import { writable } from 'svelte/store';

export type ClientUser = {
	id: string;
	email: string;
	username: string;
	avatarUrl: string | null;
	accentColor: string;
} | null;

export const user = writable<ClientUser>(null);

export function setUser(userData: ClientUser) {
	user.set(userData);
}
