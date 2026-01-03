import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

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

	// Charger les projets publics avec progression
	const publicProjects = await db
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
		.where(and(eq(projects.userId, user[0].id), eq(projects.isPublic, true)))
		.orderBy(projects.createdAt);

	const projectsWithProgress = publicProjects.map((p) => ({
		...p,
		totalMilestones: Number(p.totalMilestones) || 0,
		completedMilestones: Number(p.completedMilestones) || 0,
		progress:
			Number(p.totalMilestones) > 0
				? Math.round((Number(p.completedMilestones) / Number(p.totalMilestones)) * 100)
				: 0
	}));

	return {
		profileUser: user[0],
		projects: projectsWithProgress
	};
};
