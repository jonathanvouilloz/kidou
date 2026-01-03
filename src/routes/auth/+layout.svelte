<script lang="ts">
	let { children } = $props();
</script>

<main class="auth-layout">
	<div class="auth-container">
		<a href="/" class="logo">kidou<span class="cursor">_</span></a>
		{@render children()}
	</div>
</main>

<style>
	.auth-layout {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
	}

	.auth-container {
		width: 100%;
		max-width: 400px;
	}

	.logo {
		display: block;
		font-size: var(--text-2xl);
		font-weight: 500;
		text-align: center;
		margin-bottom: var(--space-8);
		color: var(--color-text);
		text-decoration: none;
	}

	.cursor {
		color: var(--color-success);
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
