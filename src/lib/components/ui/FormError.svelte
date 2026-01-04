<script lang="ts">
	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

{#if message}
	<div class="form-error" role="alert">
		<span class="error-icon">!</span>
		<span class="error-text">{message}</span>
	</div>
{/if}

<style>
	.form-error {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(255, 51, 51, 0.1);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-sm);
		color: var(--color-error);
		font-size: var(--text-sm);
		font-family: var(--font-mono);
	}

	.error-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: var(--radius-full);
		background: var(--color-error);
		color: var(--color-bg);
		font-weight: 700;
		font-size: var(--text-xs);
		flex-shrink: 0;
	}
</style>
