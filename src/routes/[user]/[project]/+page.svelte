<script lang="ts">
	import ShareButton from '$lib/components/share/ShareButton.svelte';
	import ShareModal from '$lib/components/share/ShareModal.svelte';

	let { data } = $props();

	// Active tab state
	let activeTab = $state<'output' | 'error' | 'commits'>('output');

	// Share modal state
	let shareModalOpen = $state(false);

	// Calculate days since creation
	const daysSinceCreation = $derived(
		Math.floor((Date.now() - new Date(data.project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
	);

	// Count PRD lines
	const prdLines = $derived(data.project.originalPrd?.split('\n').length ?? 0);

	// Project state for live preview styling
	const projectState = $derived(
		data.progress === 0 ? 'waiting' : data.progress >= 100 ? 'done' : 'building'
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
</script>

<svelte:head>
	<title>{data.project.name} | {data.owner.username} - Kidou</title>
	<meta
		name="description"
		content="{data.project.name} - {data.progress}% complete. {data.completedCount}/{data.totalCount} milestones."
	/>
	<meta property="og:title" content="{data.project.name} | {data.owner.username} - Kidou" />
	<meta
		property="og:description"
		content="Progression: {data.progress}% ({data.completedCount}/{data.totalCount} milestones)"
	/>
	<meta property="og:type" content="article" />
	<meta property="og:image" content="https://kidou.app/api/og/{data.owner.username}/{data.project.slug}" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.project.name} | {data.owner.username}" />
	<meta name="twitter:description" content="Progression: {data.progress}%" />
	<meta name="twitter:image" content="https://kidou.app/api/og/{data.owner.username}/{data.project.slug}" />
</svelte:head>

<main class="project-detail">
	<div class="dashboard-container">
		<!-- Header -->
		<header class="header-section">
			<div>
				<nav class="breadcrumb">
					<a href="/">root</a>
					<span class="separator">/</span>
					<a href="/community">projects</a>
					<span class="separator">/</span>
					<a href="/{data.owner.username}">{data.owner.username}</a>
					<span class="separator">/</span>
					<span class="current">{data.project.slug}</span>
				</nav>
				<h1 class="project-title">Project_{data.project.name.replace(/\s+/g, '_')}</h1>
			</div>
			<div class="header-actions">
				<ShareButton onclick={() => shareModalOpen = true} />
				{#if data.user?.id === data.owner.id}
					<a href="/project/{data.project.id}" class="edit-btn">Edit</a>
				{/if}
				<div class="status-badge" class:done={data.project.isCompleted}>
					{data.project.isCompleted ? 'SYSTEM READY' : 'BUILDING'}
				</div>
			</div>
		</header>

		<!-- Info Panel (README style) -->
		<div class="panel info-panel" data-label="README.md">
			<div class="editor-menu">
				<span>File</span>
				<span>Edit</span>
				<span>View</span>
			</div>

			<div class="code-editor">
				<div class="code-line">
					<span class="line-num">01</span><span class="keyword">const</span> project = {'{'}</div>
				<div class="code-line">
					<span class="line-num">02</span>&nbsp;&nbsp;name: <span class="string">"{data.project.name}"</span>,
				</div>
				<div class="code-line">
					<span class="line-num">03</span>&nbsp;&nbsp;owner: <a href="/{data.owner.username}" class="var owner-link">@{data.owner.username}</a>,
				</div>
				<div class="code-line">
					<span class="line-num">04</span>&nbsp;&nbsp;stack: {#if data.project.stack?.length}[<span class="string">{data.project.stack.map(s => `"${s}"`).join(', ')}</span>]{:else}<span class="keyword">null</span>{/if},
				</div>
				<div class="code-line">
					<span class="line-num">05</span>&nbsp;&nbsp;started: <span class="string">"{formatDate(data.project.createdAt)}"</span>,
				</div>
				<div class="code-line">
					<span class="line-num">06</span>&nbsp;&nbsp;deadline: {#if data.project.deadline}<span class="string">"{formatDate(data.project.deadline)}"</span>{:else}<span class="keyword">null</span>{/if},
				</div>
				<div class="code-line">
					<span class="line-num">07</span>&nbsp;&nbsp;status: <span class="keyword">{data.project.isCompleted ? 'true' : 'false'}</span>,
				</div>
				<div class="code-line code-line-desc">
					<span class="line-num">08</span>&nbsp;&nbsp;desc: {#if data.project.description}<span class="string desc-value">"{data.project.description}"</span>{:else}<span class="keyword">null</span>{/if}
				</div>
				<div class="code-line">
					<span class="line-num">09</span>{'}'};
				</div>
			</div>
		</div>

		<!-- Links Panel -->
		<div class="panel links-panel" data-label="NETWORK_INTERFACES">
			<a href="/{data.owner.username}" class="connection-card profile">
				<div class="conn-info">
					<span class="conn-label">Owner</span>
					<span class="conn-value">USER_PROFILE</span>
				</div>
				<div class="owner-info">
					<span class="owner-username">@{data.owner.username}</span>
					<span class="see-profile-hint">See profile ›</span>
				</div>
			</a>

			{#if data.project.liveUrl}
				<a href={data.project.liveUrl} target="_blank" rel="noopener" class="connection-card live-{projectState}">
					<div class="conn-info">
						<span class="conn-label">Deployment</span>
						<span class="conn-value">LIVE_PREVIEW</span>
					</div>
					<div class="status-light {projectState}"></div>
				</a>
			{/if}

			{#if data.project.githubUrl}
				<a href={data.project.githubUrl} target="_blank" rel="noopener" class="connection-card">
					<div class="conn-info">
						<span class="conn-label">Repository</span>
						<span class="conn-value">GITHUB_REPO</span>
					</div>
					<svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					</svg>
				</a>
			{/if}

			{#if !data.project.githubUrl && !data.project.liveUrl}
				<div class="no-links">
					<span>NO_EXTERNAL_LINKS</span>
				</div>
			{/if}

			<div class="stats-grid">
				<div class="stat-box">
					<div class="stat-val">{data.totalCount}</div>
					<div class="stat-lbl">MILESTONES</div>
				</div>
				<div class="stat-box">
					<div class="stat-val">{data.progress}%</div>
					<div class="stat-lbl">COMPLETE</div>
				</div>
				<div class="stat-box">
					<div class="stat-val">{daysSinceCreation}</div>
					<div class="stat-lbl">DAYS</div>
				</div>
				<div class="stat-box">
					<div class="stat-val">{prdLines}</div>
					<div class="stat-lbl">LINES</div>
				</div>
			</div>
		</div>

		<!-- Terminal Section -->
		<div class="panel terminal-section" data-label="BUILD_LOGS">
			<div class="terminal-tabs">
				<button class="tab" class:active={activeTab === 'output'} onclick={() => activeTab = 'output'}>output_log</button>
				<button class="tab" class:active={activeTab === 'error'} onclick={() => activeTab = 'error'}>error_log</button>
				<button class="tab" class:active={activeTab === 'commits'} onclick={() => activeTab = 'commits'}>commits</button>
			</div>

			<div class="terminal-content">
				{#if activeTab === 'output'}
					{#each data.milestones as milestone, i (milestone.id)}
						<div class="log-row" class:done={milestone.isCompleted}>
							<span class="log-id">{String(i + 1).padStart(2, '0')}</span>
							<span class="log-title">{milestone.title}</span>
							<span class="log-date">
								{milestone.completedAt ? formatDate(milestone.completedAt) : '--'}
							</span>
						</div>
					{/each}

					{#if data.project.isCompleted}
						<div class="terminal-success">
							> PROJECT_BUILD_SUCCESSFUL<br />
							> WAITING FOR NEXT COMMAND_<span class="cursor-blink"></span>
						</div>
					{:else}
						<div class="terminal-progress">
							> BUILD_IN_PROGRESS... {data.progress}%<br />
							> AWAITING_COMPLETION_<span class="cursor-blink"></span>
						</div>
					{/if}
				{:else}
					<div class="coming-soon">
						<span class="coming-soon-icon">⚙</span>
						<span class="coming-soon-text">COMING_SOON</span>
						<span class="coming-soon-desc">This feature is under development</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<ShareModal
	bind:open={shareModalOpen}
	username={data.owner.username}
	projectSlug={data.project.slug}
	projectName={data.project.name}
	progress={data.progress}
	completedCount={data.completedCount}
	totalCount={data.totalCount}
/>

<style>
	.project-detail {
		min-height: 100vh;
		padding: 40px;
	}

	/* Bento Grid Layout */
	.dashboard-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-4);
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto auto 1fr;
		gap: 15px;
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

	/* Header */
	.header-section {
		grid-column: 1 / -1;
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

	.project-title {
		font-size: 42px;
		margin: 0;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: -1px;
		text-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.edit-btn {
		background: transparent;
		border: 1px solid var(--color-text-muted);
		color: var(--color-text-muted);
		padding: 5px 15px;
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 1px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.edit-btn:hover {
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.status-badge {
		background: rgba(241, 196, 15, 0.1);
		border: 1px solid #f1c40f;
		color: #f1c40f;
		padding: 5px 15px;
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.status-badge.done {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--color-success);
		color: var(--color-success);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
		animation: pulse 3s infinite;
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
	}

	.code-line {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.code-line-desc {
		white-space: normal;
		overflow: visible;
	}

	.desc-value {
		word-break: break-word;
	}

	.line-num {
		color: #444;
		margin-right: 15px;
		user-select: none;
	}

	.keyword { color: #ff5f56; }
	.string { color: #f1c40f; }
	.var { color: #27c93f; }

	.owner-link {
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.owner-link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	.owner-info {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
	}

	.owner-username {
		color: var(--color-success);
		font-size: 14px;
	}

	.see-profile-hint {
		font-size: 11px;
		color: var(--color-success);
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.connection-card.profile:hover .see-profile-hint {
		opacity: 1;
	}

	
	/* Links Panel */
	.links-panel {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding-top: 30px;
	}

	.connection-card {
		background: #111;
		border: 1px solid #333;
		padding: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 0.2s;
		text-decoration: none;
		color: #fff;
		cursor: pointer;
	}

	.connection-card:hover {
		border-color: var(--color-success);
		transform: translateX(5px);
		background: #161616;
	}

	.connection-card.profile {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--color-success);
	}

	.connection-card.profile:hover {
		background: rgba(0, 255, 65, 0.15);
	}

	.connection-card.live-waiting {
		background: transparent;
		border-color: #ff5f56;
	}

	.connection-card.live-waiting:hover {
		background: rgba(255, 95, 86, 0.1);
		border-color: #ff5f56;
	}

	.connection-card.live-building {
		background: transparent;
		border-color: #f1c40f;
	}

	.connection-card.live-building:hover {
		background: rgba(241, 196, 15, 0.1);
		border-color: #f1c40f;
	}

	.connection-card.live-done {
		background: transparent;
		border-color: var(--color-success);
	}

	.connection-card.live-done:hover {
		background: rgba(0, 255, 65, 0.1);
		border-color: var(--color-success);
	}

	.conn-info {
		display: flex;
		flex-direction: column;
	}

	.conn-label {
		font-size: 11px;
		color: #666;
		text-transform: uppercase;
		margin-bottom: 4px;
	}

	.conn-value {
		font-size: 16px;
		font-weight: bold;
	}

	.status-light {
		width: 8px;
		height: 8px;
		background: #333;
		border-radius: 50%;
	}

	.status-light.waiting {
		background: #ff5f56;
		box-shadow: 0 0 8px #ff5f56;
	}

	.status-light.building {
		background: #f1c40f;
		box-shadow: 0 0 8px #f1c40f;
	}

	.status-light.done {
		background: var(--color-success);
		box-shadow: 0 0 8px var(--color-success);
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

	/* Terminal Section */
	.terminal-section {
		grid-column: 1 / -1;
		min-height: 300px;
		display: flex;
		flex-direction: column;
		padding: 0;
	}

	.terminal-tabs {
		display: flex;
		border-bottom: 1px solid var(--color-border);
		background: #111;
	}

	.tab {
		padding: 10px 20px;
		font-size: 12px;
		font-family: inherit;
		color: #666;
		cursor: pointer;
		border: none;
		border-right: 1px solid #222;
		background: transparent;
		transition: all 0.2s;
	}

	.tab:hover {
		color: #999;
	}

	.tab.active {
		background: var(--color-bg);
		color: var(--color-success);
		border-top: 2px solid var(--color-success);
	}

	.terminal-content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		font-size: 13px;
		background-image: linear-gradient(#111 1px, transparent 1px),
			linear-gradient(90deg, #111 1px, transparent 1px);
		background-size: 20px 20px;
		background-position: -1px -1px;
	}

	.coming-soon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 200px;
		gap: 10px;
		color: #444;
	}

	.coming-soon-icon {
		font-size: 32px;
		opacity: 0.5;
	}

	.coming-soon-text {
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 2px;
		color: #555;
	}

	.coming-soon-desc {
		font-size: 12px;
		color: #444;
	}

	.log-row {
		display: grid;
		grid-template-columns: 40px 1fr 100px;
		padding: 8px 0;
		border-bottom: 1px solid #1a1a1a;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.log-row:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.02);
	}

	.log-row.done {
		opacity: 1;
		color: var(--color-text);
	}

	.log-row.done .log-id {
		color: var(--color-success);
	}

	.log-id {
		color: #555;
	}

	.log-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.log-date {
		font-size: 11px;
		color: #555;
		text-align: right;
	}

	.terminal-success,
	.terminal-progress {
		margin-top: 20px;
		line-height: 1.6;
	}

	.terminal-success {
		color: var(--color-success);
	}

	.terminal-progress {
		color: #f1c40f;
	}

	.cursor-blink {
		display: inline-block;
		width: 8px;
		height: 14px;
		background: currentColor;
		animation: blink 1s infinite;
		vertical-align: middle;
	}

	/* Animations */
	@keyframes pulse {
		50% { opacity: 0.5; }
	}

	@keyframes blink {
		50% { opacity: 0; }
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor-blink,
		.status-badge.done {
			animation: none;
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.project-detail {
			padding: 20px;
		}

		.dashboard-container {
			grid-template-columns: 1fr;
		}

		.project-title {
			font-size: 28px;
		}

		.header-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 15px;
		}

		.terminal-section {
			grid-column: 1;
		}
	}

	@media (max-width: 480px) {
		.project-detail {
			padding: 15px;
		}

		.project-title {
			font-size: 22px;
		}

		.code-editor {
			font-size: 12px;
			padding: 10px;
		}

		.log-row {
			grid-template-columns: 25px 1fr 60px;
			font-size: 12px;
		}
	}
</style>
