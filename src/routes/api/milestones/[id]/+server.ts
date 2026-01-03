import { json, error } from '@sveltejs/kit';
import { db, milestones, projects } from '$lib/server/db';
import { eq, and, count } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	const milestoneId = params.id;

	// Parse request body
	let body: { isCompleted?: boolean };
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requete invalide' });
	}

	const { isCompleted } = body;

	if (typeof isCompleted !== 'boolean') {
		throw error(400, { message: 'isCompleted doit être un booléen' });
	}

	// Get milestone with project info to verify ownership
	const milestone = await db
		.select({
			id: milestones.id,
			projectId: milestones.projectId,
			projectUserId: projects.userId
		})
		.from(milestones)
		.innerJoin(projects, eq(milestones.projectId, projects.id))
		.where(eq(milestones.id, milestoneId))
		.limit(1);

	if (milestone.length === 0) {
		throw error(404, { message: 'Milestone non trouvée' });
	}

	// Verify ownership
	if (milestone[0].projectUserId !== locals.user.id) {
		throw error(403, { message: 'Accès refusé' });
	}

	const projectId = milestone[0].projectId;

	try {
		// Update milestone
		await db
			.update(milestones)
			.set({
				isCompleted,
				completedAt: isCompleted ? new Date() : null,
				updatedAt: new Date()
			})
			.where(eq(milestones.id, milestoneId));

		// Check if all milestones are complete to update project status
		const [{ total }] = await db
			.select({ total: count() })
			.from(milestones)
			.where(eq(milestones.projectId, projectId));

		const [{ completed }] = await db
			.select({ completed: count() })
			.from(milestones)
			.where(and(eq(milestones.projectId, projectId), eq(milestones.isCompleted, true)));

		const allComplete = Number(total) > 0 && Number(completed) === Number(total);

		// Update project completion status if needed
		const [currentProject] = await db
			.select({ isCompleted: projects.isCompleted })
			.from(projects)
			.where(eq(projects.id, projectId));

		if (currentProject.isCompleted !== allComplete) {
			await db
				.update(projects)
				.set({
					isCompleted: allComplete,
					completedAt: allComplete ? new Date() : null,
					updatedAt: new Date()
				})
				.where(eq(projects.id, projectId));
		}

		return json({
			success: true,
			milestoneId,
			isCompleted,
			projectCompleted: allComplete
		});
	} catch (err) {
		throw error(500, { message: 'Erreur lors de la mise à jour' });
	}
};
