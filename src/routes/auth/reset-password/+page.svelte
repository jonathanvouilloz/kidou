<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resetPassword } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import FormError from '$lib/components/ui/FormError.svelte';
	import * as m from '$lib/paraglide/messages';

	let token = $derived($page.url.searchParams.get('token') ?? '');

	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let success = $state(false);
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';

		if (password !== confirmPassword) {
			error = m.auth_passwordsDoNotMatch();
			return;
		}

		if (password.length < 8) {
			error = m.auth_passwordMinLength();
			return;
		}

		loading = true;

		try {
			const result = await resetPassword({
				newPassword: password,
				token
			});

			if (result.error) {
				if (result.error.code === 'INVALID_TOKEN') {
					error = m.auth_resetTokenExpired();
				} else {
					error = result.error.message ?? m.auth_resetPasswordError();
				}
			} else {
				success = true;
				setTimeout(() => goto('/auth/login'), 2000);
			}
		} catch (err) {
			error = m.auth_resetPasswordError();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.auth_resetPasswordPageTitle()}</title>
</svelte:head>

<Card>
	{#if !token}
		<div class="error-state">
			<h1 class="form-title">{m.auth_invalidLink()}</h1>
			<p class="error-text">{m.auth_resetLinkInvalid()}</p>
			<a href="/auth/forgot-password" class="back-link">{m.auth_requestNewLink()}</a>
		</div>
	{:else if success}
		<div class="success-state">
			<div class="success-icon">&#10003;</div>
			<h1 class="form-title">{m.auth_passwordResetSuccess()}</h1>
			<p class="success-text">{m.auth_redirectingToLogin()}</p>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="auth-form">
			<h1 class="form-title">{m.auth_resetPasswordTitle()}</h1>
			<p class="form-subtitle">{m.auth_resetPasswordSubtitle()}</p>

			<FormError message={error} />

			<div class="input-group">
				<Input
					type="password"
					label={m.auth_newPassword()}
					bind:value={password}
					required
					autocomplete="new-password"
					disabled={loading}
				/>
				<p class="input-hint">{m.auth_passwordHint()}</p>
			</div>

			<Input
				type="password"
				label={m.auth_confirmPassword()}
				bind:value={confirmPassword}
				required
				autocomplete="new-password"
				disabled={loading}
			/>

			<Button type="submit" disabled={loading}>
				{#if loading}
					<Loader size="sm" />
					{m.auth_resetting()}
				{:else}
					{m.auth_resetPasswordButton()}
				{/if}
			</Button>
		</form>
	{/if}
</Card>

<style>
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-title {
		font-size: var(--text-xl);
		font-weight: 500;
		text-align: center;
		margin-bottom: var(--space-1);
	}

	.form-subtitle {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-align: center;
		margin-bottom: var(--space-2);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.input-hint {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.success-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-4);
	}

	.success-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background: var(--color-success);
		color: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xl);
		font-weight: 700;
	}

	.success-text,
	.error-text {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.back-link {
		color: var(--color-text);
		text-decoration: underline;
		font-size: var(--text-sm);
	}
</style>
