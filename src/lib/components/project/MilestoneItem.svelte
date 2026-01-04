<script lang="ts">
	interface Props {
		id: string;
		title: string;
		isCompleted: boolean;
		readonly?: boolean;
		onToggle?: (id: string, completed: boolean) => void;
	}

	let { id, title, isCompleted, readonly = false, onToggle }: Props = $props();

	let justToggled = $state(false);

	function handleToggle() {
		if (!readonly && onToggle) {
			justToggled = true;
			onToggle(id, !isCompleted);

			setTimeout(() => {
				justToggled = false;
			}, 600);
		}
	}
</script>

<div
	class="milestone-item"
	class:completed={isCompleted}
	class:readonly
	class:just-toggled={justToggled}
	role={readonly ? undefined : 'button'}
	tabindex={readonly ? undefined : 0}
	onclick={handleToggle}
	onkeydown={(e) => e.key === 'Enter' && handleToggle()}
>
	<span class="milestone-status">
		<span class="status-icon">{isCompleted ? '✓' : '○'}</span>
		{#if justToggled && isCompleted}
			<span class="glow-ring"></span>
		{/if}
	</span>
	<span class="milestone-title">{title}</span>
	{#if !readonly}
		<span class="hover-hint">
			{isCompleted ? 'Mark as pending' : 'Mark as done'}
		</span>
	{/if}
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
		position: relative;
		width: 1.5em;
		text-align: center;
		font-size: var(--text-lg);
	}

	.status-icon {
		display: inline-block;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.milestone-item.completed .status-icon {
		text-shadow: 0 0 8px var(--color-success);
	}

	.milestone-item.just-toggled .status-icon {
		animation: bounce-check 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes bounce-check {
		0% { transform: scale(0.8); }
		40% { transform: scale(1.3); }
		60% { transform: scale(0.95); }
		80% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	.glow-ring {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 1.8em;
		height: 1.8em;
		border-radius: 50%;
		pointer-events: none;
		animation: glow-pulse 0.6s ease-out forwards;
	}

	@keyframes glow-pulse {
		0% {
			box-shadow: 0 0 0 0 var(--color-success);
			opacity: 0.8;
		}
		100% {
			box-shadow: 0 0 0 12px transparent;
			opacity: 0;
		}
	}

	.milestone-item:not(.readonly):active .status-icon {
		transform: scale(0.85);
	}

	.milestone-title {
		flex: 1;
	}

	.hover-hint {
		opacity: 0;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: opacity var(--transition-fast);
	}

	.milestone-item:not(.readonly):hover .hover-hint {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.status-icon,
		.glow-ring {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
