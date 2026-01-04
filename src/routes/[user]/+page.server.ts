import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, and, asc, inArray } from 'drizzle-orm';

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

	// Charger tous les milestones en une seule requête (évite N+1)
	const projectIds = publicProjects.map((p) => p.id);
	const allMilestones =
		projectIds.length > 0
			? await db
					.select({
						id: milestones.id,
						projectId: milestones.projectId,
						title: milestones.title,
						isCompleted: milestones.isCompleted,
						position: milestones.position
					})
					.from(milestones)
					.where(inArray(milestones.projectId, projectIds))
					.orderBy(asc(milestones.position))
			: [];

	// Grouper les milestones par projet
	const milestonesByProject = new Map<string, typeof allMilestones>();
	for (const milestone of allMilestones) {
		const projectMilestones = milestonesByProject.get(milestone.projectId) ?? [];
		projectMilestones.push(milestone);
		milestonesByProject.set(milestone.projectId, projectMilestones);
	}

	// Assembler les projets avec leurs milestones
	// Pré-calculer le mois formaté pour éviter des calculs répétés côté client
	const projectsWithMilestones = publicProjects.map((project) => {
		const projectMilestones = milestonesByProject.get(project.id) ?? [];
		const totalMilestones = projectMilestones.length;
		const completedMilestones = projectMilestones.filter((m) => m.isCompleted).length;
		const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

		// Pre-compute date filter key (YYYY-MM format)
		const date = new Date(project.createdAt);
		const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

		return {
			...project,
			dateKey, // Pre-computed for filtering
			milestones: projectMilestones.map(({ id, title, isCompleted }) => ({ id, title, isCompleted })),
			totalMilestones,
			completedMilestones,
			progress
		};
	});

	return {
		profileUser: user[0],
		projects: projectsWithMilestones
	};
};
