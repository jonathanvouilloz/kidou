import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getMaxProjects, type PlanType } from '$lib/server/plan-limits';

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

	return {
		canCreateProject: projectCount < maxProjects,
		projectCount,
		maxProjects,
		userPlan
	};
};
