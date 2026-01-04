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
				<span class="progress-fill" style="width: {progress}%">
					<span class="progress-shimmer"></span>
				</span>
				{#if progress > 0 && progress < 100}
					<span class="progress-tip" style="left: {progress}%"></span>
				{/if}
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
		position: relative;
		flex: 1;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		overflow: visible;
	}

	.progress-fill {
		position: relative;
		display: block;
		height: 100%;
		background: var(--color-accent);
		border-radius: 2px;
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.progress-shimmer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.3) 50%,
			transparent 100%
		);
		animation: shimmer 2s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.progress-tip {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 0 8px var(--color-accent), 0 0 16px var(--color-accent);
		animation: tip-pulse 1s ease-in-out infinite;
	}

	@keyframes tip-pulse {
		0%, 100% {
			opacity: 1;
			box-shadow: 0 0 8px var(--color-accent), 0 0 16px var(--color-accent);
		}
		50% {
			opacity: 0.7;
			box-shadow: 0 0 4px var(--color-accent), 0 0 8px var(--color-accent);
		}
	}

	.progress-bar.complete .progress-fill {
		background: var(--color-success);
		box-shadow: 0 0 8px var(--color-success);
		animation: complete-glow 2s ease-in-out infinite;
	}

	.progress-bar.complete .progress-shimmer {
		display: none;
	}

	@keyframes complete-glow {
		0%, 100% {
			box-shadow: 0 0 8px var(--color-success), 0 0 16px rgba(0, 255, 65, 0.3);
		}
		50% {
			box-shadow: 0 0 12px var(--color-success), 0 0 24px rgba(0, 255, 65, 0.5);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.progress-fill {
			transition: width 0.1s linear;
		}
		.progress-shimmer,
		.progress-tip {
			animation: none !important;
			display: none;
		}
		.progress-bar.complete .progress-fill {
			animation: none;
		}
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
