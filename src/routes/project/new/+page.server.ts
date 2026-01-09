import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { projects, users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import {
	getMaxProjects,
	getMaxLlmExtractions,
	checkAndResetLlmUsage,
	type PlanType
} from '$lib/server/plan-limits';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	// Si non authentifie, retourner des valeurs par defaut
	// L'utilisateur peut remplir le formulaire mais devra se connecter pour analyser/creer
	if (!user) {
		return {
			isAuthenticated: false,
			canCreateProject: true, // Inconnu tant que pas connecte
			projectCount: 0,
			maxProjects: 3, // Afficher les limites du plan free
			userPlan: 'free' as PlanType,
			canAnalyze: true, // Necesstera l'auth de toute facon
			llmUsed: 0,
			llmMax: 1
		};
	}

	const [userData] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, user.id));

	const userPlan = (userData?.plan ?? 'free') as PlanType;
	const maxProjects = getMaxProjects(userPlan);

	const [{ count }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(projects)
		.where(eq(projects.userId, user.id));

	const projectCount = Number(count);

	// Check LLM usage for analysis limits
	const { used: llmUsed } = await checkAndResetLlmUsage(user.id);
	const llmMax = getMaxLlmExtractions(userPlan);
	const canAnalyze = llmUsed < llmMax;

	return {
		isAuthenticated: true,
		canCreateProject: projectCount < maxProjects,
		projectCount,
		maxProjects,
		userPlan,
		canAnalyze,
		llmUsed,
		llmMax
	};
};
