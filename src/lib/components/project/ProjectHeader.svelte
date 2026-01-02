<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		progress: number;
		completedCount: number;
		totalCount: number;
		isCompleted?: boolean;
		isPublic?: boolean;
		publicUrl?: string;
		actions?: Snippet;
	}

	let {
		name,
		progress,
		completedCount,
		totalCount,
		isCompleted = false,
		isPublic = true,
		publicUrl,
		actions
	}: Props = $props();
</script>

<header class="project-header">
	<div class="project-info">
		<div class="project-title-row">
			<h1 class="project-name">{name}</h1>
			<div class="project-badges">
				{#if isCompleted}
					<Badge variant="success">Terminé</Badge>
				{:else}
					<Badge variant="warning">En cours</Badge>
				{/if}
				{#if isPublic}
					<Badge>Public</Badge>
				{:else}
					<Badge variant="default">Privé</Badge>
				{/if}
			</div>
		</div>

		<div class="project-stats">
			<span class="stat">
				<span class="stat-value">{progress.toFixed(0)}%</span>
				<span class="stat-label">progression</span>
			</span>
			<span class="stat">
				<span class="stat-value">{completedCount}/{totalCount}</span>
				<span class="stat-label">milestones</span>
			</span>
			{#if publicUrl}
				<span class="stat">
					<a href={publicUrl} class="public-link" target="_blank" rel="noopener">
						{publicUrl}
					</a>
				</span>
			{/if}
		</div>
	</div>

	{#if actions}
		<div class="project-actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-4);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--space-6);
	}

	.project-info {
		flex: 1;
	}

	.project-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		flex-wrap: wrap;
	}

	.project-name {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin: 0;
	}

	.project-badges {
		display: flex;
		gap: var(--space-2);
	}

	.project-stats {
		display: flex;
		gap: var(--space-6);
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: 500;
		color: var(--color-text);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.public-link {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.public-link:hover {
		color: var(--color-text);
	}

	.project-actions {
		display: flex;
		gap: var(--space-2);
	}
</style>
