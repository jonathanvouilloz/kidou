import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import {
	checkAndResetLlmUsage,
	getMaxLlmExtractions,
	type PlanType
} from '$lib/server/plan-limits';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();

	const [userData] = await db
		.select({
			username: users.username,
			avatarUrl: users.avatarUrl,
			accentColor: users.accentColor,
			plan: users.plan,
			llmExtractionsUsed: users.llmExtractionsUsed,
			llmExtractionsResetAt: users.llmExtractionsResetAt
		})
		.from(users)
		.where(eq(users.id, user.id));

	const { used, resetAt } = await checkAndResetLlmUsage(user.id);
	const maxExtractions = getMaxLlmExtractions(userData.plan as PlanType);

	return {
		profile: {
			username: userData.username,
			avatarUrl: userData.avatarUrl,
			accentColor: userData.accentColor
		},
		subscription: {
			plan: userData.plan as PlanType,
			llmExtractionsUsed: used,
			llmExtractionsMax: maxExtractions === Infinity ? null : maxExtractions,
			llmExtractionsResetAt: resetAt
		},
		checkoutSuccess: url.searchParams.get('checkout') === 'success'
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Non autorise' });
		}

		const formData = await request.formData();
		const username = formData.get('username') as string;
		const avatarUrl = formData.get('avatarUrl') as string;
		const accentColor = formData.get('accentColor') as string;

		// Validate username
		if (!username || username.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters' });
		}

		if (username.length > 50) {
			return fail(400, { error: 'Username must be at most 50 characters' });
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			return fail(400, { error: 'Username can only contain letters, numbers, _ and -' });
		}

		// Check username availability
		const existing = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (existing.length > 0 && existing[0].id !== locals.user.id) {
			return fail(400, { error: 'Username already taken' });
		}

		// Validate accent color
		if (accentColor && !/^#[0-9A-Fa-f]{6}$/.test(accentColor)) {
			return fail(400, { error: 'Invalid color format' });
		}

		// Validate avatar URL
		if (avatarUrl && avatarUrl.trim()) {
			try {
				new URL(avatarUrl);
			} catch {
				return fail(400, { error: 'Invalid avatar URL' });
			}
		}

		await db
			.update(users)
			.set({
				username,
				avatarUrl: avatarUrl?.trim() || null,
				accentColor: accentColor || '#FFFFFF',
				updatedAt: new Date()
			})
			.where(eq(users.id, locals.user.id));

		return { success: true };
	}
};
