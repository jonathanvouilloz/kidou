<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		isLoggedIn?: boolean;
	}

	let { isLoggedIn = false }: Props = $props();
</script>

<section class="final-cta">
	<div class="cta-content">
		<div class="cta-prompt">
			<span class="prompt">$</span>
			<span class="command">{m.landing_finalCta_command()}</span>
		</div>
		<h2 class="cta-title">{m.landing_finalCta_title()}</h2>
		<p class="cta-subtitle">{m.landing_finalCta_subtitle()}</p>
		<div class="cta-button">
			<Button onclick={() => goto(isLoggedIn ? '/dashboard' : '/project/new')}>
				{m.landing_ctaStart()}
			</Button>
		</div>
	</div>
</section>

<style>
	.final-cta {
		padding: var(--space-12) 0;
		text-align: center;
	}

	.cta-content {
		max-width: 500px;
		margin: 0 auto;
	}

	.cta-prompt {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.prompt {
		color: var(--color-success);
		margin-right: var(--space-2);
	}

	.command {
		color: var(--color-text-muted);
	}

	.cta-title {
		font-size: var(--text-xl);
		font-weight: 500;
		margin-bottom: var(--space-2);
	}

	.cta-subtitle {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		margin-bottom: var(--space-6);
	}

	.cta-button {
		display: inline-block;
	}

	@media (max-width: 600px) {
		.final-cta {
			padding: var(--space-8) 0;
		}

		.cta-title {
			font-size: var(--text-lg);
		}
	}
</style>
