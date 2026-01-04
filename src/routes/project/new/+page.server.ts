import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import {
	getMaxProjects,
	getMaxLlmExtractions,
	checkAndResetLlmUsage,
	type PlanType
} from '$lib/server/plan-limits';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const [userData] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, user.id));

	const userPlan = (userData?.plan ?? 'free') as PlanType;
	const maxProjects = getMaxProjects(userPlan);

	const [{ count }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(projects)
		.where(eq(projects.userId, user.id));

	const projectCount = Number(count);

	// Check LLM usage for analysis limits
	const { used: llmUsed } = await checkAndResetLlmUsage(user.id);
	const llmMax = getMaxLlmExtractions(userPlan);
	const canAnalyze = llmUsed < llmMax;

	return {
		canCreateProject: projectCount < maxProjects,
		projectCount,
		maxProjects,
		userPlan,
		canAnalyze,
		llmUsed,
		llmMax
	};
};
