<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Milestone {
		id: string;
		title: string;
		position: number;
	}

	let { milestones = $bindable() }: { milestones: Milestone[] } = $props();

	function updateTitle(id: string, newTitle: string) {
		milestones = milestones.map((m) => (m.id === id ? { ...m, title: newTitle } : m));
	}

	function deleteMilestone(id: string) {
		milestones = milestones
			.filter((m) => m.id !== id)
			.map((m, i) => ({ ...m, position: i + 1 }));
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const newMilestones = [...milestones];
		[newMilestones[index - 1], newMilestones[index]] = [
			newMilestones[index],
			newMilestones[index - 1]
		];
		milestones = newMilestones.map((m, i) => ({ ...m, position: i + 1 }));
	}

	function moveDown(index: number) {
		if (index >= milestones.length - 1) return;
		const newMilestones = [...milestones];
		[newMilestones[index], newMilestones[index + 1]] = [
			newMilestones[index + 1],
			newMilestones[index]
		];
		milestones = newMilestones.map((m, i) => ({ ...m, position: i + 1 }));
	}

	function addMilestone() {
		const newMilestone: Milestone = {
			id: crypto.randomUUID(),
			title: '',
			position: milestones.length + 1
		};
		milestones = [...milestones, newMilestone];
	}

	function handleKeydown(e: KeyboardEvent, index: number) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addMilestone();
			// Focus the new input after DOM update
			setTimeout(() => {
				const inputs = document.querySelectorAll('.milestone-input');
				(inputs[index + 1] as HTMLInputElement)?.focus();
			}, 0);
		}
	}
</script>

<div class="milestone-list">
	{#if milestones.length === 0}
		<p class="empty-message">{m.milestones_empty()}</p>
	{:else}
		{#each milestones as milestone, index (milestone.id)}
			<div class="milestone-row">
				<span class="position">{milestone.position}.</span>

				<input
					type="text"
					class="milestone-input"
					value={milestone.title}
					placeholder={m.milestones_placeholder()}
					oninput={(e) => updateTitle(milestone.id, e.currentTarget.value)}
					onkeydown={(e) => handleKeydown(e, index)}
				/>

				<div class="actions">
					<button
						type="button"
						class="action-btn"
						disabled={index === 0}
						onclick={() => moveUp(index)}
						title={m.milestones_moveUp()}
					>
						↑
					</button>
					<button
						type="button"
						class="action-btn"
						disabled={index === milestones.length - 1}
						onclick={() => moveDown(index)}
						title={m.milestones_moveDown()}
					>
						↓
					</button>
					<button
						type="button"
						class="action-btn delete"
						onclick={() => deleteMilestone(milestone.id)}
						title={m.milestones_delete()}
					>
						×
					</button>
				</div>
			</div>
		{/each}
	{/if}

	<Button variant="ghost" size="sm" onclick={addMilestone}>{m.milestones_addMilestone()}</Button>
</div>

<style>
	.milestone-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.empty-message {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		text-align: center;
		padding: var(--space-4);
	}

	.milestone-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.position {
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		min-width: 2em;
		text-align: right;
	}

	.milestone-input {
		flex: 1;
		padding: var(--space-1) var(--space-2);
		font-family: var(--font-mono);
		font-size: var(--text-base);
		color: var(--color-text);
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		transition: border-color var(--transition-fast);
	}

	.milestone-input:focus {
		outline: none;
		border-color: var(--color-text-secondary);
	}

	.milestone-input::placeholder {
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		gap: var(--space-1);
	}

	.action-btn {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: var(--text-base);
		transition: all var(--transition-fast);
	}

	.action-btn:hover:not(:disabled) {
		border-color: var(--color-text-secondary);
		color: var(--color-text);
	}

	.action-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.action-btn.delete:hover:not(:disabled) {
		border-color: var(--color-error);
		color: var(--color-error);
	}
</style>
