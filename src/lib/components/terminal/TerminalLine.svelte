<script lang="ts">
	interface Props {
		lineNumber: number;
		completed?: boolean;
		text: string;
	}

	let { lineNumber, completed = false, text }: Props = $props();
</script>

<div class="terminal-line" class:completed>
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

	.line-text {
		flex: 1;
	}
</style>
