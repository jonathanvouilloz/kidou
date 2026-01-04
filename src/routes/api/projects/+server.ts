import { json, error } from '@sveltejs/kit';
import { db, projects, milestones } from '$lib/server/db';
import { generateSlug } from '$lib/utils/slug';
import { eq, count, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const MAX_PROJECTS = 3;

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	// Parse request body
	let body: {
		name?: string;
		originalPrd?: string;
		milestones?: string[];
		description?: string;
		stack?: string[];
		deadline?: string;
		githubUrl?: string;
		liveUrl?: string;
	};
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requete invalide' });
	}

	const { name, originalPrd, milestones: milestoneTitles, description, stack, deadline, githubUrl, liveUrl } = body;

	// Validate name
	if (!name || typeof name !== 'string' || name.trim().length < 3) {
		throw error(400, { message: 'Le nom du projet doit contenir au moins 3 caractères' });
	}

	if (name.length > 100) {
		throw error(400, { message: 'Le nom du projet ne peut pas dépasser 100 caractères' });
	}

	// Validate PRD
	if (!originalPrd || typeof originalPrd !== 'string') {
		throw error(400, { message: 'Le contenu du PRD est requis' });
	}

	// Validate milestones
	if (!milestoneTitles || !Array.isArray(milestoneTitles) || milestoneTitles.length === 0) {
		throw error(400, { message: 'Au moins une milestone est requise' });
	}

	if (milestoneTitles.length > 20) {
		throw error(400, { message: 'Maximum 20 milestones autorisées' });
	}

	// Validate description
	if (description && description.length > 200) {
		throw error(400, { message: 'Description trop longue (max 200 caractères)' });
	}

	// Check project count limit
	const [{ value: projectCount }] = await db
		.select({ value: count() })
		.from(projects)
		.where(eq(projects.userId, locals.user.id));

	if (projectCount >= MAX_PROJECTS) {
		throw error(400, {
			message: `Vous avez atteint la limite de ${MAX_PROJECTS} projets`
		});
	}

	// Generate unique slug
	let baseSlug = generateSlug(name.trim());
	if (!baseSlug) {
		baseSlug = 'projet';
	}

	let slug = baseSlug;
	let slugSuffix = 1;

	// Check for existing slugs and make unique
	while (true) {
		const existing = await db
			.select({ id: projects.id })
			.from(projects)
			.where(and(eq(projects.userId, locals.user.id), eq(projects.slug, slug)))
			.limit(1);

		if (existing.length === 0) {
			break;
		}

		slugSuffix++;
		slug = `${baseSlug}-${slugSuffix}`;
	}

	// Create project and milestones in transaction
	try {
		const result = await db.transaction(async (tx) => {
			// Insert project
			const [project] = await tx
				.insert(projects)
				.values({
					userId: locals.user!.id,
					name: name.trim(),
					slug,
					description: description?.trim() || null,
					originalPrd,
					stack: stack?.filter((s) => s.trim()) || null,
					deadline: deadline ? new Date(deadline) : null,
					githubUrl: githubUrl?.trim() || null,
					liveUrl: liveUrl?.trim() || null,
					isPublic: true,
					isCompleted: false
				})
				.returning({ id: projects.id, slug: projects.slug, name: projects.name });

			// Insert milestones
			await tx.insert(milestones).values(
				milestoneTitles.map((title, index) => ({
					projectId: project.id,
					title: title.trim(),
					position: index + 1,
					isCompleted: false
				}))
			);

			return project;
		});

		return json(result, { status: 201 });
	} catch (err) {
		throw error(500, { message: 'Erreur lors de la création du projet' });
	}
};
