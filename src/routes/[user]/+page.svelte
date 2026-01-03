<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profileUser.name || data.profileUser.username} - Kidou</title>
	<meta
		name="description"
		content="Profil public de {data.profileUser.username} sur Kidou - Suivez la progression de ses projets"
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="{data.profileUser.name || data.profileUser.username} - Kidou" />
	<meta property="og:description" content="Découvrez les projets de {data.profileUser.username}" />
	<meta property="og:type" content="profile" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{data.profileUser.name || data.profileUser.username} - Kidou" />
</svelte:head>

<main class="profile-page">
	<div class="container">
		<!-- Header profil -->
		<header class="profile-header">
			<Avatar src={data.profileUser.avatarUrl} username={data.profileUser.username} size="lg" />
			<div class="profile-info">
				<h1 class="profile-name">
					{data.profileUser.name || data.profileUser.username}
				</h1>
				<p class="profile-username">@{data.profileUser.username}</p>
			</div>
		</header>

		<!-- Liste projets publics -->
		<section class="projects-section">
			<h2 class="section-title">Projets publics</h2>

			{#if data.projects.length === 0}
				<div class="empty-state">
					<p>Aucun projet public pour l'instant.</p>
				</div>
			{:else}
				<div class="projects-grid">
					{#each data.projects as project (project.id)}
						<ProjectCard
							name={project.name}
							slug={project.slug}
							username={data.profileUser.username}
							progress={project.progress}
							completedCount={project.completedMilestones}
							totalCount={project.totalMilestones}
							isCompleted={project.isCompleted ?? false}
						/>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</main>

<style>
	.profile-page {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.profile-name {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin: 0;
	}

	.profile-username {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin: 0;
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: 500;
		margin-bottom: var(--space-4);
		color: var(--color-text-secondary);
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-8);
		color: var(--color-text-muted);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}
</style>
