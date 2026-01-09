<script lang="ts">
	import { page } from '$app/stores';
	import { sendVerificationEmail } from '$lib/auth-client';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import * as m from '$lib/paraglide/messages';

	let email = $derived($page.url.searchParams.get('email') ?? '');
	let redirectTo = $derived($page.url.searchParams.get('redirect'));

	// Valider le redirect param
	function isValidRedirect(url: string | null): url is string {
		if (!url) return false;
		return url.startsWith('/') && !url.includes('://');
	}

	// URL de callback apres verification (avec redirect si valide)
	const callbackURL = $derived(isValidRedirect(redirectTo) ? redirectTo : '/dashboard');

	let resendLoading = $state(false);
	let resendSuccess = $state(false);
	let resendError = $state('');

	async function handleResend() {
		if (!email) return;

		resendLoading = true;
		resendError = '';
		resendSuccess = false;

		try {
			const result = await sendVerificationEmail({
				email,
				callbackURL
			});

			if (result.error) {
				resendError = result.error.message ?? m.auth_resendVerificationError();
			} else {
				resendSuccess = true;
			}
		} catch (err) {
			resendError = m.auth_resendVerificationError();
		} finally {
			resendLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.auth_verifyEmailPageTitle()}</title>
</svelte:head>

<Card>
	<div class="verify-email">
		<div class="email-icon">@</div>
		<h1 class="form-title">{m.auth_verifyEmailTitle()}</h1>
		<p class="verify-text">{m.auth_verifyEmailSent()}</p>

		{#if email}
			<p class="email-address">{email}</p>
		{/if}

		<div class="actions">
			{#if resendSuccess}
				<p class="resend-success">{m.auth_verificationResent()}</p>
			{:else if resendError}
				<p class="resend-error">{resendError}</p>
			{/if}

			{#if email}
				<Button variant="secondary" onclick={handleResend} disabled={resendLoading || resendSuccess}>
					{#if resendLoading}
						<Loader size="sm" />
						{m.auth_sending()}
					{:else}
						{m.auth_resendVerification()}
					{/if}
				</Button>
			{/if}
		</div>

		<p class="form-footer">
			<a href={isValidRedirect(redirectTo) ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}>{m.auth_backToLogin()}</a>
		</p>
	</div>
</Card>

<style>
	.verify-email {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-4);
	}

	.email-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background: var(--color-text);
		color: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xl);
		font-weight: 700;
		font-family: var(--font-mono);
	}

	.form-title {
		font-size: var(--text-xl);
		font-weight: 500;
	}

	.verify-text {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		max-width: 300px;
	}

	.email-address {
		font-family: var(--font-mono);
		color: var(--color-text);
		background: var(--color-bg);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}

	.actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.resend-success {
		color: var(--color-success);
		font-size: var(--text-sm);
	}

	.resend-error {
		color: var(--color-error);
		font-size: var(--text-sm);
	}

	.form-footer {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.form-footer a {
		color: var(--color-text);
		text-decoration: underline;
	}
</style>
