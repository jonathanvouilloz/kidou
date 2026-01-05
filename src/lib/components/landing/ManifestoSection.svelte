<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<section class="manifesto">
	<div class="manifesto-header">
		<span class="prompt">$</span>
		<span class="command">cat</span>
		<span class="file">the_pain.log</span>
	</div>
	<div class="manifesto-content">
		<p class="log-line">
			<span class="timestamp">[{m.landing_manifesto_timestamp()}]</span>
			{m.landing_manifesto_line1()}
		</p>
		<p class="log-line">
			<span class="timestamp">[{m.landing_manifesto_timestamp2()}]</span>
			{m.landing_manifesto_line2()}
		</p>
		<p class="log-line highlight">
			<span class="timestamp">[{m.landing_manifesto_timestamp3()}]</span>
			{m.landing_manifesto_line3()}
		</p>
	</div>
	<div class="manifesto-footer">
		<span class="prompt">$</span>
		<span class="cursor">_</span>
	</div>
</section>

<style>
	.manifesto {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		overflow: hidden;
	}

	.manifesto-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg-elevated);
		border-bottom: 1px solid var(--color-border);
	}

	.prompt {
		color: var(--color-success);
	}

	.command {
		color: var(--color-text);
	}

	.file {
		color: var(--color-text-secondary);
	}

	.manifesto-content {
		padding: var(--space-4);
	}

	.log-line {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		line-height: 1.8;
		margin-bottom: var(--space-2);
	}

	.log-line:last-child {
		margin-bottom: 0;
	}

	.timestamp {
		color: var(--color-text-muted);
		margin-right: var(--space-2);
	}

	.log-line.highlight {
		color: var(--color-text);
	}

	.manifesto-footer {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg-elevated);
		border-top: 1px solid var(--color-border);
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

	@media (max-width: 600px) {
		.manifesto-content {
			padding: var(--space-3);
		}

		.log-line {
			font-size: var(--text-xs);
		}
	}
</style>
