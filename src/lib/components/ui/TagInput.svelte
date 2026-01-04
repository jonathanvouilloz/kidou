<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	interface Props {
		label?: string;
		placeholder?: string;
		tags?: string[];
		maxTags?: number;
	}

	let { label, placeholder = m.tagInput_placeholder(), tags = $bindable([]), maxTags = 10 }: Props = $props();

	let inputValue = $state('');

	function addTag(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const value = inputValue.trim();
			if (value && !tags.includes(value) && tags.length < maxTags) {
				tags = [...tags, value];
				inputValue = '';
			}
		}
	}

	function removeTag(index: number) {
		tags = tags.filter((_, i) => i !== index);
	}
</script>

<div class="tag-input-wrapper">
	{#if label}
		<label class="tag-label">{label}</label>
	{/if}
	<div class="tag-container">
		{#each tags as tag, i (tag)}
			<span class="tag">
				{tag}
				<button type="button" class="tag-remove" onclick={() => removeTag(i)}>&times;</button>
			</span>
		{/each}
		{#if tags.length < maxTags}
			<input
				type="text"
				class="tag-input"
				bind:value={inputValue}
				onkeydown={addTag}
				{placeholder}
			/>
		{/if}
	</div>
</div>

<style>
	.tag-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.tag-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		min-height: 42px;
		align-items: center;
	}

	.tag-container:focus-within {
		border-color: var(--color-text-secondary);
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text);
		font-family: var(--font-mono);
	}

	.tag-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		padding: 0;
		border: none;
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: 14px;
		line-height: 1;
		transition: color var(--transition-fast);
	}

	.tag-remove:hover {
		color: var(--color-error);
	}

	.tag-input {
		flex: 1;
		min-width: 120px;
		padding: var(--space-1) 0;
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		background: transparent;
		border: none;
		outline: none;
	}

	.tag-input::placeholder {
		color: var(--color-text-muted);
	}
</style>
