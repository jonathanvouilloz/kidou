<script lang="ts">
	import FilterBar from '$lib/components/ui/FilterBar.svelte';
	import TerminalCard from '$lib/components/project/TerminalCard.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	// Format username for display (replace spaces with underscores)
	const displayName = $derived(
		(data.profileUser.name || data.profileUser.username).replace(/\s+/g, '_').toUpperCase()
	);

	// Format date
	function formatDate(date: Date | null) {
		if (!date) return null;
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}

	// Stats
	const totalProjects = $derived(data.projects.length);
	const completedProjects = $derived(data.projects.filter(p => p.isCompleted).length);
	const buildingProjects = $derived(data.projects.filter(p => !p.isCompleted && p.progress > 0).length);

	// Filter states
	let selectedStatus = $state<'all' | 'done' | 'building' | 'waiting'>('all');
	let selectedDate = $state('all');

	// Extract unique year-month combinations from projects (uses pre-computed dateKey)
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const availableDates = $derived(() => {
		const dateMap = new Map<string, string>();

		for (const project of data.projects) {
			if (!dateMap.has(project.dateKey)) {
				const [year, month] = project.dateKey.split('-');
				const label = `${months[parseInt(month) - 1]} ${year}`;
				dateMap.set(project.dateKey, label);
			}
		}

		return Array.from(dateMap.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.map(([value, label]) => ({ value, label }));
	});

	// Optimized filtering using pre-computed dateKey
	let filteredProjects = $derived(
		data.projects.filter((p) => {
			// Status filter
			if (selectedStatus !== 'all') {
				if (selectedStatus === 'done' && p.progress !== 100) return false;
				if (selectedStatus === 'building' && (p.progress <= 0 || p.progress >= 100)) return false;
				if (selectedStatus === 'waiting' && p.progress !== 0) return false;
			}

			// Date filter (uses pre-computed dateKey - no Date parsing)
			if (selectedDate !== 'all' && p.dateKey !== selectedDate) return false;

			return true;
		})
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

		<!-- Bento Grid -->
		<div class="bento-grid">
			<!-- Info Panel (README style) -->
			<div class="panel info-panel" data-label="README.md">
				<div class="editor-menu">
					<span>File</span>
					<span>Edit</span>
					<span>View</span>
				</div>

				<div class="code-editor">
					<div class="code-line">
						<span class="line-num">01</span><span class="keyword">const</span> user = {'{'}</div>
					<div class="code-line">
						<span class="line-num">02</span>&nbsp;&nbsp;username: <span class="string">"{data.profileUser.username}"</span>,
					</div>
					<div class="code-line">
						<span class="line-num">03</span>&nbsp;&nbsp;name: {#if data.profileUser.name}<span class="string">"{data.profileUser.name}"</span>{:else}<span class="keyword">null</span>{/if},
					</div>
					<div class="code-line">
						<span class="line-num">04</span>&nbsp;&nbsp;joined: <span class="string">"{formatDate(data.profileUser.createdAt)}"</span>,
					</div>
					<div class="code-line">
						<span class="line-num">05</span>&nbsp;&nbsp;projects: <span class="var">{totalProjects}</span>,
					</div>
					<div class="code-line">
						<span class="line-num">06</span>&nbsp;&nbsp;completed: <span class="var">{completedProjects}</span>,
					</div>
					<div class="code-line">
						<span class="line-num">07</span>&nbsp;&nbsp;building: <span class="var">{buildingProjects}</span>
					</div>
					<div class="code-line">
						<span class="line-num">08</span>{'}'};
					</div>
				</div>
			</div>

			<!-- Links Panel -->
			<div class="panel links-panel" data-label="NETWORK_INTERFACES">
				<div class="no-links">
					<span>NO_EXTERNAL_LINKS</span>
				</div>

				<div class="stats-grid">
					<div class="stat-box">
						<div class="stat-val">{totalProjects}</div>
						<div class="stat-lbl">PROJECTS</div>
					</div>
					<div class="stat-box">
						<div class="stat-val">{completedProjects}</div>
						<div class="stat-lbl">COMPLETED</div>
					</div>
				</div>
			</div>
		</div>

		<FilterBar
			{selectedStatus}
			onchange={(s) => (selectedStatus = s)}
			availableDates={availableDates()}
			{selectedDate}
			ondatechange={(d) => (selectedDate = d)}
		/>

		<!-- Public projects list -->
		<section class="projects-section">
			{#if filteredProjects.length === 0}
				<div class="empty-state">
					<p>{m.publicProfile_noProjects()}</p>
				</div>
			{:else}
				<div class="terminals-grid">
					{#each filteredProjects as project (project.id)}
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
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
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

	/* Bento Grid */
	.bento-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 15px;
		margin-bottom: var(--space-6);
	}

	/* Panels */
	.panel {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 20px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}

	.panel::before {
		content: attr(data-label);
		position: absolute;
		top: 0;
		right: 0;
		background: var(--color-bg-elevated);
		color: #555;
		font-size: 10px;
		padding: 2px 8px;
		border-bottom-left-radius: 4px;
		border-left: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
	}

	/* Info Panel */
	.info-panel {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.editor-menu {
		display: flex;
		gap: 10px;
		font-size: 11px;
		color: #555;
	}

	.code-editor {
		font-size: 14px;
		line-height: 1.6;
		color: #ccc;
		background: #0f0f0f;
		padding: 15px;
		border-left: 3px solid var(--color-accent-dim, #008F11);
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.code-line {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.line-num {
		color: #444;
		margin-right: 15px;
		user-select: none;
	}

	.keyword { color: #ff5f56; }
	.string { color: #f1c40f; }
	.var { color: #27c93f; }

	/* Links Panel */
	.links-panel {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding-top: 30px;
	}

	.no-links {
		text-align: center;
		padding: 20px;
		color: #444;
		font-size: 12px;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: auto;
	}

	.stat-box {
		background: #111;
		padding: 10px;
		text-align: center;
		border: 1px dashed #333;
	}

	.stat-val {
		font-size: 20px;
		font-weight: bold;
		color: var(--color-text);
	}

	.stat-lbl {
		font-size: 10px;
		color: #666;
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

		.bento-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.profile-page {
			padding: 12px;
		}

		.user-title {
			font-size: 20px;
			word-break: break-word;
		}

		.title-row {
			flex-direction: column;
			gap: var(--space-1);
		}

		.terminals-grid {
			gap: 12px;
			width: 100%;
		}

		.empty-state {
			padding: var(--space-6);
		}

		.code-editor {
			font-size: 11px;
			padding: 10px;
		}
	}
</style>
