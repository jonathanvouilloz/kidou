<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let { header, footer, children, ...rest }: Props = $props();
</script>

<div class="card" {...rest}>
	{#if header}
		<div class="card-header">
			{@render header()}
		</div>
	{/if}
	<div class="card-body">
		{@render children()}
	</div>
	{#if footer}
		<div class="card-footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style>
	.card {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.card-header {
		padding: var(--space-4);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.card-body {
		padding: var(--space-4);
	}

	.card-footer {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border-subtle);
		background: var(--color-bg);
	}
</style>
