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
		padding: var(--space-2) var(--space-3);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-family: var(--font-mono);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.share-btn:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}

	.share-btn svg {
		width: 16px;
		height: 16px;
	}
</style>
