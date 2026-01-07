<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { getShareUrl, type ShareData } from '$lib/utils/share';

	interface Props {
		open: boolean;
		username: string;
		projectSlug: string;
		projectName: string;
		progress: number;
		completedCount: number;
		totalCount: number;
	}

	let {
		open = $bindable(),
		username,
		projectSlug,
		projectName,
		progress,
		completedCount,
		totalCount
	}: Props = $props();

	// Construct URLs
	const baseUrl = $derived(`https://kidou.app/${username}/${projectSlug}`);
	const ogImageUrl = $derived(`https://kidou.app/api/og/${username}/${projectSlug}`);
	const hdImageUrl = $derived(`${ogImageUrl}?format=hd`);

	// Share data
	const shareData = $derived<ShareData>({
		projectName,
		progress,
		completedCount,
		totalCount,
		url: baseUrl
	});

	// Twitter share URL
	const twitterUrl = $derived(getShareUrl(shareData));

	// Copy link state
	let copied = $state(false);

	async function copyLink() {
		await navigator.clipboard.writeText(baseUrl);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function downloadHd() {
		const link = document.createElement('a');
		link.href = hdImageUrl;
		link.download = `${projectSlug}-progress.png`;
		link.click();
	}

	function shareOnTwitter() {
		window.open(twitterUrl, '_blank', 'width=600,height=400');
	}
</script>

<Modal bind:open title="Share Project">
	{#snippet children()}
		<div class="share-content">
			<!-- Preview -->
			<div class="preview-section">
				<div class="preview-label">Preview</div>
				<div class="preview-container">
					<img src={ogImageUrl} alt="OG Preview" class="preview-image" />
				</div>
			</div>

			<!-- Actions -->
			<div class="actions">
				<button class="action-btn primary" onclick={shareOnTwitter}>
					<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
						<path
							d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
						/>
					</svg>
					Share on X
				</button>

				<button class="action-btn secondary" onclick={downloadHd}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="7 10 12 15 17 10"></polyline>
						<line x1="12" y1="15" x2="12" y2="3"></line>
					</svg>
					Download HD
				</button>

				<button class="action-btn secondary" onclick={copyLink}>
					{#if copied}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
						Copied!
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
						</svg>
						Copy Link
					{/if}
				</button>
			</div>
		</div>
	{/snippet}
</Modal>

<style>
	.share-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.preview-label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.preview-container {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-bg);
	}

	.preview-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-family: var(--font-mono);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.action-btn.primary {
		background: var(--color-text);
		color: var(--color-bg);
		border: none;
	}

	.action-btn.primary:hover {
		opacity: 0.9;
	}

	.action-btn.secondary {
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.action-btn.secondary:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}

	.action-btn svg {
		flex-shrink: 0;
	}
</style>
