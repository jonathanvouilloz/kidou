<script lang="ts">
	import FilterBar from '$lib/components/ui/FilterBar.svelte';
	import MatrixBackground from '$lib/components/ui/MatrixBackground.svelte';
	import TerminalCard from '$lib/components/project/TerminalCard.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let selectedStatus = $state<'all' | 'done' | 'building' | 'waiting'>('all');
	let selectedDate = $state('all');

	// Extract unique year-month combinations from projects
	const availableDates = $derived(() => {
		const dateMap = new Map<string, string>();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		for (const project of data.projects) {
			const date = new Date(project.createdAt);
			const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const label = `${months[date.getMonth()]} ${date.getFullYear()}`;
			dateMap.set(value, label);
		}

		return Array.from(dateMap.entries())
			.sort((a, b) => b[0].localeCompare(a[0])) // Most recent first
			.map(([value, label]) => ({ value, label }));
	});

	let filteredProjects = $derived(
		data.projects.filter((p) => {
			// Status filter
			if (selectedStatus !== 'all') {
				if (selectedStatus === 'done' && p.progress !== 100) return false;
				if (selectedStatus === 'building' && (p.progress <= 0 || p.progress >= 100)) return false;
				if (selectedStatus === 'waiting' && p.progress !== 0) return false;
			}

			// Date filter
			if (selectedDate !== 'all') {
				const date = new Date(p.createdAt);
				const projectDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
				if (projectDate !== selectedDate) return false;
			}

			return true;
		})
	);
</script>

<svelte:head>
	<title>{m.community_metaTitle()}</title>
	<meta name="description" content="{m.community_metaDescription()}" />
	<meta property="og:title" content="{m.community_metaTitle()}" />
	<meta property="og:description" content="{m.community_metaDescription()}" />
	<meta property="og:type" content="website" />
</svelte:head>

<MatrixBackground />

<main class="community-page">
	<div class="container">
		<header class="page-header">
			<h1 class="page-title">{m.community_title()}</h1>
			<p class="page-subtitle">{m.community_subtitle()}</p>
		</header>

		<FilterBar
			{selectedStatus}
			onchange={(s) => (selectedStatus = s)}
			availableDates={availableDates()}
			{selectedDate}
			ondatechange={(d) => (selectedDate = d)}
		/>

		{#if filteredProjects.length === 0}
			<div class="empty-state">
				<p>NO_PROJECTS_FOUND</p>
				<p class="empty-hint">{m.community_noProjects()}</p>
			</div>
		{:else}
			<div class="terminals-grid">
				{#each filteredProjects as project (project.id)}
					<TerminalCard
						name={project.name}
						slug={project.slug}
						username={project.owner.username}
						progress={project.progress}
						milestones={project.milestones}
						deadline={project.deadline}
						isCompleted={project.isCompleted ?? false}
					/>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	.community-page {
		padding: var(--space-8) var(--space-4);
		min-height: 100vh;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.page-title {
		font-size: 42px;
		font-weight: 800;
		margin: 0 0 var(--space-2);
		text-transform: uppercase;
		letter-spacing: -1px;
		text-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
	}

	.page-subtitle {
		color: var(--color-text-muted);
		font-size: var(--text-base);
		margin: 0;
	}

	.terminals-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		justify-items: center;
	}

	@media (max-width: 1024px) {
		.terminals-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.terminals-grid {
			grid-template-columns: 1fr;
		}
	}

	.empty-state {
		text-align: center;
		padding: var(--space-12);
		color: var(--color-text-muted);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}

	.empty-state p {
		margin: 0;
	}

	.empty-state p:first-child {
		font-size: var(--text-xl);
		color: #444;
		margin-bottom: var(--space-2);
	}

	.empty-hint {
		font-size: var(--text-sm);
	}

	@media (max-width: 768px) {
		.community-page {
			padding: var(--space-6) var(--space-3);
		}

		.page-title {
			font-size: 28px;
		}
	}

	@media (max-width: 480px) {
		.community-page {
			padding: var(--space-4) var(--space-3);
		}

		.page-title {
			font-size: 22px;
		}
	}
</style>
