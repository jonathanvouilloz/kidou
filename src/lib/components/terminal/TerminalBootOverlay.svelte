<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		open: boolean;
		projectName?: string;
	}

	let { open, projectName = 'project' }: Props = $props();

	const STEPS = [
		'[SYSTEM] Initializing project...',
		'[PARSER] Analyzing milestones...',
		'[DB] Saving to database...',
		'[DONE] Project ready!'
	];

	const STEP_DELAY = 500; // ms entre chaque étape
	const TYPING_SPEED = 25; // ms par caractère

	let currentStep = $state(0);
	let completedSteps = $state<boolean[]>([false, false, false, false]);
	let displayedTexts = $state<string[]>(['', '', '', '']);
	let showCursor = $state<number | null>(null);

	$effect(() => {
		if (!open || !browser) {
			// Reset state when closed
			currentStep = 0;
			completedSteps = [false, false, false, false];
			displayedTexts = ['', '', '', ''];
			showCursor = null;
			return;
		}

		// Start animation sequence
		let cancelled = false;

		const animateStep = async (stepIndex: number) => {
			if (cancelled || stepIndex >= STEPS.length) return;

			showCursor = stepIndex;
			const text = STEPS[stepIndex];

			// Type each character
			for (let i = 0; i <= text.length; i++) {
				if (cancelled) return;
				displayedTexts[stepIndex] = text.slice(0, i);
				await new Promise(r => setTimeout(r, TYPING_SPEED + Math.random() * 15));
			}

			// Mark as completed
			showCursor = null;
			completedSteps[stepIndex] = true;
			currentStep = stepIndex + 1;

			// Wait before next step
			await new Promise(r => setTimeout(r, STEP_DELAY));

			// Animate next step
			if (stepIndex < STEPS.length - 1) {
				animateStep(stepIndex + 1);
			}
		};

		// Start with a small delay
		setTimeout(() => animateStep(0), 300);

		return () => {
			cancelled = true;
		};
	});

	let progress = $derived(Math.round((currentStep / STEPS.length) * 100));
</script>

{#if open}
	<div class="overlay">
		<div class="terminal">
			<div class="terminal-header">
				<div class="terminal-dots">
					<span class="dot red"></span>
					<span class="dot yellow"></span>
					<span class="dot green"></span>
				</div>
				<span class="terminal-title">Initializing {projectName}...</span>
			</div>

			<div class="terminal-body">
				{#each STEPS as step, i}
					<div
						class="terminal-line"
						class:completed={completedSteps[i]}
						class:visible={i <= currentStep}
					>
						<span class="line-number">{String(i + 1).padStart(2, '0')}</span>
						<span class="line-status">{completedSteps[i] ? '✓' : '○'}</span>
						<span class="line-text">
							{displayedTexts[i]}
							{#if showCursor === i}
								<span class="typing-cursor">|</span>
							{/if}
						</span>
					</div>
				{/each}
			</div>

			<div class="terminal-footer">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
				<span class="progress-text">{progress}%</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: rgba(0, 0, 0, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.terminal {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		width: 90%;
		max-width: 500px;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		animation: scaleIn 0.3s ease;
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.terminal-dots {
		display: flex;
		gap: var(--space-2);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: #27c93f; }

	.terminal-title {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}

	.terminal-body {
		padding: var(--space-4);
		min-height: 150px;
	}

	.terminal-line {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-2) 0;
		color: var(--color-text-muted);
		opacity: 0;
		transition: opacity 0.2s ease, color 0.2s ease;
	}

	.terminal-line.visible {
		opacity: 1;
	}

	.terminal-line.completed {
		color: var(--color-success);
	}

	.line-number {
		color: var(--color-text-muted);
		opacity: 0.5;
		min-width: 2em;
		text-align: right;
	}

	.line-status {
		width: 1.5em;
		text-align: center;
	}

	.terminal-line.completed .line-status {
		text-shadow: 0 0 8px var(--color-success);
	}

	.line-text {
		flex: 1;
	}

	.typing-cursor {
		animation: blink 0.5s step-end infinite;
		color: var(--color-accent);
	}

	@keyframes blink {
		50% { opacity: 0; }
	}

	.terminal-footer {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: var(--color-bg);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-success);
		transition: width 0.3s ease;
		box-shadow: 0 0 10px var(--color-success);
	}

	.progress-text {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		min-width: 3em;
		text-align: right;
	}

	@media (max-width: 480px) {
		.terminal {
			font-size: var(--text-xs);
		}

		.terminal-body {
			padding: var(--space-3);
		}

		.terminal-line {
			gap: var(--space-2);
		}
	}
</style>
