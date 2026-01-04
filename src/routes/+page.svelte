<script lang="ts">
	import { goto } from '$app/navigation';
	import TerminalProgress from '$lib/components/terminal/TerminalProgress.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import PulsatingCircles from '$lib/components/ui/PulsatingCircles.svelte';
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
			<PulsatingCircles />
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
				<Button onclick={() => goto('/auth/register')}>{m.landing_ctaStart()}</Button>
				<p class="cta-secondary">
					{m.landing_alreadyAccount()} <a href="/auth/login">{m.landing_login()}</a>
				</p>
			{/if}
		</section>

		<section class="features">
			<div class="feature">
				<span class="feature-icon">01</span>
				<h3>{m.landing_feature1Title()}</h3>
				<p>{m.landing_feature1Desc()}</p>
			</div>
			<div class="feature">
				<span class="feature-icon">02</span>
				<h3>{m.landing_feature2Title()}</h3>
				<p>{m.landing_feature2Desc()}</p>
			</div>
			<div class="feature">
				<span class="feature-icon">03</span>
				<h3>{m.landing_feature3Title()}</h3>
				<p>{m.landing_feature3Desc()}</p>
			</div>
		</section>
	</div>
</main>

<Footer />

<style>
	.landing {
		min-height: calc(100vh - 60px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 600px;
		width: 100%;
	}

	.hero {
		position: relative;
		text-align: center;
		margin-bottom: var(--space-8);
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

	.features {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		margin-top: var(--space-8);
	}

	.feature {
		text-align: center;
		padding: var(--space-4);
	}

	.feature-icon {
		display: inline-block;
		font-size: var(--text-xs);
		color: var(--color-success);
		margin-bottom: var(--space-2);
	}

	.feature h3 {
		font-size: var(--text-sm);
		font-weight: 500;
		margin-bottom: var(--space-1);
	}

	.feature p {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		line-height: 1.4;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (max-width: 600px) {
		.features {
			grid-template-columns: 1fr;
			gap: var(--space-6);
		}
	}
</style>
