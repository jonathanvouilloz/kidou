import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
	message: string;
	type: ToastType;
	visible: boolean;
}

export const toast = writable<ToastState>({ message: '', type: 'info', visible: false });

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
	// Clear previous timeout
	if (timeoutId) {
		clearTimeout(timeoutId);
	}

	toast.set({ message, type, visible: true });

	timeoutId = setTimeout(() => {
		toast.update((t) => ({ ...t, visible: false }));
		timeoutId = null;
	}, duration);
}

export function hideToast() {
	if (timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
	toast.update((t) => ({ ...t, visible: false }));
}
