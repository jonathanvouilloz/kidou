<script lang="ts">
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/Header.svelte';
	import { setUser } from '$lib/stores/user';
	import { page } from '$app/stores';

	let { data, children } = $props();

	// Sync user store avec donnees SSR
	$effect(() => {
		setUser(data.user);
	});

	// Ne pas afficher Header sur les pages auth
	const isAuthPage = $derived($page.url.pathname.startsWith('/auth'));
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="theme-color" content="#0D0D0D" />
</svelte:head>

{#if !isAuthPage}
	<Header user={data.user} />
{/if}

{@render children()}
