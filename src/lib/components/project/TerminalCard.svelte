<script lang="ts">
	interface Milestone {
		id: string;
		title: string;
		isCompleted: boolean;
	}

	interface Props {
		name: string;
		slug: string;
		username: string;
		progress: number;
		milestones: Milestone[];
		deadline?: Date | null;
		isCompleted?: boolean;
		href?: string;
	}

	let {
		name,
		slug,
		username,
		progress,
		milestones,
		deadline,
		isCompleted = false,
		href: customHref
	}: Props = $props();

	const href = $derived(customHref ?? `/${username}/${slug}`);

	// Determine state: waiting (0%), building (1-99%), done (100%)
	const state = $derived(
		progress === 0 ? 'waiting' : progress >= 100 ? 'done' : 'building'
	);

	// Format deadline
	const formattedDeadline = $derived(
		deadline ? new Date(deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : null
	);

	// Find first in-progress milestone (first incomplete after completed ones)
	const processingIndex = $derived(
		milestones.findIndex((m, i) => !m.isCompleted && (i === 0 || milestones[i - 1].isCompleted))
	);

	// Show overlay state
	let showOverlay = $state(true);

	function viewLogs() {
		showOverlay = false;
	}
</script>

<a {href} class="terminal-link">
	<div class="terminal-window state-{state}" class:show-overlay={isCompleted && showOverlay}>
		<div class="terminal-header">
			<div class="dots">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
			<div class="meta-info">
				<span class="meta-name">{name.toUpperCase().replace(/\s+/g, '_')}</span>
				{#if formattedDeadline}
					<span>DEADLINE: {formattedDeadline}</span>
				{/if}
				<span class="meta-status">{progress}%</span>
			</div>
		</div>

		<div class="terminal-body">
			{#if state === 'waiting'}
				<div class="idle-message">
					SYSTEM_IDLE<br />
					WAITING_FOR_INIT_SEQUENCE...
				</div>
			{:else}
				{#each milestones as milestone, i (milestone.id)}
					<div
						class="log-item"
						class:done={milestone.isCompleted}
						class:processing={i === processingIndex}
					>
						{#if milestone.isCompleted}
							<span class="icon">✔</span>
						{:else if i === processingIndex}
							<span class="icon spinner">✶</span>
						{:else}
							<span class="icon">○</span>
						{/if}
						<span class="log-text">{milestone.title}</span>
					</div>
				{/each}
			{/if}
		</div>

		{#if isCompleted && showOverlay}
			<div class="overlay-done">
				<div class="overlay-title">DONE</div>
				<button class="overlay-btn" onclick={(e) => { e.preventDefault(); viewLogs(); }}>[ VIEW LOGS ]</button>
			</div>
		{/if}

		<div class="terminal-footer">
			{#if state === 'waiting'}
				<span>> await start_command</span>
			{:else if state === 'building'}
				<span class="building-text">> building... in progress</span>
			{:else}
				<span class="done-text">> cd /public && view_project</span>
			{/if}
			<span class="cursor"></span>
			<span class="see-project">See project ›</span>
		</div>
	</div>
</a>

<style>
	.terminal-link {
		display: block;
		text-decoration: none;
		color: inherit;
		width: 100%;
		max-width: 500px;
	}

	.terminal-window {
		--c-wait: #666666;
		--c-build: #f1c40f;
		--c-done: #00ff41;

		width: 100%;
		height: 380px;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		transition: transform 0.2s, border-color 0.2s;
		cursor: pointer;
	}

	.terminal-window:hover {
		border-color: #555;
		transform: translateY(-2px);
	}

	/* Header */
	.terminal-header {
		background: var(--color-bg-elevated);
		height: 32px;
		display: flex;
		align-items: center;
		padding: 0 12px;
		border-bottom: 1px solid var(--color-border);
		justify-content: space-between;
		flex-shrink: 0;
	}

	.dots {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #333;
		transition: background 0.2s;
	}

	.terminal-window:hover .dot:nth-child(1) { background: #ff5f56; }
	.terminal-window:hover .dot:nth-child(2) { background: #ffbd2e; }
	.terminal-window:hover .dot:nth-child(3) { background: #27c93f; }

	.meta-info {
		font-size: 11px;
		color: #666;
		display: flex;
		gap: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}

	.meta-name {
		color: var(--color-text-muted);
	}

	/* Status colors */
	.state-building .meta-status { color: var(--c-build); }
	.state-done .meta-status {
		color: var(--c-done);
		text-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
	}

	/* Body */
	.terminal-body {
		flex: 1;
		padding: 15px;
		overflow-y: auto;
		font-size: 13px;
		color: var(--color-text);
		position: relative;
	}

	.terminal-body::-webkit-scrollbar { width: 6px; }
	.terminal-body::-webkit-scrollbar-track { background: var(--color-bg); }
	.terminal-body::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
	.terminal-body::-webkit-scrollbar-thumb:hover { background: #555; }

	.idle-message {
		color: #444;
		margin-top: 100px;
		text-align: center;
		line-height: 1.6;
	}

	/* Log items */
	.log-item {
		display: flex;
		gap: 10px;
		margin-bottom: 6px;
		opacity: 0.4;
	}

	.log-item.done {
		opacity: 1;
	}

	.log-item.done .icon {
		color: var(--c-done);
	}

	.log-item.processing {
		opacity: 1;
		color: var(--c-build);
	}

	.log-item.processing .icon {
		animation: spin 1s infinite steps(8);
	}

	.icon {
		width: 16px;
		text-align: center;
		flex-shrink: 0;
	}

	.log-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Footer */
	.terminal-footer {
		height: 36px;
		background: #0d0d0d;
		border-top: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		padding: 0 12px;
		font-size: 12px;
		color: #555;
		flex-shrink: 0;
		transition: background 0.2s;
	}

	.terminal-link:hover .terminal-footer {
		background: #161616;
	}

	.state-done .terminal-footer {
		color: var(--c-done);
		background: rgba(0, 255, 65, 0.03);
	}

	.terminal-link:hover .state-done .terminal-footer {
		background: rgba(0, 255, 65, 0.1);
	}

	.building-text {
		color: var(--c-build);
	}

	.done-text {
		color: var(--c-done);
	}

	.cursor {
		display: inline-block;
		width: 6px;
		height: 14px;
		background: var(--c-wait);
		vertical-align: middle;
		animation: blink 1s infinite;
		margin-left: 4px;
	}

	.state-building .cursor { background: var(--c-build); }
	.state-done .cursor { background: var(--c-done); }

	.see-project {
		margin-left: auto;
		color: #666;
		font-size: 11px;
		transition: color 0.2s;
	}

	.terminal-link:hover .see-project {
		color: #fff;
	}

	/* Overlay */
	.overlay-done {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(10, 10, 10, 0.9);
		backdrop-filter: blur(4px);
		border: 1px solid var(--c-done);
		padding: 20px 40px;
		text-align: center;
		z-index: 10;
		box-shadow: 0 0 30px rgba(0, 255, 65, 0.15);
		display: none;
	}

	.show-overlay .overlay-done {
		display: block;
	}

	.overlay-title {
		font-size: 32px;
		color: var(--c-done);
		margin: 0;
		font-weight: 900;
		letter-spacing: 2px;
	}

	.overlay-btn {
		margin-top: 10px;
		background: none;
		border: 1px solid #444;
		color: #888;
		font-family: inherit;
		font-size: 10px;
		cursor: pointer;
		padding: 4px 10px;
		transition: all 0.2s;
	}

	.overlay-btn:hover {
		border-color: var(--c-done);
		color: var(--c-done);
	}

	/* Animations */
	@keyframes blink {
		50% { opacity: 0; }
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor,
		.log-item.processing .icon {
			animation: none;
		}
	}

	/* Mobile */
	@media (max-width: 480px) {
		.terminal-window {
			height: 320px;
		}

		.terminal-body {
			font-size: 12px;
		}

		.meta-info {
			font-size: 10px;
			gap: 8px;
		}
	}
</style>
