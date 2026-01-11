<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		type?: 'text' | 'url';
		multiline?: boolean;
		onSave: (newValue: string) => Promise<void>;
	}

	let { value, placeholder = 'Enter value...', type = 'text', multiline = false, onSave }: Props = $props();

	let editing = $state(false);
	let inputValue = $state(value);
	let saving = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	function startEdit() {
		inputValue = value;
		editing = true;
		queueMicrotask(() => inputEl?.focus());
	}

	function cancelEdit() {
		editing = false;
		inputValue = value;
	}

	async function save() {
		if (saving) return;

		const trimmed = inputValue.trim();
		if (trimmed === value) {
			editing = false;
			return;
		}

		saving = true;
		try {
			await onSave(trimmed);
			editing = false;
		} finally {
			saving = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			save();
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	}
</script>

{#if editing}
	<div class="inline-edit editing">
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			type={type}
			{placeholder}
			onkeydown={handleKeydown}
			onblur={save}
			disabled={saving}
			class="edit-input"
		/>
		<button
			type="button"
			class="save-btn"
			onmousedown={(e) => e.preventDefault()}
			onclick={save}
			disabled={saving}
		>
			{#if saving}
				<span class="loader"></span>
			{:else}
				✓
			{/if}
		</button>
	</div>
{:else}
	<button type="button" class="inline-edit display" class:multiline onclick={startEdit}>
		{#if value}
			<span class="value" class:multiline>{value}</span>
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
		<span class="edit-icon">✎</span>
	</button>
{/if}

<style>
	.inline-edit {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 32px;
	}

	.inline-edit.display {
		padding: var(--space-1) var(--space-2);
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		text-align: left;
		transition: all var(--transition-fast);
		width: 100%;
	}

	.inline-edit.display:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-border);
	}

	.value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.value.multiline {
		white-space: pre-wrap;
		text-overflow: unset;
	}

	.inline-edit.display.multiline {
		align-items: flex-start;
	}

	.placeholder {
		flex: 1;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.edit-icon {
		opacity: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: opacity var(--transition-fast);
	}

	.inline-edit.display:hover .edit-icon {
		opacity: 1;
	}

	.inline-edit.editing {
		width: 100%;
	}

	.edit-input {
		flex: 1;
		padding: var(--space-1) var(--space-2);
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		outline: none;
		transition: border-color var(--transition-fast);
	}

	.edit-input:focus {
		border-color: var(--color-text-secondary);
	}

	.edit-input:disabled {
		opacity: 0.5;
	}

	.save-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: var(--color-accent);
		border: none;
		border-radius: var(--radius-sm);
		color: var(--color-bg);
		cursor: pointer;
		font-size: var(--text-base);
		transition: opacity var(--transition-fast);
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

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
