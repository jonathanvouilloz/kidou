<script lang="ts">
	interface Props {
		src?: string | null;
		username: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { src, username, size = 'md' }: Props = $props();

	const initial = $derived(username[0]?.toUpperCase() ?? '?');
</script>

{#if src}
	<img {src} alt={username} class="avatar avatar-{size}" />
{:else}
	<span class="avatar avatar-{size} avatar-fallback">
		{initial}
	</span>
{/if}

<style>
	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-bg-hover);
		color: var(--color-text);
		font-weight: 500;
		flex-shrink: 0;
	}

	.avatar-sm {
		width: 24px;
		height: 24px;
		font-size: var(--text-xs);
	}

	.avatar-md {
		width: 32px;
		height: 32px;
		font-size: var(--text-sm);
	}

	.avatar-lg {
		width: 48px;
		height: 48px;
		font-size: var(--text-lg);
	}

	img.avatar {
		object-fit: cover;
	}
</style>
