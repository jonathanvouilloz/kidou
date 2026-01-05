<script lang="ts">
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/Header.svelte';
	import DashboardFooter from '$lib/components/layout/DashboardFooter.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { setUser } from '$lib/stores/user';
	import { toast, hideToast } from '$lib/stores/toast';
	import { page } from '$app/stores';

	let { data, children } = $props();

	// Sync user store avec donnees SSR
	$effect(() => {
		setUser(data.user);
	});

	// Ne pas afficher Header/Footer sur les pages auth
	const isAuthPage = $derived($page.url.pathname.startsWith('/auth'));
	// Ne pas afficher le DashboardFooter sur la landing (elle a son propre footer)
	const isLandingPage = $derived($page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="theme-color" content="#0D0D0D" />
</svelte:head>

{#if !isAuthPage}
	<Header user={data.user} />
{/if}

{@render children()}

{#if data.user && !isAuthPage && !isLandingPage}
	<DashboardFooter username={data.user.username} />
{/if}

{#if $toast.visible}
	<div class="toast-container">
		<Toast message={$toast.message} type={$toast.type} onclose={hideToast} />
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-6);
		right: var(--space-6);
		z-index: 1000;
	}
</style>
