<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard - Kidou</title>
</svelte:head>

<main class="dashboard">
	<div class="container">
		<header class="dashboard-header">
			<div class="header-left">
				<h1>{m.dashboard_title()}</h1>
				{#if data.maxProjects === Infinity}
					<Badge variant="default">{data.projectCount} projects</Badge>
				{:else}
					<Badge variant="default">{m.dashboard_projectCount({ count: data.projectCount, max: data.maxProjects })}</Badge>
				{/if}
			</div>

			{#if data.canCreateProject}
				<Button variant="primary" onclick={() => goto('/project/new')}>{m.dashboard_newProject()}</Button>
			{:else}
				<Badge variant="default">Coming soon</Badge>
			{/if}
		</header>

		{#if data.projects.length === 0}
			<section class="empty-state">
				<p class="empty-icon">&gt;_</p>
				<p>{m.dashboard_emptyTitle()}</p>
				<p class="hint">{m.dashboard_emptyHint()}</p>
				<Button variant="primary" onclick={() => goto('/project/new')}>
					{m.dashboard_createFirst()}
				</Button>
			</section>
		{:else}
			<div class="projects-grid">
				{#each data.projects as project (project.id)}
					<ProjectCard
						name={project.name}
						slug={project.slug}
						username={data.user.username}
						progress={project.progress}
						completedCount={project.completedMilestones}
						totalCount={project.totalMilestones}
						isCompleted={project.isCompleted ?? false}
						href={`/project/${project.id}`}
					/>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	.dashboard {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-8);
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.dashboard-header h1 {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin: 0;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-12) var(--space-4);
		color: var(--color-text-secondary);
	}

	.empty-icon {
		font-size: var(--text-3xl);
		font-family: var(--font-mono);
		color: var(--color-text-muted);
		margin-bottom: var(--space-4);
	}

	.hint {
		margin-top: var(--space-2);
		margin-bottom: var(--space-6);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	@media (max-width: 768px) {
		.dashboard {
			padding: var(--space-6) var(--space-3);
		}

		.dashboard-header h1 {
			font-size: var(--text-xl);
		}
	}

	@media (max-width: 480px) {
		.dashboard {
			padding: var(--space-4) var(--space-3);
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
