<script lang="ts">
	import TerminalCard from '$lib/components/project/TerminalCard.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	// Format username for display (replace spaces with underscores)
	const displayName = $derived(
		(data.profileUser.name || data.profileUser.username).replace(/\s+/g, '_').toUpperCase()
	);
</script>

<svelte:head>
	<title>{m.publicProfile_metaTitle({ username: data.profileUser.name || data.profileUser.username })}</title>
	<meta
		name="description"
		content="{data.profileUser.username} on Kidou - {m.publicProfile_metaDescription()}"
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="{data.profileUser.name || data.profileUser.username} - Kidou" />
	<meta property="og:description" content="{m.publicProfile_metaOgDescription({ username: data.profileUser.username })}" />
	<meta property="og:type" content="profile" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{data.profileUser.name || data.profileUser.username} - Kidou" />
</svelte:head>

<main class="profile-page">
	<div class="container">
		<!-- Header -->
		<header class="header-section">
			<div>
				<nav class="breadcrumb">
					<a href="/">root</a>
					<span class="separator">/</span>
					<a href="/community">projects</a>
					<span class="separator">/</span>
					<span class="current">{data.profileUser.username}</span>
				</nav>
				<div class="title-row">
					<h1 class="user-title">User_{displayName}</h1>
					<span class="user-handle">@{data.profileUser.username}</span>
				</div>
			</div>
			<div class="user-avatar-square">
				{#if data.profileUser.avatarUrl}
					<img src={data.profileUser.avatarUrl} alt={data.profileUser.username} />
				{:else}
					<span class="avatar-initial">{data.profileUser.username[0].toUpperCase()}</span>
				{/if}
			</div>
		</header>

		<!-- Public projects list -->
		<section class="projects-section">
			<h2 class="section-title">{m.publicProfile_publicProjects()}</h2>

			{#if data.projects.length === 0}
				<div class="empty-state">
					<p>{m.publicProfile_noProjects()}</p>
				</div>
			{:else}
				<div class="terminals-grid">
					{#each data.projects as project (project.id)}
						<TerminalCard
							name={project.name}
							slug={project.slug}
							username={data.profileUser.username}
							progress={project.progress}
							milestones={project.milestones}
							deadline={project.deadline}
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
		min-height: 100vh;
		padding: 40px;
	}

	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Header Section */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding-bottom: 10px;
		border-bottom: 1px solid #222;
		margin-bottom: 10px;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		margin-bottom: 5px;
	}

	.breadcrumb a {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.2s;
	}

	.breadcrumb a:hover {
		color: var(--color-success);
	}

	.breadcrumb .separator {
		color: #444;
	}

	.breadcrumb .current {
		color: var(--color-text-secondary);
	}

	.title-row {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
	}

	.user-title {
		font-size: 42px;
		margin: 0;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: -1px;
		text-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
	}

	.user-handle {
		color: var(--color-text-muted);
		font-size: 16px;
	}

	.user-avatar-square img {
		width: 64px;
		height: 64px;
		border-radius: 10%;
		object-fit: cover;
	}

	.user-avatar-square .avatar-initial {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		border-radius: 10%;
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		font-size: 24px;
		font-weight: 600;
	}

	.projects-section {
		margin-top: var(--space-6);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: 500;
		margin-bottom: var(--space-6);
		color: var(--color-text-secondary);
	}

	.terminals-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 40px;
	}

	.empty-state {
		text-align: center;
		padding: var(--space-8);
		color: var(--color-text-muted);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}

	@media (max-width: 900px) {
		.profile-page {
			padding: 20px;
		}

		.user-title {
			font-size: 28px;
		}

		.header-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 15px;
		}

		.terminals-grid {
			gap: 24px;
		}
	}

	@media (max-width: 480px) {
		.profile-page {
			padding: 15px;
		}

		.user-title {
			font-size: 22px;
		}

		.title-row {
			flex-direction: column;
			gap: var(--space-1);
		}

		.empty-state {
			padding: var(--space-6);
		}
	}
</style>
