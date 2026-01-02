<script lang="ts">
	interface Props {
		type?: 'success' | 'error' | 'info';
		message: string;
		visible?: boolean;
		onClose?: () => void;
	}

	let { type = 'info', message, visible = true, onClose }: Props = $props();

	const icons = {
		success: '✓',
		error: '✕',
		info: 'ℹ'
	};
</script>

{#if visible}
	<div class="toast toast-{type}" role="alert">
		<span class="toast-icon">{icons[type]}</span>
		<span class="toast-message">{message}</span>
		{#if onClose}
			<button class="toast-close" onclick={onClose} aria-label="Fermer">
				✕
			</button>
		{/if}
	</div>
{/if}

<style>
	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.toast-success {
		background: rgba(0, 255, 65, 0.1);
		border: 1px solid var(--color-success);
		color: var(--color-success);
	}

	.toast-error {
		background: rgba(255, 51, 51, 0.1);
		border: 1px solid var(--color-error);
		color: var(--color-error);
	}

	.toast-info {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		color: var(--color-text);
	}

	.toast-icon {
		font-size: var(--text-base);
	}

	.toast-message {
		flex: 1;
	}

	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-sm);
		color: inherit;
		opacity: 0.7;
		transition: opacity var(--transition-fast);
	}

	.toast-close:hover {
		opacity: 1;
	}
</style>
