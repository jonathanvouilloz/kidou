<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		error?: string;
		label?: string;
	}

	let { error, label, id, rows = 10, ...rest }: Props = $props();

	const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="textarea-wrapper" class:has-error={!!error}>
	{#if label}
		<label for={textareaId} class="textarea-label">{label}</label>
	{/if}
	<textarea id={textareaId} class="textarea" {rows} {...rest}></textarea>
	{#if error}
		<span class="textarea-error">{error}</span>
	{/if}
</div>

<style>
	.textarea-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.textarea-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.textarea {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		transition: border-color var(--transition-fast);
		resize: vertical;
		line-height: 1.5;
	}

	.textarea::placeholder {
		color: var(--color-text-muted);
	}

	.textarea:focus {
		outline: none;
		border-color: var(--color-text-secondary);
	}

	.textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.has-error .textarea {
		border-color: var(--color-error);
	}

	.textarea-error {
		font-size: var(--text-sm);
		color: var(--color-error);
	}
</style>
