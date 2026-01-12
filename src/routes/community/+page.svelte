<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FilterBar from '$lib/components/ui/FilterBar.svelte';
	import MatrixBackground from '$lib/components/ui/MatrixBackground.svelte';
	import TerminalCard from '$lib/components/project/TerminalCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	// Status filtré côté client uniquement (pas de rechargement serveur)
	let selectedStatus = $state<'all' | 'done' | 'building' | 'waiting'>(
		($page.url.searchParams.get('status') ?? 'all') as 'all' | 'done' | 'building' | 'waiting'
	);

	// Date et page depuis l'URL (nécessitent rechargement serveur)
	let currentDate = $derived($page.url.searchParams.get('date') ?? 'all');
	let currentPage = $derived(data.pagination.page);

	// Navigation pour date/page uniquement (rechargement serveur)
	function navigateWithParams(newDate?: string, newPage?: number) {
		const params = new URLSearchParams();
		const date = newDate ?? currentDate;
		const pg = newPage ?? 1;

		// Conserver le status dans l'URL pour le partage
		if (selectedStatus !== 'all') params.set('status', selectedStatus);
		if (date !== 'all') params.set('date', date);
		if (pg > 1) params.set('page', pg.toString());

		const query = params.toString();
		goto(`/community${query ? '?' + query : ''}`, { replaceState: false });
	}

	// Mise à jour status (client-side, pas de navigation)
	function updateStatus(status: 'all' | 'done' | 'building' | 'waiting') {
		selectedStatus = status;
		// Mettre à jour l'URL sans recharger (pour le partage)
		const params = new URLSearchParams($page.url.searchParams);
		if (status === 'all') {
			params.delete('status');
		} else {
			params.set('status', status);
		}
		const query = params.toString();
		history.replaceState({}, '', `/community${query ? '?' + query : ''}`);
	}

	// Filtrage par status côté client (instantané, pas de requête serveur)
	let filteredProjects = $derived(
		data.projects.filter((p) => {
			if (selectedStatus !== 'all') {
				if (selectedStatus === 'done' && p.progress !== 100) return false;
				if (selectedStatus === 'building' && (p.progress <= 0 || p.progress >= 100)) return false;
				if (selectedStatus === 'waiting' && p.progress !== 0) return false;
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
			selectedStatus={selectedStatus}
			onchange={updateStatus}
			availableDates={data.availableDates}
			selectedDate={currentDate}
			ondatechange={(d) => navigateWithParams(d, undefined)}
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

			{#if data.pagination.totalPages > 1}
				<nav class="pagination">
					<Button
						variant="ghost"
						disabled={currentPage <= 1}
						onclick={() => navigateWithParams(undefined, currentPage - 1)}
					>
						← Prev
					</Button>
					<span class="pagination-info">{currentPage} / {data.pagination.totalPages}</span>
					<Button
						variant="ghost"
						disabled={currentPage >= data.pagination.totalPages}
						onclick={() => navigateWithParams(undefined, currentPage + 1)}
					>
						Next →
					</Button>
				</nav>
			{/if}
		{/if}
	</div>
</main>

<style>
	.community-page {
		padding: var(--space-8) var(--space-4);
		min-height: 100vh;
	}

	.container {
		width: 100%;
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
			gap: 16px;
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

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-4);
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-border);
	}

	.pagination-info {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
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
			padding: var(--space-4) var(--space-2);
		}

		.page-title {
			font-size: 20px;
		}

		.terminals-grid {
			gap: 12px;
			width: 100%;
		}
	}
</style>
