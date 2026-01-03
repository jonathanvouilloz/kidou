<script lang="ts">
	interface Props {
		animate?: boolean;
	}

	let { animate = true }: Props = $props();
</script>

<div class="terminal-done" class:animate>
	<pre class="done-ascii">{`
██████╗  ██████╗ ███╗   ██╗███████╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝
██║  ██║██║   ██║██╔██╗ ██║█████╗
██║  ██║██║   ██║██║╚██╗██║██╔══╝
██████╔╝╚██████╔╝██║ ╚████║███████╗
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
`}</pre>
</div>

<style>
	.terminal-done {
		margin-top: var(--space-4);
		text-align: center;
		color: var(--color-success);
	}

	.done-ascii {
		font-size: var(--text-xs);
		line-height: 1;
		white-space: pre;
		margin: 0;
	}

	.terminal-done.animate {
		animation: fadeInUp 0.5s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Mobile responsive */
	@media (max-width: 480px) {
		.done-ascii {
			font-size: 0.5rem;
		}
	}

	@media (max-width: 360px) {
		.done-ascii {
			font-size: 0.4rem;
		}
	}
</style>
