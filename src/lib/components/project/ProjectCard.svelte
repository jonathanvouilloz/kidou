<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';

	interface Props {
		name: string;
		slug: string;
		username: string;
		progress: number;
		completedCount: number;
		totalCount: number;
		isCompleted?: boolean;
	}

	let { name, slug, username, progress, completedCount, totalCount, isCompleted = false }: Props = $props();

	const href = `/${username}/${slug}`;
</script>

<a {href} class="project-card">
	<div class="project-header">
		<h3 class="project-name">{name}</h3>
		{#if isCompleted}
			<Badge variant="success">Terminé</Badge>
		{/if}
	</div>

	<div class="project-progress">
		<div class="progress-bar">
			<div class="progress-fill" style="width: {progress}%"></div>
		</div>
		<span class="progress-text">{completedCount}/{totalCount}</span>
	</div>

	<div class="project-footer">
		<span class="project-percentage">{progress.toFixed(0)}%</span>
	</div>
</a>

<style>
	.project-card {
		display: block;
		padding: var(--space-4);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		text-decoration: none;
	}

	.project-card:hover {
		border-color: var(--color-text-muted);
		background: var(--color-bg-hover);
	}

	.project-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.project-name {
		font-size: var(--text-lg);
		font-weight: 500;
		color: var(--color-text);
		margin: 0;
	}

	.project-progress {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.progress-bar {
		flex: 1;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-accent);
		transition: width var(--transition-normal);
	}

	.progress-text {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.project-footer {
		display: flex;
		justify-content: flex-end;
	}

	.project-percentage {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}
</style>
