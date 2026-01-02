<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let { variant = 'primary', size = 'md', children, ...rest }: Props = $props();
</script>

<button class="btn btn-{variant} btn-{size}" {...rest}>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		font-family: var(--font-mono);
		font-weight: 500;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.btn-primary {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-text-secondary);
		border-color: var(--color-text-secondary);
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-text);
		border-color: var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-bg-hover);
		border-color: var(--color-text-muted);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text-secondary);
		border-color: transparent;
	}

	.btn-ghost:hover:not(:disabled) {
		color: var(--color-text);
		background: var(--color-bg-hover);
	}

	/* Sizes */
	.btn-sm {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
	}

	.btn-md {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-base);
	}

	.btn-lg {
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-lg);
	}
</style>
