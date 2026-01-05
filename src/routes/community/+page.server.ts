import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, projects, milestones } from '$lib/server/db/schema';
import { eq, desc, asc, inArray, and, gte, lt, count, sql } from 'drizzle-orm';

const ITEMS_PER_PAGE = 20;

export const load: PageServerLoad = async ({ url }) => {
	// Lire les query params
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const dateFilter = url.searchParams.get('date') ?? 'all';
	const offset = (page - 1) * ITEMS_PER_PAGE;

	// Construire les conditions WHERE
	const conditions = [eq(projects.isPublic, true)];

	// Filtre par date (mois/année)
	if (dateFilter !== 'all' && /^\d{4}-\d{2}$/.test(dateFilter)) {
		const [year, month] = dateFilter.split('-').map(Number);
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 1);
		conditions.push(gte(projects.createdAt, startDate));
		conditions.push(lt(projects.createdAt, endDate));
	}

	// Compter le total pour la pagination
	const [{ total }] = await db
		.select({ total: count() })
		.from(projects)
		.where(and(...conditions));

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
		.where(and(...conditions))
		.orderBy(desc(projects.createdAt))
		.limit(ITEMS_PER_PAGE)
		.offset(offset);

	// Récupérer toutes les dates disponibles pour le filtre (sans pagination)
	const allProjectDates = await db
		.select({ createdAt: projects.createdAt })
		.from(projects)
		.where(eq(projects.isPublic, true))
		.orderBy(desc(projects.createdAt));

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

	// Construire les dates disponibles pour le filtre
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const dateMap = new Map<string, string>();
	for (const { createdAt } of allProjectDates) {
		const date = new Date(createdAt);
		const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		if (!dateMap.has(dateKey)) {
			dateMap.set(dateKey, `${months[date.getMonth()]} ${date.getFullYear()}`);
		}
	}
	const availableDates = Array.from(dateMap.entries())
		.sort((a, b) => b[0].localeCompare(a[0]))
		.map(([value, label]) => ({ value, label }));

	return {
		projects: projectsWithDetails,
		pagination: {
			page,
			limit: ITEMS_PER_PAGE,
			total,
			totalPages: Math.ceil(total / ITEMS_PER_PAGE)
		},
		filters: {
			date: dateFilter
		},
		availableDates
	};
};
