<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section class="how-it-works">
	<h2 class="section-title">{m.landing_howItWorks_title()}</h2>

	<div class="steps">
		<div class="step">
			<div class="step-text">
				<span class="step-number">01</span>
				<h3 class="step-title">{m.landing_howItWorks_step1Title()}</h3>
				<p class="step-desc">{m.landing_howItWorks_step1Desc()}</p>
			</div>
			<div class="step-terminal">
				<div class="step-command">
					<span class="prompt">$</span>
					<span class="cmd">kidou upload</span>
					<span class="arg">my-prd.md</span>
				</div>
				<div class="step-output">
					<span class="output-prefix">→</span>
					<span class="output-text">{m.landing_howItWorks_step1Output()}</span>
				</div>
			</div>
		</div>

		<div class="step">
			<div class="step-text">
				<span class="step-number">02</span>
				<h3 class="step-title">{m.landing_howItWorks_step2Title()}</h3>
				<p class="step-desc">{m.landing_howItWorks_step2Desc()}</p>
			</div>
			<div class="step-terminal">
				<div class="step-command">
					<span class="prompt">$</span>
					<span class="cmd">kidou track</span>
					<span class="flag">--project</span>
					<span class="arg">my-saas</span>
				</div>
				<div class="step-output">
					<span class="output-prefix">→</span>
					<span class="output-text">{m.landing_howItWorks_step2Output()}</span>
				</div>
			</div>
		</div>

		<div class="step">
			<div class="step-text">
				<span class="step-number">03</span>
				<h3 class="step-title">{m.landing_howItWorks_step3Title()}</h3>
				<p class="step-desc">{m.landing_howItWorks_step3Desc()}</p>
			</div>
			<div class="step-terminal">
				<div class="step-command">
					<span class="prompt">$</span>
					<span class="cmd">kidou share</span>
					<span class="flag">--public</span>
				</div>
				<div class="step-output">
					<span class="output-prefix">→</span>
					<span class="output-text">{m.landing_howItWorks_step3Output()}</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.how-it-works {
		padding: var(--space-12) 0;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: 400;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: var(--space-10);
		text-align: center;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-8);
	}

	.step {
		text-align: center;
		display: flex;
		flex-direction: column;
	}

	.step-text {
		margin-bottom: var(--space-5);
	}

	.step-number {
		display: inline-block;
		color: var(--color-success);
		font-size: var(--text-sm);
		font-weight: 600;
		font-family: var(--font-mono);
		margin-bottom: var(--space-3);
	}

	.step-title {
		font-size: var(--text-base);
		font-weight: 500;
		margin-bottom: var(--space-2);
	}

	.step-desc {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.step-terminal {
		background: #0a0a0a;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.step-command {
		padding: var(--space-4);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		font-size: var(--text-sm);
		flex: 1;
		align-items: center;
	}

	.prompt {
		color: var(--color-success);
	}

	.cmd {
		color: var(--color-text);
	}

	.flag {
		color: var(--color-warning);
	}

	.arg {
		color: var(--color-text-secondary);
	}

	.step-output {
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg-elevated);
		border-top: 1px solid var(--color-border);
		display: flex;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.output-prefix {
		color: var(--color-success);
	}

	.output-text {
		color: var(--color-text-muted);
	}

	@media (max-width: 768px) {
		.how-it-works {
			padding: var(--space-8) 0;
		}

		.steps {
			grid-template-columns: 1fr;
			gap: var(--space-8);
			max-width: 400px;
			margin: 0 auto;
		}
	}
</style>
