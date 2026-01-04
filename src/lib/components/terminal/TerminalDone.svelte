<script lang="ts">
	interface Props {
		animate?: boolean;
	}

	let { animate = true }: Props = $props();

	const asciiArt = `
██████╗  ██████╗ ███╗   ██╗███████╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝
██║  ██║██║   ██║██╔██╗ ██║█████╗
██║  ██║██║   ██║██║╚██╗██║██╔══╝
██████╔╝╚██████╔╝██║ ╚████║███████╗
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
`;
</script>

<div class="terminal-done" class:animate>
	<div class="done-container">
		<pre class="done-ascii done-main">{asciiArt}</pre>
		<pre class="done-ascii done-glitch" aria-hidden="true">{asciiArt}</pre>
	</div>
</div>

<style>
	.terminal-done {
		margin-top: var(--space-4);
		text-align: center;
	}

	.done-container {
		position: relative;
		display: inline-block;
	}

	.done-ascii {
		font-size: var(--text-xs);
		line-height: 1;
		white-space: pre;
		margin: 0;
		color: var(--color-success);
	}

	.done-main {
		text-shadow:
			0 0 5px var(--color-success),
			0 0 10px var(--color-success),
			0 0 20px rgba(0, 255, 65, 0.5);
	}

	.done-glitch {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		pointer-events: none;
	}

	.terminal-done.animate .done-main {
		animation:
			done-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			done-glow-pulse 2s ease-in-out 0.6s infinite;
	}

	@keyframes done-enter {
		0% {
			opacity: 0;
			transform: translateY(15px) scale(0.9);
		}
		60% {
			opacity: 1;
			transform: translateY(-3px) scale(1.02);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes done-glow-pulse {
		0%, 100% {
			text-shadow:
				0 0 5px var(--color-success),
				0 0 10px var(--color-success),
				0 0 20px rgba(0, 255, 65, 0.5);
		}
		50% {
			text-shadow:
				0 0 10px var(--color-success),
				0 0 20px var(--color-success),
				0 0 40px rgba(0, 255, 65, 0.7);
		}
	}

	.terminal-done.animate .done-glitch {
		animation: glitch-flash 0.15s linear 0.5s;
	}

	@keyframes glitch-flash {
		0%, 100% {
			opacity: 0;
			transform: translate(0, 0);
		}
		25% {
			opacity: 0.8;
			transform: translate(-2px, 0);
			clip-path: inset(20% 0 60% 0);
		}
		50% {
			opacity: 0.6;
			transform: translate(2px, 0);
			clip-path: inset(40% 0 30% 0);
		}
		75% {
			opacity: 0.4;
			transform: translate(-1px, 0);
			clip-path: inset(60% 0 10% 0);
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

	@media (prefers-reduced-motion: reduce) {
		.terminal-done.animate .done-main {
			animation: none;
			opacity: 1;
		}
		.done-glitch {
			display: none;
		}
	}
</style>
