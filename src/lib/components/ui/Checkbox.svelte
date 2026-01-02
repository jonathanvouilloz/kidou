<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		checked?: boolean;
		label?: string;
	}

	let { checked = $bindable(false), label, id, disabled, ...rest }: Props = $props();

	const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;
</script>

<label class="checkbox-wrapper" class:disabled for={checkboxId}>
	<input
		type="checkbox"
		id={checkboxId}
		class="checkbox-input"
		bind:checked
		{disabled}
		{...rest}
	/>
	<span class="checkbox-box">
		{#if checked}
			<span class="checkbox-check">✓</span>
		{/if}
	</span>
	{#if label}
		<span class="checkbox-label">{label}</span>
	{/if}
</label>

<style>
	.checkbox-wrapper {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		user-select: none;
	}

	.checkbox-wrapper.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.checkbox-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.checkbox-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-bg);
		transition: all var(--transition-fast);
	}

	.checkbox-input:checked + .checkbox-box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.checkbox-input:focus-visible + .checkbox-box {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.checkbox-check {
		color: var(--color-bg);
		font-size: var(--text-sm);
		font-weight: 700;
		line-height: 1;
	}

	.checkbox-label {
		font-size: var(--text-base);
		color: var(--color-text);
	}
</style>
