import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, projects, milestones } from '$lib/server/db';
import { eq, and, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();

	// Load project by ID with ownership check
	const project = await db
		.select()
		.from(projects)
		.where(and(eq(projects.id, params.id), eq(projects.userId, user.id)))
		.limit(1);

	if (project.length === 0) {
		throw error(404, { message: 'Projet non trouve' });
	}

	// Load milestones ordered by position
	const projectMilestones = await db
		.select({
			id: milestones.id,
			title: milestones.title,
			isCompleted: milestones.isCompleted,
			position: milestones.position
		})
		.from(milestones)
		.where(eq(milestones.projectId, params.id))
		.orderBy(asc(milestones.position));

	// Calculate progress
	const totalCount = projectMilestones.length;
	const completedCount = projectMilestones.filter((m) => m.isCompleted).length;
	const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	return {
		project: project[0],
		milestones: projectMilestones,
		progress,
		completedCount,
		totalCount
	};
};
