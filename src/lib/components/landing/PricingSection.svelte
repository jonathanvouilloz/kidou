<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		isLoggedIn?: boolean;
	}

	let { isLoggedIn = false }: Props = $props();
</script>

<section class="pricing">
	<h2 class="section-title">{m.landing_pricing_title()}</h2>

	<div class="pricing-grid">
		<div class="pricing-card">
			<div class="pricing-header">
				<span class="plan-name">{m.landing_pricing_freeName()}</span>
				<span class="plan-price">$0</span>
				<span class="plan-period">{m.landing_pricing_forever()}</span>
			</div>
			<div class="pricing-body">
				<ul class="features-list">
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_freeProjects()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_freeAI()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_publicProfile()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_manualMilestones()}</span>
					</li>
				</ul>
			</div>
			<div class="pricing-footer">
				<Button
					variant="secondary"
					onclick={() => goto(isLoggedIn ? '/dashboard' : '/auth/register')}
				>
					{m.landing_pricing_freeButton()}
				</Button>
			</div>
		</div>

		<div class="pricing-card featured">
			<div class="pricing-badge">{m.landing_pricing_popular()}</div>
			<div class="pricing-header">
				<span class="plan-name">{m.landing_pricing_proName()}</span>
				<span class="plan-price">$5</span>
				<span class="plan-period">{m.landing_pricing_perMonth()}</span>
			</div>
			<div class="pricing-body">
				<ul class="features-list">
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_proProjects()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_proAI()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_publicProfile()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_manualMilestones()}</span>
					</li>
					<li class="feature">
						<span class="check">✓</span>
						<span>{m.landing_pricing_prioritySupport()}</span>
					</li>
				</ul>
			</div>
			<div class="pricing-footer">
				<span class="coming-soon">Coming soon</span>
			</div>
		</div>
	</div>
</section>

<style>
	.pricing {
		padding: var(--space-8) 0;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: 400;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: var(--space-8);
		text-align: center;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		max-width: 600px;
		margin: 0 auto;
	}

	.pricing-card {
		background: #0a0a0a;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}

	.pricing-card.featured {
		border-color: var(--color-success);
	}

	.pricing-badge {
		position: absolute;
		top: 0;
		right: 0;
		background: var(--color-success);
		color: var(--color-bg);
		font-size: var(--text-xs);
		font-weight: 500;
		padding: var(--space-1) var(--space-2);
		border-bottom-left-radius: var(--radius-sm);
	}

	.pricing-header {
		padding: var(--space-4);
		text-align: center;
		border-bottom: 1px solid var(--color-border);
	}

	.plan-name {
		display: block;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}

	.plan-price {
		display: block;
		font-size: var(--text-2xl);
		font-weight: 600;
		font-family: var(--font-mono);
	}

	.featured .plan-price {
		color: var(--color-success);
	}

	.plan-period {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-1);
	}

	.pricing-body {
		padding: var(--space-4);
		flex: 1;
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.feature {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-2);
	}

	.feature:last-child {
		margin-bottom: 0;
	}

	.check {
		color: var(--color-success);
		font-family: var(--font-mono);
	}

	.pricing-footer {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.pricing-footer :global(button) {
		width: 100%;
	}

	.coming-soon {
		display: block;
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		padding: var(--space-2) 0;
	}

	@media (max-width: 600px) {
		.pricing-grid {
			grid-template-columns: 1fr;
		}

		.pricing-card.featured {
			order: -1;
		}
	}
</style>
