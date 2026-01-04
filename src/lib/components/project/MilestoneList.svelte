<script lang="ts">
	import MilestoneItem from './MilestoneItem.svelte';

	interface Milestone {
		id: string;
		title: string;
		isCompleted: boolean;
	}

	interface Props {
		milestones: Milestone[];
		readonly?: boolean;
		onToggle?: (id: string, completed: boolean) => void;
		onAdd?: (title: string) => Promise<void>;
	}

	let { milestones, readonly = false, onToggle, onAdd }: Props = $props();

	let adding = $state(false);
	let newTitle = $state('');
	let saving = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();

	function startAdding() {
		adding = true;
		newTitle = '';
		queueMicrotask(() => inputEl?.focus());
	}

	function cancelAdding() {
		adding = false;
		newTitle = '';
	}

	async function submitAdd() {
		const title = newTitle.trim();
		if (!title || saving || !onAdd) return;

		saving = true;
		try {
			await onAdd(title);
			newTitle = '';
			adding = false;
		} finally {
			saving = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submitAdd();
		} else if (e.key === 'Escape') {
			cancelAdding();
		}
	}
</script>

<div class="milestone-list">
	{#if milestones.length === 0}
		<p class="empty-message">Aucun milestone</p>
	{:else}
		{#each milestones as milestone (milestone.id)}
			<MilestoneItem
				id={milestone.id}
				title={milestone.title}
				isCompleted={milestone.isCompleted}
				{readonly}
				{onToggle}
			/>
		{/each}
	{/if}

	{#if !readonly && onAdd}
		{#if adding}
			<div class="add-form">
				<input
					bind:this={inputEl}
					bind:value={newTitle}
					type="text"
					class="add-input"
					placeholder="New milestone title..."
					onkeydown={handleKeydown}
					disabled={saving}
				/>
				<button
					type="button"
					class="add-btn"
					onclick={submitAdd}
					disabled={saving || !newTitle.trim()}
				>
					{#if saving}
						<span class="loader"></span>
					{:else}
						Add
					{/if}
				</button>
				<button type="button" class="cancel-btn" onclick={cancelAdding} disabled={saving}>
					Cancel
				</button>
			</div>
		{:else}
			<button type="button" class="add-milestone-btn" onclick={startAdding}>
				+ Add milestone
			</button>
		{/if}
	{/if}
</div>

<style>
	.milestone-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.empty-message {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		padding: var(--space-4);
		text-align: center;
	}

	.add-milestone-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		margin-top: var(--space-2);
		background: transparent;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		width: 100%;
		justify-content: center;
	}

	.add-milestone-btn:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
		background: var(--color-bg-hover);
	}

	.add-form {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.add-input {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font-size: var(--text-base);
		outline: none;
		transition: border-color var(--transition-fast);
	}

	.add-input:focus {
		border-color: var(--color-text-secondary);
	}

	.add-input:disabled {
		opacity: 0.5;
	}

	.add-btn,
	.cancel-btn {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		background: var(--color-accent);
		border: none;
		color: var(--color-bg);
		min-width: 60px;
	}

	.add-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.add-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.cancel-btn:hover:not(:disabled) {
		color: var(--color-text);
	}

	.cancel-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
