import { json, error } from '@sveltejs/kit';
import { db, milestones, projects } from '$lib/server/db';
import { eq, max } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	let body: { projectId: string; title: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requête invalide' });
	}

	const { projectId, title } = body;

	if (!projectId || typeof projectId !== 'string') {
		throw error(400, { message: 'projectId requis' });
	}

	if (!title || typeof title !== 'string') {
		throw error(400, { message: 'title requis' });
	}

	const trimmedTitle = title.trim();
	if (trimmedTitle.length === 0 || trimmedTitle.length > 200) {
		throw error(400, { message: 'Le titre doit faire entre 1 et 200 caractères' });
	}

	// Verify project exists and belongs to user
	const [project] = await db
		.select({ id: projects.id, userId: projects.userId })
		.from(projects)
		.where(eq(projects.id, projectId))
		.limit(1);

	if (!project) {
		throw error(404, { message: 'Projet non trouvé' });
	}

	if (project.userId !== locals.user.id) {
		throw error(403, { message: 'Accès refusé' });
	}

	try {
		// Get max position
		const [result] = await db
			.select({ maxPos: max(milestones.position) })
			.from(milestones)
			.where(eq(milestones.projectId, projectId));

		const nextPosition = (result?.maxPos ?? 0) + 1;

		// Insert new milestone
		const [newMilestone] = await db
			.insert(milestones)
			.values({
				projectId,
				title: trimmedTitle,
				position: nextPosition,
				isCompleted: false
			})
			.returning({
				id: milestones.id,
				title: milestones.title,
				isCompleted: milestones.isCompleted,
				position: milestones.position
			});

		return json(newMilestone, { status: 201 });
	} catch {
		throw error(500, { message: 'Erreur lors de la création' });
	}
};
