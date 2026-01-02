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
	}

	let { milestones, readonly = false, onToggle }: Props = $props();
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
</style>
