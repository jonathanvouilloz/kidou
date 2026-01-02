<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		error?: string;
		label?: string;
	}

	let { error, label, id, ...rest }: Props = $props();

	const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="input-wrapper" class:has-error={!!error}>
	{#if label}
		<label for={inputId} class="input-label">{label}</label>
	{/if}
	<input id={inputId} class="input" {...rest} />
	{#if error}
		<span class="input-error">{error}</span>
	{/if}
</div>

<style>
	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.input-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		transition: border-color var(--transition-fast);
	}

	.input::placeholder {
		color: var(--color-text-muted);
	}

	.input:focus {
		outline: none;
		border-color: var(--color-text-secondary);
	}

	.input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.has-error .input {
		border-color: var(--color-error);
	}

	.input-error {
		font-size: var(--text-sm);
		color: var(--color-error);
	}
</style>
