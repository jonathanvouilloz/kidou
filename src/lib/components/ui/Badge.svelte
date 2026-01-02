<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error';
		children: Snippet;
	}

	let { variant = 'default', children }: Props = $props();
</script>

<span class="badge badge-{variant}">
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-2);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		font-weight: 500;
		border-radius: var(--radius-sm);
		white-space: nowrap;
	}

	.badge-default {
		background: var(--color-bg-hover);
		color: var(--color-text-secondary);
	}

	.badge-success {
		background: rgba(0, 255, 65, 0.1);
		color: var(--color-success);
	}

	.badge-warning {
		background: rgba(255, 176, 0, 0.1);
		color: var(--color-warning);
	}

	.badge-error {
		background: rgba(255, 51, 51, 0.1);
		color: var(--color-error);
	}
</style>
