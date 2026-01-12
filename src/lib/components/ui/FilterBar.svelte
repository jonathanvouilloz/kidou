<script lang="ts">
	type Status = 'all' | 'done' | 'building' | 'waiting';

	interface Props {
		selectedStatus?: Status;
		onchange?: (status: Status) => void;
		availableDates?: { value: string; label: string }[];
		selectedDate?: string;
		ondatechange?: (date: string) => void;
	}

	let {
		selectedStatus = 'all',
		onchange,
		availableDates = [],
		selectedDate = 'all',
		ondatechange
	}: Props = $props();

	const statusOptions: { value: Status; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'done', label: 'Completed' },
		{ value: 'building', label: 'In progress' },
		{ value: 'waiting', label: 'Not started' }
	];

	function handleClick(value: Status) {
		onchange?.(value);
	}

	function handleDateChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		ondatechange?.(target.value);
	}
</script>

<div class="filter-bar">
	<div class="filter-groups-left">
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

	<div class="filter-group filter-date">
		<span class="filter-label">Date</span>
		<select class="date-select" value={selectedDate} onchange={handleDateChange}>
			<option value="all">All time</option>
			{#each availableDates as date}
				<option value={date.value}>{date.label}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-6);
		padding-bottom: var(--space-6);
		margin-bottom: var(--space-8);
		border-bottom: 1px solid var(--color-border);
	}

	.filter-groups-left {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-6);
		align-items: flex-start;
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

	.filter-date {
		margin-left: auto;
	}

	.date-select {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
		font-family: inherit;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.15s ease;
		appearance: none;
		padding-right: var(--space-6);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 8px center;
	}

	.date-select:hover {
		border-color: var(--color-text-muted);
	}

	.date-select:focus {
		outline: none;
		border-color: var(--color-text);
	}

	.date-select option {
		background: var(--color-bg);
		color: var(--color-text);
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

		.filter-groups-left {
			gap: var(--space-4);
		}
	}

	@media (max-width: 480px) {
		.filter-bar {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-3);
		}

		.filter-groups-left {
			flex-direction: column;
			gap: var(--space-3);
			width: 100%;
		}

		.chips {
			flex-wrap: wrap;
			gap: var(--space-1);
		}

		.chip {
			font-size: 12px;
			padding: 4px 10px;
		}

		.filter-date {
			margin-left: 0;
			width: 100%;
		}

		.date-select {
			width: 100%;
		}
	}
</style>
