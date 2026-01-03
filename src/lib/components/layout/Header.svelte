<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { signOut } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	interface Props {
		user?: {
			username: string;
			avatarUrl?: string | null;
		} | null;
	}

	let { user = null }: Props = $props();
	let menuOpen = $state(false);
	let mobileMenuOpen = $state(false);

	async function handleLogout() {
		menuOpen = false;
		mobileMenuOpen = false;
		await signOut();
		await goto('/');
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			menuOpen = false;
			mobileMenuOpen = false;
		}
	}
</script>

<svelte:window onclick={closeMenu} onkeydown={handleKeydown} />

<header class="header">
	<div class="header-container">
		<a href="/" class="logo">
			kidou<span class="logo-cursor">_</span>
		</a>

		<!-- Desktop nav -->
		<nav class="nav desktop-nav">
			{#if user}
				<a href="/dashboard" class="nav-link">Dashboard</a>
				<div class="user-menu">
					<button
						class="user-button"
						onclick={(e) => {
							e.stopPropagation();
							toggleMenu();
						}}
					>
						{#if user.avatarUrl}
							<img src={user.avatarUrl} alt={user.username} class="user-avatar" />
						{:else}
							<span class="user-initial">{user.username[0].toUpperCase()}</span>
						{/if}
						<span class="user-name">{user.username}</span>
					</button>

					{#if menuOpen}
						<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
						<div class="dropdown" onclick={(e) => e.stopPropagation()}>
							<a href="/{user.username}" class="dropdown-item">Mon profil</a>
							<button class="dropdown-item" onclick={handleLogout}>Déconnexion</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/auth/login" class="nav-link">Connexion</a>
				<Button variant="primary" size="sm" onclick={() => goto('/auth/register')}>
					Inscription
				</Button>
			{/if}
		</nav>

		<!-- Mobile hamburger -->
		<button
			class="hamburger"
			onclick={toggleMobileMenu}
			aria-label="Menu"
			aria-expanded={mobileMenuOpen}
		>
			<span class="hamburger-line" class:open={mobileMenuOpen}></span>
			<span class="hamburger-line" class:open={mobileMenuOpen}></span>
			<span class="hamburger-line" class:open={mobileMenuOpen}></span>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="mobile-overlay" onclick={closeMobileMenu}></div>
		<nav class="mobile-menu">
			{#if user}
				<a href="/dashboard" class="mobile-link" onclick={closeMobileMenu}>Dashboard</a>
				<a href="/{user.username}" class="mobile-link" onclick={closeMobileMenu}>Mon profil</a>
				<button class="mobile-link" onclick={handleLogout}>Déconnexion</button>
			{:else}
				<a href="/auth/login" class="mobile-link" onclick={closeMobileMenu}>Connexion</a>
				<a href="/auth/register" class="mobile-link" onclick={closeMobileMenu}>Inscription</a>
			{/if}
		</nav>
	{/if}
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

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: var(--space-2);
		min-width: 160px;
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.dropdown-item {
		display: block;
		width: 100%;
		padding: var(--space-2) var(--space-3);
		text-align: left;
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.dropdown-item:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}

	/* Hamburger button */
	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		padding: var(--space-2);
		background: none;
		border: none;
		cursor: pointer;
	}

	.hamburger-line {
		display: block;
		width: 24px;
		height: 2px;
		background: var(--color-text);
		transition: all 0.3s ease;
	}

	.hamburger-line.open:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.hamburger-line.open:nth-child(2) {
		opacity: 0;
	}

	.hamburger-line.open:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -5px);
	}

	/* Mobile overlay */
	.mobile-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 90;
	}

	/* Mobile menu */
	.mobile-menu {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--color-bg-elevated);
		border-bottom: 1px solid var(--color-border);
		padding: var(--space-4);
		z-index: 100;
	}

	.mobile-link {
		display: block;
		width: 100%;
		padding: var(--space-3);
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-base);
		text-align: left;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.mobile-link:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.desktop-nav {
			display: none;
		}

		.hamburger {
			display: flex;
		}

		.mobile-overlay {
			display: block;
		}

		.mobile-menu {
			display: flex;
			flex-direction: column;
		}
	}
</style>
