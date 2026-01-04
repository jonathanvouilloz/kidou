<script lang="ts">
	type Status = 'all' | 'done' | 'building' | 'waiting';

	interface Props {
		selectedStatus?: Status;
		onchange?: (status: Status) => void;
	}

	let { selectedStatus = 'all', onchange }: Props = $props();

	const statusOptions: { value: Status; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'done', label: 'Completed' },
		{ value: 'building', label: 'In progress' },
		{ value: 'waiting', label: 'Not started' }
	];

	function handleClick(value: Status) {
		onchange?.(value);
	}
</script>

<div class="filter-bar">
	<div class="filter-group">
		<span class="filter-label">Status</span>
		<div class="chips">
			{#each statusOptions as option}
				<button
					class="chip"
					class:active={selectedStatus === option.value}
					onclick={() => handleClick(option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="filter-group disabled">
		<span class="filter-label">Stack</span>
		<button class="chip" disabled>Soon</button>
	</div>

	<div class="filter-group disabled">
		<span class="filter-label">Type</span>
		<button class="chip" disabled>Soon</button>
	</div>
</div>

<style>
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		align-items: flex-start;
		padding-bottom: var(--space-6);
		margin-bottom: var(--space-8);
		border-bottom: 1px solid var(--color-border);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.filter-group.disabled {
		opacity: 0.5;
	}

	.filter-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.chips {
		display: flex;
		gap: var(--space-1);
	}

	.chip {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
		font-family: inherit;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.chip:hover:not(:disabled) {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.chip.active {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.3);
		color: var(--color-text);
	}

	.chip:disabled {
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.filter-bar {
			gap: var(--space-4);
		}
	}

	@media (max-width: 480px) {
		.filter-bar {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}
	}
</style>
