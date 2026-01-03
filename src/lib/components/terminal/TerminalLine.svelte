<script lang="ts">
	interface Props {
		lineNumber: number;
		completed?: boolean;
		text: string;
		animate?: boolean;
		delay?: number;
	}

	let { lineNumber, completed = false, text, animate = false, delay = 0 }: Props = $props();
</script>

<div
	class="terminal-line"
	class:completed
	class:animate
	style={animate ? `--delay: ${delay}ms` : undefined}
>
	<span class="line-number">{String(lineNumber).padStart(2, '0')}</span>
	<span class="line-status">{completed ? '✓' : '○'}</span>
	<span class="line-text">{text}</span>
</div>

<style>
	.terminal-line {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-1) 0;
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}

	.terminal-line.completed {
		color: var(--color-accent);
	}

	.terminal-line.animate {
		opacity: 0;
		animation: fadeIn 0.3s ease forwards;
		animation-delay: var(--delay);
	}

	.terminal-line.animate .line-text {
		overflow: hidden;
		white-space: nowrap;
		animation: typing 0.5s steps(20) forwards;
		animation-delay: var(--delay);
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes typing {
		from { max-width: 0; }
		to { max-width: 100%; }
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
		transition: transform 0.2s ease;
	}

	.terminal-line.completed .line-status {
		transform: scale(1.1);
	}

	.line-text {
		flex: 1;
	}

	/* Mobile responsive */
	@media (max-width: 480px) {
		.terminal-line {
			font-size: var(--text-xs);
			gap: var(--space-2);
		}

		.line-number {
			min-width: 1.5em;
		}

		.line-status {
			width: 1.2em;
		}
	}
</style>
