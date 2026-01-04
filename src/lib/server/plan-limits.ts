import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const PLAN_LIMITS = {
	free: {
		maxProjects: 3,
		maxLlmExtractions: 1
	},
	pro: {
		maxProjects: 5,
		maxLlmExtractions: 50
	}
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getMaxProjects(plan: PlanType): number {
	return PLAN_LIMITS[plan].maxProjects;
}

export function getMaxLlmExtractions(plan: PlanType): number {
	return PLAN_LIMITS[plan].maxLlmExtractions;
}

export async function checkAndResetLlmUsage(userId: string): Promise<{
	used: number;
	resetAt: Date;
	wasReset: boolean;
}> {
	const [user] = await db
		.select({
			llmExtractionsUsed: users.llmExtractionsUsed,
			llmExtractionsResetAt: users.llmExtractionsResetAt
		})
		.from(users)
		.where(eq(users.id, userId));

	if (!user) {
		throw new Error('User not found');
	}

	const now = new Date();
	const resetAt = new Date(user.llmExtractionsResetAt);

	// Check if a day has passed since last reset (24 hours)
	const hoursSinceReset = (now.getTime() - resetAt.getTime()) / (1000 * 60 * 60);

	if (hoursSinceReset >= 24) {
		// Reset the counter
		const newResetAt = new Date();
		await db
			.update(users)
			.set({
				llmExtractionsUsed: 0,
				llmExtractionsResetAt: newResetAt
			})
			.where(eq(users.id, userId));

		return { used: 0, resetAt: newResetAt, wasReset: true };
	}

	return { used: user.llmExtractionsUsed, resetAt, wasReset: false };
}

export async function incrementLlmUsage(userId: string): Promise<void> {
	await db
		.update(users)
		.set({
			llmExtractionsUsed: sql`${users.llmExtractionsUsed} + 1`
		})
		.where(eq(users.id, userId));
}

export async function getUserPlan(userId: string): Promise<PlanType> {
	const [user] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId));

	if (!user) {
		throw new Error('User not found');
	}

	return user.plan;
}
