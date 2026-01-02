<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		user?: {
			username: string;
			avatarUrl?: string;
		} | null;
	}

	let { user = null }: Props = $props();
</script>

<header class="header">
	<div class="header-container">
		<a href="/" class="logo">
			kidou<span class="logo-cursor">_</span>
		</a>

		<nav class="nav">
			{#if user}
				<a href="/dashboard" class="nav-link">Dashboard</a>
				<div class="user-menu">
					<button class="user-button">
						{#if user.avatarUrl}
							<img src={user.avatarUrl} alt={user.username} class="user-avatar" />
						{:else}
							<span class="user-initial">{user.username[0].toUpperCase()}</span>
						{/if}
						<span class="user-name">{user.username}</span>
					</button>
				</div>
			{:else}
				<a href="/auth/login" class="nav-link">Connexion</a>
				<Button variant="primary" size="sm" onclick={() => (window.location.href = '/auth/register')}>
					Inscription
				</Button>
			{/if}
		</nav>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	.logo {
		font-size: var(--text-xl);
		font-weight: 500;
		color: var(--color-text);
		text-decoration: none;
	}

	.logo-cursor {
		color: var(--color-success);
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.nav {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.nav-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: color var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--color-text);
	}

	.user-menu {
		position: relative;
	}

	.user-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		transition: background var(--transition-fast);
	}

	.user-button:hover {
		background: var(--color-bg-hover);
	}

	.user-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
	}

	.user-initial {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-bg-hover);
		color: var(--color-text);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.user-name {
		color: var(--color-text);
		font-size: var(--text-sm);
	}
</style>
