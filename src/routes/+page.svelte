<script lang="ts">
	import { goto } from '$app/navigation';
	import TerminalProgress from '$lib/components/terminal/TerminalProgress.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ManifestoSection from '$lib/components/landing/ManifestoSection.svelte';
	import HowItWorksSection from '$lib/components/landing/HowItWorksSection.svelte';
	import PricingSection from '$lib/components/landing/PricingSection.svelte';
	import TestimonialTerminals from '$lib/components/landing/TestimonialTerminals.svelte';
	import FinalCTA from '$lib/components/landing/FinalCTA.svelte';
	import LastProjectsSection from '$lib/components/landing/LastProjectsSection.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const demoMilestones = [
		{ id: '1', title: 'Setup project', isCompleted: true },
		{ id: '2', title: 'Design system', isCompleted: true },
		{ id: '3', title: 'Auth system', isCompleted: false },
		{ id: '4', title: 'Core features', isCompleted: false },
		{ id: '5', title: 'Deploy', isCompleted: false }
	];
</script>

<svelte:head>
	<title>Kidou - Track your progress, build in public</title>
	<meta
		name="description"
		content="Visual progress dashboard for solopreneur developers. Build in public, simplified."
	/>
</svelte:head>

<main class="landing">
	<div class="container">
		<header class="hero">
			<h1 class="logo">kidou<span class="cursor">_</span></h1>
			<p class="tagline">Track your progress, build in public</p>
		</header>

		<section class="terminal-demo">
			<TerminalProgress milestones={demoMilestones} title="my-saas" />
		</section>

		<section class="cta">
			{#if data.user}
				<Button onclick={() => goto('/dashboard')}>{m.landing_ctaDashboard()}</Button>
			{:else}
				<Button onclick={() => goto('/project/new')}>{m.landing_ctaStart()}</Button>
				<p class="cta-secondary">
					{m.landing_alreadyAccount()} <a href="/auth/login">{m.landing_login()}</a>
				</p>
			{/if}
		</section>
	</div>

	<div class="sections-container">
		<ManifestoSection />

		<div id="how-it-works">
			<HowItWorksSection />
		</div>
	</div>

	<div id="explore" class="projects-section-wrapper">
		<LastProjectsSection projects={data.latestProjects} />
	</div>

	<div class="sections-container">
		<div id="pricing">
			<PricingSection isLoggedIn={!!data.user} />
		</div>

		<div id="testimonials">
			<TestimonialTerminals />
		</div>

		<FinalCTA isLoggedIn={!!data.user} />
	</div>
</main>

<Footer />

<style>
	.landing {
		min-height: calc(100vh - 60px);
		padding: var(--space-8) var(--space-4);
	}

	.landing::before {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: -1;
		opacity: 0.04;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
	}

	.container {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
	}

	.hero {
		position: relative;
		text-align: center;
		margin-bottom: var(--space-8);
		width: 100%;
	}

	.logo {
		font-size: var(--text-3xl);
		font-weight: 500;
		margin-bottom: var(--space-2);
	}

	.logo .cursor {
		color: var(--color-success);
		animation: blink 1s step-end infinite;
	}

	.tagline {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
	}

	.terminal-demo {
		margin-bottom: var(--space-8);
		width: 100%;
	}

	.cta {
		text-align: center;
		margin-bottom: var(--space-12);
	}

	.cta-secondary {
		margin-top: var(--space-3);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.cta-secondary a {
		color: var(--color-text);
		text-decoration: underline;
	}

	.sections-container {
		max-width: 700px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-20);
		padding: var(--space-16) 0;
	}

	.projects-section-wrapper {
		max-width: 1400px;
		margin: 0 auto;
		padding: var(--space-16) var(--space-4);
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (max-width: 600px) {
		.container {
			min-height: calc(100vh - 300px);
		}

		.sections-container {
			gap: var(--space-12);
		}
	}
</style>
