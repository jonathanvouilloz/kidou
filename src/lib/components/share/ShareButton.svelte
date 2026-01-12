<script lang="ts">
	interface Props {
		onclick: () => void;
	}

	let { onclick }: Props = $props();
</script>

<button class="share-btn" {onclick}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="18" cy="5" r="3"></circle>
		<circle cx="6" cy="12" r="3"></circle>
		<circle cx="18" cy="19" r="3"></circle>
		<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
		<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
	</svg>
	Share
</button>

<style>
	.share-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: 5px 15px;
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 12px;
		font-weight: bold;
		letter-spacing: 1px;
		font-family: var(--font-mono);
		cursor: pointer;
		transition: all 0.2s;
	}

	.share-btn:hover {
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.share-btn svg {
		width: 16px;
		height: 16px;
	}
</style>
