<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import TerminalProgress from '$lib/components/terminal/TerminalProgress.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.name} | {data.owner.username} - Kidou</title>
	<meta
		name="description"
		content="{data.project.name} - {data.progress}% complete. {data.completedCount}/{data.totalCount} milestones."
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="{data.project.name} | {data.owner.username} - Kidou" />
	<meta
		property="og:description"
		content="Progression: {data.progress}% ({data.completedCount}/{data.totalCount} milestones)"
	/>
	<meta property="og:type" content="article" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{data.project.name} | {data.owner.username}" />
	<meta name="twitter:description" content="Progression: {data.progress}%" />
</svelte:head>

<main class="public-project-page">
	<div class="container">
		<!-- Navigation retour profil -->
		<nav class="breadcrumb">
			<a href="/{data.owner.username}" class="back-link">
				<span class="back-arrow">&larr;</span>
				{data.owner.username}
			</a>
		</nav>

		<!-- Header projet -->
		<header class="project-header">
			<div class="project-info">
				<div class="project-title-row">
					<h1 class="project-name">{data.project.name}</h1>
					{#if data.project.isCompleted}
						<Badge variant="success">Terminé</Badge>
					{:else}
						<Badge variant="warning">En cours</Badge>
					{/if}
				</div>

				<div class="project-meta">
					<a href="/{data.owner.username}" class="owner-link">
						<Avatar src={data.owner.avatarUrl} username={data.owner.username} size="sm" />
						<span>@{data.owner.username}</span>
					</a>
					<span class="separator">|</span>
					<span class="progress-text">{data.progress}% complete</span>
				</div>
			</div>
		</header>

		<!-- Terminal avec milestones -->
		<section class="terminal-section">
			<TerminalProgress milestones={data.milestones} title={data.project.name} showCursor={false} />
		</section>
	</div>
</main>

<style>
	.public-project-page {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	.breadcrumb {
		margin-bottom: var(--space-4);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.back-link:hover {
		color: var(--color-text);
		background: var(--color-bg-hover);
	}

	.back-arrow {
		font-size: var(--text-base);
	}

	.project-header {
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
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

	.project-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.owner-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
	}

	.owner-link:hover {
		color: var(--color-text);
	}

	.separator {
		color: var(--color-text-muted);
	}

	.progress-text {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.terminal-section {
		margin-top: var(--space-6);
	}
</style>
