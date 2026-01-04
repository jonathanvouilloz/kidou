import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	// Chercher l'utilisateur par username
	const user = await db
		.select({
			id: users.id,
			username: users.username,
			name: users.name,
			avatarUrl: users.avatarUrl,
			accentColor: users.accentColor
		})
		.from(users)
		.where(eq(users.username, params.user))
		.limit(1);

	if (user.length === 0) {
		throw error(404, { message: 'Utilisateur non trouvé' });
	}

	// Charger les projets publics
	const publicProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			deadline: projects.deadline,
			isCompleted: projects.isCompleted,
			createdAt: projects.createdAt
		})
		.from(projects)
		.where(and(eq(projects.userId, user[0].id), eq(projects.isPublic, true)))
		.orderBy(projects.createdAt);

	// Charger les milestones pour chaque projet
	const projectsWithMilestones = await Promise.all(
		publicProjects.map(async (project) => {
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
				milestones: projectMilestones,
				totalMilestones,
				completedMilestones,
				progress
			};
		})
	);

	return {
		profileUser: user[0],
		projects: projectsWithMilestones
	};
};
