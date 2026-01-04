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
			avatarUrl: users.avatarUrl
		})
		.from(users)
		.where(eq(users.username, params.user))
		.limit(1);

	if (user.length === 0) {
		throw error(404, { message: 'Utilisateur non trouvé' });
	}

	// Chercher le projet par slug + userId + isPublic
	const project = await db
		.select()
		.from(projects)
		.where(
			and(
				eq(projects.userId, user[0].id),
				eq(projects.slug, params.project),
				eq(projects.isPublic, true)
			)
		)
		.limit(1);

	if (project.length === 0) {
		throw error(404, { message: 'Projet non trouvé' });
	}

	// Charger les milestones
	const projectMilestones = await db
		.select({
			id: milestones.id,
			title: milestones.title,
			isCompleted: milestones.isCompleted,
			completedAt: milestones.completedAt,
			position: milestones.position
		})
		.from(milestones)
		.where(eq(milestones.projectId, project[0].id))
		.orderBy(asc(milestones.position));

	// Calculer progression
	const totalCount = projectMilestones.length;
	const completedCount = projectMilestones.filter((m) => m.isCompleted).length;
	const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	return {
		owner: user[0],
		project: project[0],
		milestones: projectMilestones,
		progress,
		completedCount,
		totalCount
	};
};
