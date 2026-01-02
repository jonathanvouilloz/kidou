<script lang="ts">
	// Landing page - to be implemented
</script>

<svelte:head>
	<title>Kidou - Track your progress, build in public</title>
	<meta name="description" content="Visual progress dashboard for solopreneur developers. Build in public, simplified." />
</svelte:head>

<main class="landing">
	<div class="container">
		<header class="hero">
			<h1 class="logo">kidou<span class="cursor">_</span></h1>
			<p class="tagline">Track your progress, build in public</p>
		</header>

		<section class="terminal-demo">
			<div class="terminal">
				<div class="terminal-header">
					<span class="terminal-dot red"></span>
					<span class="terminal-dot yellow"></span>
					<span class="terminal-dot green"></span>
					<span class="terminal-title">kidou — 40%</span>
				</div>
				<div class="terminal-body">
					<div class="terminal-line completed">
						<span class="line-number">01</span>
						<span class="line-status">✓</span>
						<span class="line-text">Setup project</span>
					</div>
					<div class="terminal-line completed">
						<span class="line-number">02</span>
						<span class="line-status">✓</span>
						<span class="line-text">Design system</span>
					</div>
					<div class="terminal-line">
						<span class="line-number">03</span>
						<span class="line-status">○</span>
						<span class="line-text">Auth system</span>
					</div>
					<div class="terminal-line">
						<span class="line-number">04</span>
						<span class="line-status">○</span>
						<span class="line-text">Core features</span>
					</div>
					<div class="terminal-line">
						<span class="line-number">05</span>
						<span class="line-status">○</span>
						<span class="line-text">Deploy</span>
					</div>
					<div class="terminal-cursor">
						<span class="cursor-blink">█</span>
					</div>
				</div>
				<div class="terminal-footer">
					<span class="progress-bar">
						<span class="progress-fill" style="width: 40%"></span>
					</span>
					<span class="progress-text">2/5</span>
				</div>
			</div>
		</section>

		<section class="cta">
			<p>Coming soon</p>
		</section>
	</div>
</main>

<style>
	.landing {
		min-height: 100vh;
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
		text-align: center;
		margin-bottom: var(--space-12);
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
		margin-bottom: var(--space-12);
	}

	.cta {
		text-align: center;
		color: var(--color-text-muted);
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
