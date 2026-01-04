import { json, error } from '@sveltejs/kit';
import { db, projects } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

function isValidUrl(str: string): boolean {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	const projectId = params.id;

	let body: { stack?: string[]; githubUrl?: string | null; liveUrl?: string | null; description?: string | null };
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requête invalide' });
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

	// Validate and prepare update data
	const updateData: Record<string, unknown> = { updatedAt: new Date() };

	if (body.stack !== undefined) {
		if (!Array.isArray(body.stack)) {
			throw error(400, { message: 'stack doit être un tableau' });
		}
		if (body.stack.length > 10) {
			throw error(400, { message: 'Maximum 10 technologies' });
		}
		for (const tag of body.stack) {
			if (typeof tag !== 'string' || tag.length > 50) {
				throw error(400, { message: 'Chaque tag doit être une chaîne de 50 caractères max' });
			}
		}
		updateData.stack = body.stack;
	}

	if (body.githubUrl !== undefined) {
		if (body.githubUrl !== null && body.githubUrl !== '') {
			if (!isValidUrl(body.githubUrl)) {
				throw error(400, { message: 'URL GitHub invalide' });
			}
		}
		updateData.githubUrl = body.githubUrl || null;
	}

	if (body.liveUrl !== undefined) {
		if (body.liveUrl !== null && body.liveUrl !== '') {
			if (!isValidUrl(body.liveUrl)) {
				throw error(400, { message: 'URL Live invalide' });
			}
		}
		updateData.liveUrl = body.liveUrl || null;
	}

	if (body.description !== undefined) {
		if (body.description !== null && body.description.length > 200) {
			throw error(400, { message: 'Description trop longue (max 200 caractères)' });
		}
		updateData.description = body.description || null;
	}

	try {
		await db.update(projects).set(updateData).where(eq(projects.id, projectId));

		return json({ success: true });
	} catch {
		throw error(500, { message: 'Erreur lors de la mise à jour' });
	}
};
