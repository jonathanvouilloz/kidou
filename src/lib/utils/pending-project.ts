import { browser } from '$app/environment';

export const PENDING_PROJECT_KEY = 'kidou_pending_project';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 heures

export interface PendingMilestone {
	id: string;
	title: string;
	position: number;
}

export type MilestoneMode = 'choice' | 'prd' | 'manual';

export interface PendingProjectData {
	version: 1;
	savedAt: string;
	step: 1 | 2;
	projectName: string;
	description: string;
	stack: string[];
	deadline: string;
	githubUrl: string;
	liveUrl: string;
	prdContent: string;
	milestones: PendingMilestone[];
	milestoneMode?: MilestoneMode;
}

export type PendingProjectInput = Omit<PendingProjectData, 'version' | 'savedAt'>;

export function savePendingProject(data: PendingProjectInput): void {
	if (!browser) return;

	const fullData: PendingProjectData = {
		...data,
		version: 1,
		savedAt: new Date().toISOString()
	};

	try {
		localStorage.setItem(PENDING_PROJECT_KEY, JSON.stringify(fullData));
	} catch {
		// localStorage peut etre plein ou desactive
		console.warn('Failed to save pending project to localStorage');
	}
}

export function loadPendingProject(): PendingProjectData | null {
	if (!browser) return null;

	try {
		const raw = localStorage.getItem(PENDING_PROJECT_KEY);
		if (!raw) return null;

		const data = JSON.parse(raw) as PendingProjectData;

		// Valider version
		if (data.version !== 1) return null;

		// Verifier expiration
		const savedAt = new Date(data.savedAt).getTime();
		if (Date.now() - savedAt > MAX_AGE_MS) {
			clearPendingProject();
			return null;
		}

		return data;
	} catch {
		clearPendingProject();
		return null;
	}
}

export function clearPendingProject(): void {
	if (!browser) return;

	try {
		localStorage.removeItem(PENDING_PROJECT_KEY);
	} catch {
		// Ignorer les erreurs
	}
}

export function hasPendingProject(): boolean {
	return loadPendingProject() !== null;
}
