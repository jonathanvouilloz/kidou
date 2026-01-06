<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { changePassword, deleteUser } from '$lib/auth-client';

	let { data, form } = $props();

	// Profile state
	let username = $state(data.profile.username);
	let avatarUrl = $state(data.profile.avatarUrl || '');
	let accentColor = $state(data.profile.accentColor);
	let saving = $state(false);
	let showSuccess = $state(data.checkoutSuccess);
	let showProfileSaved = $state(false);

	// Password change state
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let changingPassword = $state(false);
	let showPasswordChanged = $state(false);

	// Delete account state
	let showDeleteModal = $state(false);
	let deletePassword = $state('');
	let deleteError = $state('');
	let deleting = $state(false);

	function formatResetDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	$effect(() => {
		if (form?.success) {
			showProfileSaved = true;
			setTimeout(() => {
				showProfileSaved = false;
			}, 3000);
		}
	});

	async function handleChangePassword(e: Event) {
		e.preventDefault();
		passwordError = '';

		if (newPassword !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return;
		}
		if (newPassword.length < 8) {
			passwordError = 'Password must be at least 8 characters';
			return;
		}

		changingPassword = true;
		const { error } = await changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true
		});
		changingPassword = false;

		if (error) {
			passwordError = error.message || 'Failed to change password';
		} else {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			showPasswordChanged = true;
			setTimeout(() => {
				showPasswordChanged = false;
			}, 3000);
		}
	}

	async function handleDeleteAccount() {
		deleteError = '';
		deleting = true;

		const { error } = await deleteUser({ password: deletePassword });

		if (error) {
			deleteError = error.message || 'Failed to delete account';
			deleting = false;
		} else {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Settings - Kidou</title>
</svelte:head>

{#if showSuccess}
	<Toast message="Welcome to Pro! Your subscription is now active." type="success" onclose={() => (showSuccess = false)} />
{/if}

{#if showProfileSaved}
	<Toast message="Profile updated successfully!" type="success" onclose={() => (showProfileSaved = false)} />
{/if}

{#if showPasswordChanged}
	<Toast message="Password changed successfully!" type="success" onclose={() => (showPasswordChanged = false)} />
{/if}

<main class="settings">
	<div class="container">
		<h1>Settings</h1>

		<!-- Profile Section -->
		<section class="section">
			<h2>Profile</h2>
			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					saving = true;
					return async ({ update }) => {
						await update();
						saving = false;
					};
				}}
			>
				<div class="form-fields">
					<Input label="Username" name="username" bind:value={username} error={form?.error} />

					<Input label="Avatar URL (coming soon)" name="avatarUrl" type="url" bind:value={avatarUrl} placeholder="https://..." disabled />

					<div class="color-field">
						<label for="accentColor">Accent Color (coming soon)</label>
						<div class="color-input-wrapper">
							<input type="color" id="accentColor" name="accentColor" bind:value={accentColor} disabled />
							<span class="color-value">{accentColor}</span>
						</div>
					</div>
				</div>

				<Button type="submit" disabled={saving}>
					{saving ? 'Saving...' : 'Save Changes'}
				</Button>
			</form>
		</section>

		<!-- Subscription Section -->
		<section class="section">
			<div class="section-header">
				<h2>Subscription</h2>
				<Badge variant={data.subscription.plan === 'pro' ? 'success' : 'default'}>
					{data.subscription.plan.toUpperCase()}
				</Badge>
			</div>

			{#if data.subscription.plan === 'free'}
				<div class="plan-info">
					<p>You're on the <strong>Free</strong> plan</p>
					<ul class="plan-limits">
						<li>3 projects maximum</li>
						<li>
							{data.subscription.llmExtractionsUsed}/{data.subscription.llmExtractionsMax} AI extractions this month
						</li>
					</ul>
					<p class="reset-info">Resets on {formatResetDate(data.subscription.llmExtractionsResetAt)}</p>
				</div>

				<div class="upgrade-section">
					<h3>Upgrade to Pro</h3>
					<ul class="pro-benefits">
						<li>Unlimited projects</li>
						<li>Unlimited AI extractions</li>
					</ul>
					<Button variant="primary" onclick={() => (window.location.href = '/api/checkout')}>Upgrade to Pro</Button>
				</div>
			{:else}
				<div class="plan-info">
					<p>You're on the <strong>Pro</strong> plan</p>
					<ul class="plan-limits">
						<li>Unlimited projects</li>
						<li>Unlimited AI extractions</li>
					</ul>
				</div>

				<Button variant="secondary" onclick={() => (window.location.href = '/api/portal')}>Manage Subscription</Button>
			{/if}
		</section>

		<!-- Password Change Section -->
		<section class="section">
			<h2>Change Password</h2>
			<form onsubmit={handleChangePassword}>
				<div class="form-fields">
					<Input
						label="Current Password"
						name="currentPassword"
						type="password"
						bind:value={currentPassword}
						autocomplete="current-password"
					/>
					<Input
						label="New Password"
						name="newPassword"
						type="password"
						bind:value={newPassword}
						autocomplete="new-password"
					/>
					<Input
						label="Confirm New Password"
						name="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						autocomplete="new-password"
					/>
				</div>
				{#if passwordError}
					<p class="error-message">{passwordError}</p>
				{/if}
				<Button type="submit" disabled={changingPassword}>
					{changingPassword ? 'Changing...' : 'Change Password'}
				</Button>
			</form>
		</section>

		<!-- Danger Zone Section -->
		<section class="section danger-zone">
			<h2>Danger Zone</h2>
			<p class="danger-warning">Once you delete your account, there is no going back. All your projects and data will be permanently deleted.</p>
			<Button variant="danger" onclick={() => (showDeleteModal = true)}>
				Delete Account
			</Button>
		</section>
	</div>
</main>

<!-- Delete Account Modal -->
<Modal bind:open={showDeleteModal} title="Delete Account">
	<p class="modal-warning">This will permanently delete your account and all your projects. This action cannot be undone.</p>
	<div class="modal-form">
		<Input
			label="Enter your password to confirm"
			name="deletePassword"
			type="password"
			bind:value={deletePassword}
		/>
		{#if deleteError}
			<p class="error-message">{deleteError}</p>
		{/if}
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (showDeleteModal = false)}>Cancel</Button>
		<Button variant="danger" onclick={handleDeleteAccount} disabled={deleting || !deletePassword}>
			{deleting ? 'Deleting...' : 'Delete Forever'}
		</Button>
	{/snippet}
</Modal>

<style>
	.settings {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin-bottom: var(--space-8);
	}

	.section {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		margin-bottom: var(--space-6);
	}

	h2 {
		font-size: var(--text-lg);
		font-weight: 500;
		margin: 0 0 var(--space-4) 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.section-header h2 {
		margin-bottom: 0;
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.color-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.color-field label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.color-input-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.color-input-wrapper input[type='color'] {
		width: 48px;
		height: 36px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		background: transparent;
		padding: 2px;
	}

	.color-value {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.plan-info {
		margin-bottom: var(--space-4);
	}

	.plan-info p {
		margin: 0 0 var(--space-2) 0;
	}

	.plan-limits {
		list-style: disc;
		padding-left: var(--space-4);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		margin: var(--space-2) 0;
	}

	.plan-limits li {
		margin-bottom: var(--space-1);
	}

	.reset-info {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-2);
	}

	.upgrade-section {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-4);
		margin-top: var(--space-4);
	}

	.upgrade-section h3 {
		font-size: var(--text-base);
		font-weight: 500;
		margin: 0 0 var(--space-2) 0;
	}

	.pro-benefits {
		list-style: none;
		padding: 0;
		margin: var(--space-2) 0 var(--space-4);
	}

	.pro-benefits li {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-1);
	}

	.pro-benefits li::before {
		content: '+ ';
		color: var(--color-success);
	}

	.error-message {
		color: var(--color-error);
		font-size: var(--text-sm);
		margin: var(--space-2) 0 var(--space-4) 0;
	}

	.danger-zone {
		border-color: var(--color-error);
	}

	.danger-zone h2 {
		color: var(--color-error);
	}

	.danger-warning {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		margin: 0 0 var(--space-4) 0;
	}

	.modal-warning {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		margin: 0 0 var(--space-4) 0;
	}

	.modal-form {
		margin-bottom: var(--space-2);
	}

	@media (max-width: 768px) {
		.settings {
			padding: var(--space-6) var(--space-3);
		}

		.section {
			padding: var(--space-4);
		}

		h1 {
			font-size: var(--text-xl);
		}
	}
</style>
