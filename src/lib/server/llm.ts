import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const PARSE_PRD_PROMPT = `You are an assistant that analyzes project planning documents (PRDs, specs, roadmaps, notes, todo lists).

OBJECTIVE: Extract the main milestones/features/phases according to the NATURAL STRUCTURE of the document.

PRINCIPLES:
1. Adapt to the document style (formal, personal notes, bullet points, prose)
2. Detect the appropriate granularity level (epic > feature > task)
3. Prioritize business/user value over technical details
4. Respect the author's organization (don't reorganize)
5. Capture the intent, not just words

POSSIBLE MILESTONE TYPES:
- User features ("Authentication System", "PDF Export")
- Project phases ("MVP", "Private Beta", "Public Launch")
- Technical epics ("Infrastructure", "Backend API")
- Modules ("Admin Dashboard", "Public Page")
- Whatever the author defined as main sections

EXTRACTION RULES:
- Between 3 and 15 items (depending on document complexity)
- Natural phrasing (30-80 characters)
- Keep author's vocabulary when clear
- One milestone = a coherent work package, not a micro-task
- Ignore meta-info (changelog, version notes, "to discuss")

GOOD vs BAD EXAMPLES:
Good: "Claude Integration via MCP"
Bad: "MCP tools drafts"

Good: "Visualization Dashboard"
Bad: "Dashboard list drafts"

Good: "Inspiration Capture System"
Bad: "API endpoints drafts"

ANALYSIS:
1. What type of document is this? (formal PRD, notes, technical specs, roadmap)
2. What is the dominant granularity? (epic, feature, task)
3. How has the author structured the information?

OUTPUT FORMAT (pure JSON, no text before/after):
{
  "milestones": [
    "Milestone 1",
    "Milestone 2",
    "..."
  ]
}

Document:
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
