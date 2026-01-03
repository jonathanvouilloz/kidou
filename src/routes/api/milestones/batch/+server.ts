import { json, error } from '@sveltejs/kit';
import { db, milestones, projects } from '$lib/server/db';
import { eq, and, inArray, count, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

interface MilestoneUpdate {
	id: string;
	isCompleted: boolean;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	// Parse request body
	let body: { projectId?: string; milestones?: MilestoneUpdate[] };
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requete invalide' });
	}

	const { projectId, milestones: milestoneUpdates } = body;

	if (!projectId || !milestoneUpdates || !Array.isArray(milestoneUpdates)) {
		throw error(400, { message: 'projectId et milestones sont requis' });
	}

	// Verify project ownership
	const [project] = await db
		.select({ userId: projects.userId })
		.from(projects)
		.where(eq(projects.id, projectId));

	if (!project) {
		throw error(404, { message: 'Projet non trouvé' });
	}

	if (project.userId !== locals.user.id) {
		throw error(403, { message: 'Accès refusé' });
	}

	try {
		const now = new Date();

		// Update all milestones in parallel
		await Promise.all(
			milestoneUpdates.map((update) =>
				db
					.update(milestones)
					.set({
						isCompleted: update.isCompleted,
						completedAt: update.isCompleted ? now : null,
						updatedAt: now
					})
					.where(and(eq(milestones.id, update.id), eq(milestones.projectId, projectId)))
			)
		);

		// Check if all milestones are complete
		const [stats] = await db
			.select({
				total: count(),
				completed: sql<number>`COUNT(*) FILTER (WHERE ${milestones.isCompleted} = true)`
			})
			.from(milestones)
			.where(eq(milestones.projectId, projectId));

		const allComplete = Number(stats.total) > 0 && Number(stats.completed) === Number(stats.total);

		// Update project completion status
		await db
			.update(projects)
			.set({
				isCompleted: allComplete,
				completedAt: allComplete ? now : null,
				updatedAt: now
			})
			.where(eq(projects.id, projectId));

		return json({
			success: true,
			projectCompleted: allComplete,
			completedCount: Number(stats.completed),
			totalCount: Number(stats.total)
		});
	} catch (err) {
		console.error('Batch update error:', err);
		throw error(500, { message: 'Erreur lors de la mise à jour' });
	}
};
