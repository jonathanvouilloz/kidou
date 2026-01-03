<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		progress?: number;
		showProgress?: boolean;
		progressText?: string;
		children: Snippet;
	}

	let {
		title = 'kidou',
		progress = 0,
		showProgress = true,
		progressText,
		children
	}: Props = $props();
</script>

<div class="terminal">
	<div class="terminal-header">
		<span class="terminal-dot red"></span>
		<span class="terminal-dot yellow"></span>
		<span class="terminal-dot green"></span>
		<span class="terminal-title">{title} — {progress.toFixed(0)}%</span>
	</div>

	<div class="terminal-body">
		{@render children()}
	</div>

	{#if showProgress}
		<div class="terminal-footer">
			<span class="progress-bar" class:complete={progress >= 100}>
				<span class="progress-fill" style="width: {progress}%"></span>
			</span>
			{#if progressText}
				<span class="progress-text">{progressText}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.terminal {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		font-family: var(--font-mono);
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-bg-elevated);
		border-bottom: 1px solid var(--color-border);
	}

	.terminal-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.terminal-dot.red {
		background: #ff5f56;
	}

	.terminal-dot.yellow {
		background: #ffbd2e;
	}

	.terminal-dot.green {
		background: #27c93f;
	}

	.terminal-title {
		margin-left: auto;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.terminal-body {
		padding: var(--space-4);
		min-height: 150px;
	}

	.terminal-footer {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-3);
		background: var(--color-bg-elevated);
		border-top: 1px solid var(--color-border);
	}

	.progress-bar {
		flex: 1;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		display: block;
		height: 100%;
		background: var(--color-accent);
		transition: width var(--transition-normal);
	}

	.progress-bar.complete .progress-fill {
		animation: pulse 2s ease-in-out infinite;
		box-shadow: 0 0 8px var(--color-accent);
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.progress-text {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	/* Mobile responsive */
	@media (max-width: 480px) {
		.terminal-body {
			padding: var(--space-3);
			font-size: var(--text-xs);
			min-height: 120px;
		}

		.terminal-header,
		.terminal-footer {
			padding: var(--space-2);
		}

		.terminal-title {
			font-size: var(--text-xs);
		}
	}
</style>
