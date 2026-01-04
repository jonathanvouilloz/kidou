import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const PARSE_PRD_PROMPT = `Tu es un assistant qui analyse des documents de planification de projet (PRD, specs, notes).

Ton rôle : extraire une liste de 3 à 10 milestones/features principales du document.

Règles :
- Chaque milestone = une fonctionnalité ou étape majeure
- Formulation courte (max 50 caractères)
- Verbe d'action ou nom de feature
- Ordre logique de développement
- Ignorer les détails d'implémentation
- Ignorer les sections "nice to have" ou "V2"

Format de sortie (JSON uniquement, pas de texte autour) :
{
  "milestones": [
    "Auth système",
    "Dashboard principal",
    "Création de projet",
    "Page publique",
    "Deploy"
  ]
}

Document à analyser :
---
{PRD_CONTENT}
---`;

export interface ParsedMilestones {
	milestones: string[];
}

/**
 * Extract JSON object from text that may contain additional content
 */
function extractJSON(text: string): string {
	const start = text.indexOf('{');
	const end = text.lastIndexOf('}');
	if (start === -1 || end === -1 || end < start) {
		throw new Error('No JSON object found in response');
	}
	return text.slice(start, end + 1);
}

export async function parsePRD(prdContent: string): Promise<ParsedMilestones> {
	const prompt = PARSE_PRD_PROMPT.replace('{PRD_CONTENT}', prdContent);

	console.log('Calling Claude API...');
	const message = await anthropic.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 1024,
		messages: [
			{
				role: 'user',
				content: prompt
			}
		]
	});

	const textContent = message.content.find((block) => block.type === 'text');
	if (!textContent || textContent.type !== 'text') {
		throw new Error('No text response from Claude');
	}

	try {
		const jsonStr = extractJSON(textContent.text);
		const parsed = JSON.parse(jsonStr) as ParsedMilestones;
		if (!Array.isArray(parsed.milestones)) {
			throw new Error('Invalid response format');
		}
		return parsed;
	} catch (e) {
		console.error('LLM parse error:', e, 'Response:', textContent.text);
		throw new Error('Failed to parse LLM response as JSON');
	}
}
