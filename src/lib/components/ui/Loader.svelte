<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
	}

	let { size = 'md' }: Props = $props();
</script>

<span class="loader loader-{size}" aria-label="Chargement...">
	<span class="loader-dot"></span>
	<span class="loader-dot"></span>
	<span class="loader-dot"></span>
</span>

<style>
	.loader {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}

	.loader-dot {
		border-radius: 50%;
		background: var(--color-accent);
		animation: pulse 1.4s ease-in-out infinite;
	}

	.loader-dot:nth-child(1) {
		animation-delay: 0s;
	}

	.loader-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.loader-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse {
		0%,
		80%,
		100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		40% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Sizes */
	.loader-sm .loader-dot {
		width: 4px;
		height: 4px;
	}

	.loader-md .loader-dot {
		width: 6px;
		height: 6px;
	}

	.loader-lg .loader-dot {
		width: 8px;
		height: 8px;
	}
</style>
