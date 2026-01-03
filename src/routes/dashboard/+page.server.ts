import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

const MAX_PROJECTS = 3;

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const userProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			isCompleted: projects.isCompleted,
			createdAt: projects.createdAt,
			totalMilestones: sql<number>`(
				SELECT COUNT(*) FROM milestones
				WHERE milestones.project_id = projects.id
			)`,
			completedMilestones: sql<number>`(
				SELECT COUNT(*) FROM milestones
				WHERE milestones.project_id = projects.id
				AND milestones.is_completed = true
			)`
		})
		.from(projects)
		.where(eq(projects.userId, user.id))
		.orderBy(projects.createdAt);

	const projectsWithProgress = userProjects.map((p) => ({
		...p,
		totalMilestones: Number(p.totalMilestones) || 0,
		completedMilestones: Number(p.completedMilestones) || 0,
		progress:
			Number(p.totalMilestones) > 0
				? Math.round((Number(p.completedMilestones) / Number(p.totalMilestones)) * 100)
				: 0
	}));

	return {
		projects: projectsWithProgress,
		projectCount: userProjects.length,
		maxProjects: MAX_PROJECTS,
		canCreateProject: userProjects.length < MAX_PROJECTS
	};
};
