<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import { signOut } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		user?: {
			username: string;
			avatarUrl?: string | null;
		} | null;
		isLandingPage?: boolean;
	}

	let { user = null, isLandingPage = false }: Props = $props();
	let menuOpen = $state(false);
	let mobileMenuOpen = $state(false);
	let loggingOut = $state(false);

	async function handleLogout() {
		loggingOut = true;
		menuOpen = false;
		mobileMenuOpen = false;
		await signOut();
		showToast('Logged out successfully', 'success');
		await invalidateAll();
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
			<img src="/kidoulogo.png" alt="Kidou" class="logo-icon" />
			kidou<span class="logo-cursor">_</span>
		</a>

		<!-- Desktop nav -->
		<nav class="nav desktop-nav">
			{#if !user && isLandingPage}
				<a href="#how-it-works" class="nav-link">How it works</a>
				<a href="#explore" class="nav-link">{m.nav_explore()}</a>
				<a href="#pricing" class="nav-link">Pricing</a>
				<a href="#testimonials" class="nav-link">Testimonials</a>
			{:else}
				<a href="/community" class="nav-link">{m.nav_explore()}</a>
				{#if user}
					<a href="/dashboard" class="nav-link">{m.nav_dashboard()}</a>
					<a href="/{user.username}" class="nav-link">My Page</a>
				{/if}
			{/if}
		</nav>

		<div class="nav-right desktop-nav">
			{#if user}
				<Button variant="ghost" size="sm" onclick={() => goto('/project/new')}>
					Init project
				</Button>
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
							<a href="/settings" class="dropdown-item">{m.nav_settings()}</a>
							<button class="dropdown-item" onclick={handleLogout} disabled={loggingOut}>
								{#if loggingOut}
									<Loader size="sm" /> Logging out...
								{:else}
									{m.nav_logout()}
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/auth/login" class="nav-link">{m.nav_login()}</a>
				<Button variant="primary" size="sm" onclick={() => goto('/auth/register')}>
					{m.nav_register()}
				</Button>
			{/if}
		</div>

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
			{#if !user && isLandingPage}
				<a href="#how-it-works" class="mobile-link" onclick={closeMobileMenu}>How it works</a>
				<a href="#explore" class="mobile-link" onclick={closeMobileMenu}>{m.nav_explore()}</a>
				<a href="#pricing" class="mobile-link" onclick={closeMobileMenu}>Pricing</a>
				<a href="#testimonials" class="mobile-link" onclick={closeMobileMenu}>Testimonials</a>
				<div class="mobile-divider"></div>
				<a href="/auth/login" class="mobile-link" onclick={closeMobileMenu}>{m.nav_login()}</a>
				<a href="/auth/register" class="mobile-link" onclick={closeMobileMenu}>{m.nav_register()}</a>
			{:else if user}
				<a href="/community" class="mobile-link" onclick={closeMobileMenu}>{m.nav_explore()}</a>
				<a href="/dashboard" class="mobile-link" onclick={closeMobileMenu}>{m.nav_dashboard()}</a>
				<a href="/{user.username}" class="mobile-link" onclick={closeMobileMenu}>My Page</a>
				<a href="/project/new" class="mobile-link" onclick={closeMobileMenu}>Init project</a>
				<a href="/settings" class="mobile-link" onclick={closeMobileMenu}>{m.nav_settings()}</a>
				<button class="mobile-link" onclick={handleLogout} disabled={loggingOut}>
					{#if loggingOut}
						<Loader size="sm" /> Logging out...
					{:else}
						{m.nav_logout()}
					{/if}
				</button>
			{:else}
				<a href="/community" class="mobile-link" onclick={closeMobileMenu}>{m.nav_explore()}</a>
				<a href="/auth/login" class="mobile-link" onclick={closeMobileMenu}>{m.nav_login()}</a>
				<a href="/auth/register" class="mobile-link" onclick={closeMobileMenu}>{m.nav_register()}</a>
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
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-xl);
		font-weight: 500;
		color: var(--color-text);
		text-decoration: none;
	}

	.logo-icon {
		width: 36px;
		height: 36px;
		object-fit: contain;
	}

	.logo-cursor {
		color: var(--color-success);
		animation: blink 1.1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
	}

	.nav-right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
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

	.mobile-divider {
		height: 1px;
		background: var(--color-border);
		margin: var(--space-2) 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.header-container {
			display: flex;
			justify-content: space-between;
		}

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

	@media (max-width: 480px) {
		.header-container {
			padding: var(--space-3);
		}

		.logo {
			font-size: var(--text-lg);
		}
	}
</style>
