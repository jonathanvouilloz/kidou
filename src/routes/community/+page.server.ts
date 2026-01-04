import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, desc, asc, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Charger les projets publics avec leur owner via JOIN (évite N+1)
	const publicProjectsWithOwners = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			deadline: projects.deadline,
			isCompleted: projects.isCompleted,
			createdAt: projects.createdAt,
			userId: projects.userId,
			ownerUsername: users.username,
			ownerName: users.name,
			ownerAvatarUrl: users.avatarUrl
		})
		.from(projects)
		.innerJoin(users, eq(projects.userId, users.id))
		.where(eq(projects.isPublic, true))
		.orderBy(desc(projects.createdAt))
		.limit(20);

	// Charger tous les milestones en une seule requête (évite N+1)
	const projectIds = publicProjectsWithOwners.map((p) => p.id);
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

	// Assembler les projets avec leurs milestones et owner
	// Pré-calculer le mois formaté pour éviter des calculs répétés côté client
	const projectsWithDetails = publicProjectsWithOwners.map((project) => {
		const projectMilestones = milestonesByProject.get(project.id) ?? [];
		const totalMilestones = projectMilestones.length;
		const completedMilestones = projectMilestones.filter((m) => m.isCompleted).length;
		const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

		// Pre-compute date filter key (YYYY-MM format)
		const date = new Date(project.createdAt);
		const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

		return {
			id: project.id,
			name: project.name,
			slug: project.slug,
			deadline: project.deadline,
			isCompleted: project.isCompleted,
			createdAt: project.createdAt,
			dateKey, // Pre-computed for filtering
			userId: project.userId,
			owner: {
				username: project.ownerUsername,
				name: project.ownerName,
				avatarUrl: project.ownerAvatarUrl
			},
			milestones: projectMilestones.map(({ id, title, isCompleted }) => ({ id, title, isCompleted })),
			totalMilestones,
			completedMilestones,
			progress
		};
	});

	return {
		projects: projectsWithDetails
	};
};
