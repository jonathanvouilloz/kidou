<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>Erreur {$page.status} - Kidou</title>
</svelte:head>

<main class="error-page">
	<div class="terminal">
		<div class="terminal-header">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
			<span class="terminal-title">error.sh</span>
		</div>
		<div class="terminal-body">
			<div class="line">
				<span class="prompt">$</span>
				<span class="command">curl -I kidou.io{$page.url.pathname}</span>
			</div>
			<div class="line output">
				<span class="status-code">{$page.status}</span>
				<span class="status-text">
					{#if $page.status === 404}
						Not Found
					{:else if $page.status === 500}
						Internal Server Error
					{:else if $page.status === 403}
						Forbidden
					{:else if $page.status === 401}
						Unauthorized
					{:else}
						Error
					{/if}
				</span>
			</div>
			<div class="line message">
				{#if $page.status === 404}
					La page demandée n'existe pas.
				{:else if $page.status === 500}
					Une erreur serveur s'est produite.
				{:else if $page.status === 403}
					Vous n'avez pas accès à cette ressource.
				{:else if $page.status === 401}
					Vous devez être connecté.
				{:else}
					{$page.error?.message || 'Une erreur est survenue.'}
				{/if}
			</div>
			<div class="line">
				<span class="prompt">$</span>
				<span class="cursor">_</span>
			</div>
		</div>
	</div>

	<div class="actions">
		<Button variant="primary" onclick={() => history.back()}>← Retour</Button>
		<Button variant="secondary" onclick={() => (window.location.href = '/')}>Accueil</Button>
	</div>
</main>

<style>
	.error-page {
		min-height: calc(100vh - 120px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8) var(--space-4);
		gap: var(--space-6);
	}

	.terminal {
		width: 100%;
		max-width: 500px;
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		font-family: var(--font-mono);
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: #27c93f; }

	.terminal-title {
		margin-left: auto;
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}

	.terminal-body {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.line {
		display: flex;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.prompt {
		color: var(--color-accent);
	}

	.command {
		color: var(--color-text);
	}

	.output {
		color: var(--color-error);
		font-weight: 500;
	}

	.status-code {
		color: var(--color-error);
	}

	.status-text {
		color: var(--color-text-muted);
	}

	.message {
		color: var(--color-text-secondary);
		padding-left: var(--space-4);
	}

	.cursor {
		color: var(--color-accent);
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% { opacity: 0; }
	}

	.actions {
		display: flex;
		gap: var(--space-3);
	}
</style>
