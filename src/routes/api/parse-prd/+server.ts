import { json, error } from '@sveltejs/kit';
import { parsePRD } from '$lib/server/llm';
import {
	getUserPlan,
	getMaxLlmExtractions,
	checkAndResetLlmUsage,
	incrementLlmUsage
} from '$lib/server/plan-limits';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	// Check LLM usage limits
	const plan = await getUserPlan(locals.user.id);
	const maxExtractions = getMaxLlmExtractions(plan);
	const { used } = await checkAndResetLlmUsage(locals.user.id);

	if (used >= maxExtractions) {
		throw error(403, {
			message: `Limite de ${maxExtractions} analyse(s) IA/jour atteinte. Passez a Pro pour plus d'analyses!`
		});
	}

	// Parse request body
	let body: { prdContent?: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, { message: 'Corps de requete invalide' });
	}

	const { prdContent } = body;

	// Validate PRD content
	if (!prdContent || typeof prdContent !== 'string') {
		throw error(400, { message: 'Le contenu du PRD est requis' });
	}

	if (prdContent.trim().length < 50) {
		throw error(400, { message: 'Le PRD doit contenir au moins 50 caractères' });
	}

	// Call LLM to parse PRD
	try {
		const result = await parsePRD(prdContent);

		// Increment LLM usage
		await incrementLlmUsage(locals.user.id);

		if (!result.milestones || result.milestones.length === 0) {
			throw error(400, { message: 'Aucune milestone détectée dans le PRD' });
		}

		return json(result);
	} catch (err) {
		// Re-throw if it's already an error response
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, { message: "Erreur lors de l'analyse du PRD. Réessayez." });
	}
};
