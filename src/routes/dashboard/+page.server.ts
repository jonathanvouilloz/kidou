import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users, milestones } from '$lib/server/db/schema';
import { eq, sql, inArray, asc } from 'drizzle-orm';
import { getMaxProjects, type PlanType } from '$lib/server/plan-limits';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Get user plan
	const [userData] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, user.id));

	const userPlan = (userData?.plan ?? 'free') as PlanType;
	const maxProjects = getMaxProjects(userPlan);

	// Load projects first
	const userProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			isCompleted: projects.isCompleted,
			createdAt: projects.createdAt
		})
		.from(projects)
		.where(eq(projects.userId, user.id))
		.orderBy(projects.createdAt);

	// Batch load milestones for all projects (avoid N subqueries)
	const projectIds = userProjects.map((p) => p.id);
	const allMilestones =
		projectIds.length > 0
			? await db
					.select({
						projectId: milestones.projectId,
						isCompleted: milestones.isCompleted
					})
					.from(milestones)
					.where(inArray(milestones.projectId, projectIds))
			: [];

	// Count milestones per project in application layer
	const milestoneCounts = new Map<string, { total: number; completed: number }>();
	for (const m of allMilestones) {
		const counts = milestoneCounts.get(m.projectId) ?? { total: 0, completed: 0 };
		counts.total++;
		if (m.isCompleted) counts.completed++;
		milestoneCounts.set(m.projectId, counts);
	}

	const projectsWithProgress = userProjects.map((p) => {
		const counts = milestoneCounts.get(p.id) ?? { total: 0, completed: 0 };
		return {
			...p,
			totalMilestones: counts.total,
			completedMilestones: counts.completed,
			progress: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0
		};
	});

	return {
		projects: projectsWithProgress,
		projectCount: userProjects.length,
		maxProjects,
		canCreateProject: userProjects.length < maxProjects,
		userPlan
	};
};
