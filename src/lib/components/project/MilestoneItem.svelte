<script lang="ts">
	interface Props {
		id: string;
		title: string;
		isCompleted: boolean;
		readonly?: boolean;
		onToggle?: (id: string, completed: boolean) => void;
	}

	let { id, title, isCompleted, readonly = false, onToggle }: Props = $props();

	function handleToggle() {
		if (!readonly && onToggle) {
			onToggle(id, !isCompleted);
		}
	}
</script>

<div
	class="milestone-item"
	class:completed={isCompleted}
	class:readonly
	role={readonly ? undefined : 'button'}
	tabindex={readonly ? undefined : 0}
	onclick={handleToggle}
	onkeydown={(e) => e.key === 'Enter' && handleToggle()}
>
	<span class="milestone-status">{isCompleted ? '✓' : '○'}</span>
	<span class="milestone-title">{title}</span>
</div>

<style>
	.milestone-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.milestone-item:not(.readonly) {
		cursor: pointer;
	}

	.milestone-item:not(.readonly):hover {
		background: var(--color-bg-hover);
	}

	.milestone-item:not(.readonly):focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.milestone-item.completed {
		color: var(--color-accent);
	}

	.milestone-status {
		width: 1.5em;
		text-align: center;
		font-size: var(--text-lg);
	}

	.milestone-title {
		flex: 1;
	}
</style>
