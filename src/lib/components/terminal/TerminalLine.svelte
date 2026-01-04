<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		lineNumber: number;
		completed?: boolean;
		text: string;
		animate?: boolean;
		delay?: number;
		typingSpeed?: number;
	}

	let {
		lineNumber,
		completed = false,
		text,
		animate = false,
		delay = 0,
		typingSpeed = 30
	}: Props = $props();

	let displayedText = $state('');
	let isTypingComplete = $state(!animate);
	let hasStarted = $state(false);

	$effect(() => {
		if (!animate) {
			displayedText = text;
			isTypingComplete = true;
			return;
		}

		if (!browser) {
			displayedText = text;
			isTypingComplete = true;
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			displayedText = text;
			isTypingComplete = true;
			return;
		}

		displayedText = '';
		isTypingComplete = false;
		hasStarted = false;
		let charIndex = 0;
		let timeoutId: ReturnType<typeof setTimeout>;

		const typeNextChar = () => {
			if (charIndex < text.length) {
				displayedText = text.slice(0, charIndex + 1);
				charIndex++;
				const variance = Math.random() * 20 - 10;
				timeoutId = setTimeout(typeNextChar, typingSpeed + variance);
			} else {
				isTypingComplete = true;
			}
		};

		timeoutId = setTimeout(() => {
			hasStarted = true;
			typeNextChar();
		}, delay);

		return () => clearTimeout(timeoutId);
	});
</script>

<div
	class="terminal-line"
	class:completed
	class:animate
	class:visible={!animate || hasStarted}
>
	<span class="line-number">{String(lineNumber).padStart(2, '0')}</span>
	<span class="line-status">{completed ? '✓' : '○'}</span>
	<span class="line-text">
		{displayedText}
		{#if animate && hasStarted && !isTypingComplete}
			<span class="typing-cursor">|</span>
		{/if}
	</span>
</div>

<style>
	.terminal-line {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-1) 0;
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
		opacity: 0;
	}

	.terminal-line.visible {
		opacity: 1;
	}

	.terminal-line.completed {
		color: var(--color-accent);
	}

	.line-number {
		color: var(--color-text-muted);
		opacity: 0.5;
		min-width: 2em;
		text-align: right;
	}

	.line-status {
		width: 1.5em;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.terminal-line.completed .line-status {
		transform: scale(1.1);
		text-shadow: 0 0 8px var(--color-success);
	}

	.line-text {
		flex: 1;
	}

	.typing-cursor {
		animation: cursor-blink 0.5s step-end infinite;
		color: var(--color-accent);
		margin-left: 1px;
	}

	@keyframes cursor-blink {
		50% { opacity: 0; }
	}

	/* Mobile responsive */
	@media (max-width: 480px) {
		.terminal-line {
			font-size: var(--text-xs);
			gap: var(--space-2);
		}

		.line-number {
			min-width: 1.5em;
		}

		.line-status {
			width: 1.2em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.typing-cursor {
			animation: none;
		}
	}
</style>
