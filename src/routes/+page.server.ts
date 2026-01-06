import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, desc, asc, inArray } from 'drizzle-orm';

const LATEST_PROJECTS_COUNT = 3;

export const load: PageServerLoad = async () => {
	// Charger les 3 derniers projets publics avec leur owner
	const latestPublicProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			slug: projects.slug,
			deadline: projects.deadline,
			isCompleted: projects.isCompleted,
			ownerUsername: users.username,
			ownerName: users.name,
			ownerAvatarUrl: users.avatarUrl
		})
		.from(projects)
		.innerJoin(users, eq(projects.userId, users.id))
		.where(eq(projects.isPublic, true))
		.orderBy(desc(projects.createdAt))
		.limit(LATEST_PROJECTS_COUNT);

	// Charger tous les milestones en une seule requête
	const projectIds = latestPublicProjects.map((p) => p.id);
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
	const latestProjects = latestPublicProjects.map((project) => {
		const projectMilestones = milestonesByProject.get(project.id) ?? [];
		const totalMilestones = projectMilestones.length;
		const completedMilestones = projectMilestones.filter((m) => m.isCompleted).length;
		const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

		return {
			id: project.id,
			name: project.name,
			slug: project.slug,
			deadline: project.deadline,
			isCompleted: project.isCompleted,
			owner: {
				username: project.ownerUsername,
				name: project.ownerName,
				avatarUrl: project.ownerAvatarUrl
			},
			milestones: projectMilestones.map(({ id, title, isCompleted }) => ({ id, title, isCompleted })),
			progress
		};
	});

	return {
		latestProjects
	};
};
