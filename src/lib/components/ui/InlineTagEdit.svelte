<script lang="ts">
	interface Props {
		tags: string[];
		placeholder?: string;
		onSave: (newTags: string[]) => Promise<void>;
		maxTags?: number;
	}

	let { tags, placeholder = 'Add tag...', onSave, maxTags = 10 }: Props = $props();

	let editing = $state(false);
	let localTags = $state<string[]>([]);
	let inputValue = $state('');
	let saving = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	function startEdit() {
		localTags = [...tags];
		inputValue = '';
		editing = true;
		setTimeout(() => inputEl?.focus(), 0);
	}

	function cancelEdit() {
		editing = false;
		localTags = [];
		inputValue = '';
	}

	function addTag() {
		const value = inputValue.trim();
		if (value && !localTags.includes(value) && localTags.length < maxTags) {
			localTags = [...localTags, value];
			inputValue = '';
		}
	}

	function removeTag(index: number) {
		localTags = localTags.filter((_, i) => i !== index);
	}

	async function save() {
		if (saving) return;

		// Add any pending tag from input before saving
		const pendingValue = inputValue.trim();
		if (pendingValue && !localTags.includes(pendingValue) && localTags.length < maxTags) {
			localTags = [...localTags, pendingValue];
			inputValue = '';
		}

		// Check if tags changed
		const tagsChanged =
			localTags.length !== tags.length || localTags.some((t, i) => t !== tags[i]);

		if (!tagsChanged) {
			editing = false;
			return;
		}

		saving = true;
		try {
			await onSave(localTags);
			editing = false;
		} finally {
			saving = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		} else if (e.key === 'Escape') {
			cancelEdit();
		} else if (e.key === 'Backspace' && inputValue === '' && localTags.length > 0) {
			removeTag(localTags.length - 1);
		}
	}
</script>

{#if editing}
	<div class="inline-tag-edit editing">
		<div class="tag-container">
			{#each localTags as tag, i (tag)}
				<span class="tag">
					{tag}
					<button type="button" class="tag-remove" onclick={() => removeTag(i)}>&times;</button>
				</span>
			{/each}
			{#if localTags.length < maxTags}
				<input
					bind:this={inputEl}
					bind:value={inputValue}
					type="text"
					class="tag-input"
					{placeholder}
					onkeydown={handleKeydown}
					disabled={saving}
				/>
			{/if}
		</div>
		<div class="actions">
			<button type="button" class="cancel-btn" onclick={cancelEdit} disabled={saving}>
				Cancel
			</button>
			<button type="button" class="save-btn" onclick={save} disabled={saving}>
				{#if saving}
					<span class="loader"></span>
				{:else}
					Save
				{/if}
			</button>
		</div>
	</div>
{:else}
	<button type="button" class="inline-tag-edit display" onclick={startEdit}>
		{#if tags.length > 0}
			<div class="tags-display">
				{#each tags as tag (tag)}
					<span class="tag-badge">{tag}</span>
				{/each}
			</div>
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
		<span class="edit-icon">✎</span>
	</button>
{/if}

<style>
	.inline-tag-edit {
		width: 100%;
	}

	.inline-tag-edit.display {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-2);
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
		min-height: 32px;
		transition: all var(--transition-fast);
	}

	.inline-tag-edit.display:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-border);
	}

	.tags-display {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		flex: 1;
	}

	.tag-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-family: var(--font-mono);
		color: var(--color-text);
	}

	.placeholder {
		flex: 1;
		color: var(--color-text-muted);
		font-style: italic;
		font-size: var(--text-base);
	}

	.edit-icon {
		opacity: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: opacity var(--transition-fast);
	}

	.inline-tag-edit.display:hover .edit-icon {
		opacity: 1;
	}

	.inline-tag-edit.editing {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
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

	.tag-input:disabled {
		opacity: 0.5;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
	}

	.cancel-btn,
	.save-btn {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.cancel-btn:hover:not(:disabled) {
		color: var(--color-text);
	}

	.save-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		background: var(--color-accent);
		border: none;
		color: var(--color-bg);
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.cancel-btn:disabled,
	.save-btn:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.loader {
		width: 12px;
		height: 12px;
		border: 2px solid var(--color-bg);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
