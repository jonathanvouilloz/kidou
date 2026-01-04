import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Charger les derniers projets publics avec leur owner
	const publicProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			deadline: projects.deadline,
			isCompleted: projects.isCompleted,
			createdAt: projects.createdAt,
			userId: projects.userId
		})
		.from(projects)
		.where(eq(projects.isPublic, true))
		.orderBy(desc(projects.createdAt))
		.limit(20);

	// Charger les owners et milestones pour chaque projet
	const projectsWithDetails = await Promise.all(
		publicProjects.map(async (project) => {
			// Charger l'owner
			const [owner] = await db
				.select({
					username: users.username,
					name: users.name,
					avatarUrl: users.avatarUrl
				})
				.from(users)
				.where(eq(users.id, project.userId))
				.limit(1);

			// Charger les milestones
			const projectMilestones = await db
				.select({
					id: milestones.id,
					title: milestones.title,
					isCompleted: milestones.isCompleted
				})
				.from(milestones)
				.where(eq(milestones.projectId, project.id))
				.orderBy(asc(milestones.position));

			const totalMilestones = projectMilestones.length;
			const completedMilestones = projectMilestones.filter((m) => m.isCompleted).length;
			const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

			return {
				...project,
				owner,
				milestones: projectMilestones,
				totalMilestones,
				completedMilestones,
				progress
			};
		})
	);

	return {
		projects: projectsWithDetails
	};
};
