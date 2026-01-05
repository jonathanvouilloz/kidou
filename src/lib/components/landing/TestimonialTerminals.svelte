<script lang="ts">
	import testimonials from '$lib/data/testimonials.json';
	import * as m from '$lib/paraglide/messages';

	let activeTab = $state(0);

	function selectTab(index: number) {
		activeTab = index;
	}
</script>

<section class="testimonials">
	<h2 class="section-title">{m.landing_testimonials_title()}</h2>

	<div class="terminal-container">
		<div class="terminal-tabs">
			{#each testimonials as testimonial, index}
				<button
					class="tab"
					class:active={activeTab === index}
					onclick={() => selectTab(index)}
				>
					{testimonial.username}
				</button>
			{/each}
		</div>

		<div class="terminal-window">
			<div class="terminal-header">
				<span class="terminal-dot red"></span>
				<span class="terminal-dot yellow"></span>
				<span class="terminal-dot green"></span>
				<span class="terminal-title">
					{testimonials[activeTab].username}@{testimonials[activeTab].host}:~
				</span>
			</div>

			<div class="terminal-body">
				<div class="command-line">
					<span class="prompt">{testimonials[activeTab].username}@{testimonials[activeTab].host}</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
					<span class="command">cat review.txt</span>
				</div>
				<div class="output">
					<div class="output-separator">───────────────────────────────────</div>
					<p class="testimonial-text">"{testimonials[activeTab].text}"</p>
					<div class="output-separator">───────────────────────────────────</div>
					<p class="testimonial-role">— {testimonials[activeTab].role}</p>
				</div>
				<div class="command-line">
					<span class="prompt">{testimonials[activeTab].username}@{testimonials[activeTab].host}</span><span class="colon">:</span><span class="path">~</span><span class="dollar">$</span>
					<span class="cursor">█</span>
				</div>
			</div>

			<div class="terminal-footer">
				<a href="mailto:hello@kidou.io?subject=Testimonial" class="cta-link">
					{m.landing_testimonials_cta()} →
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.testimonials {
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

	.terminal-container {
		max-width: 600px;
		margin: 0 auto;
	}

	.terminal-tabs {
		display: flex;
		gap: var(--space-1);
		margin-bottom: -1px;
		padding-left: var(--space-2);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.terminal-tabs::-webkit-scrollbar {
		display: none;
	}

	.tab {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding: var(--space-2) var(--space-3);
		background: #0a0a0a;
		border: 1px solid var(--color-border);
		border-bottom: none;
		border-radius: var(--radius-sm) var(--radius-sm) 0 0;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.tab:hover {
		color: var(--color-text-secondary);
		background: var(--color-bg-hover);
	}

	.tab.active {
		color: var(--color-success);
		background: var(--color-bg-elevated);
		border-color: var(--color-success);
		border-bottom: 1px solid var(--color-bg-elevated);
		position: relative;
		z-index: 1;
	}

	.terminal-window {
		background: #0a0a0a;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		font-family: var(--font-mono);
	}

	.tab.active ~ .terminal-window {
		border-top-color: var(--color-success);
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-bg-elevated);
		border-bottom: 1px solid var(--color-border);
	}

	.terminal-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.terminal-dot.red {
		background: #ff5f56;
	}

	.terminal-dot.yellow {
		background: #ffbd2e;
	}

	.terminal-dot.green {
		background: #27c93f;
	}

	.terminal-title {
		margin-left: auto;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.terminal-body {
		padding: var(--space-4);
		min-height: 180px;
	}

	.command-line {
		font-size: var(--text-sm);
		margin-bottom: var(--space-2);
	}

	.prompt {
		color: var(--color-success);
	}

	.colon {
		color: var(--color-text);
	}

	.path {
		color: var(--color-warning);
	}

	.dollar {
		color: var(--color-text);
		margin-right: var(--space-2);
	}

	.command {
		color: var(--color-text);
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

	.output {
		padding: var(--space-3) 0;
	}

	.output-separator {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		opacity: 0.5;
	}

	.testimonial-text {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		line-height: 1.6;
		padding: var(--space-3) 0;
		font-style: italic;
	}

	.testimonial-role {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		margin-top: var(--space-2);
	}

	.terminal-footer {
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg-elevated);
		border-top: 1px solid var(--color-border);
	}

	.cta-link {
		display: inline-flex;
		align-items: center;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.cta-link:hover {
		color: var(--color-success);
	}

	@media (max-width: 600px) {
		.terminal-body {
			padding: var(--space-3);
			min-height: 160px;
		}

		.command-line,
		.testimonial-text {
			font-size: var(--text-xs);
		}

		.tab {
			padding: var(--space-1) var(--space-2);
		}
	}
</style>
