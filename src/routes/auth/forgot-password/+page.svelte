<script lang="ts">
	import { forgetPassword } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import FormError from '$lib/components/ui/FormError.svelte';
	import * as m from '$lib/paraglide/messages';

	let email = $state('');
	let error = $state('');
	let success = $state(false);
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const result = await forgetPassword({
				email,
				redirectTo: '/auth/reset-password'
			});

			if (result.error) {
				error = result.error.message ?? m.auth_forgotPasswordError();
			} else {
				success = true;
			}
		} catch (err) {
			error = m.auth_forgotPasswordError();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.auth_forgotPasswordPageTitle()}</title>
</svelte:head>

<Card>
	{#if success}
		<div class="success-state">
			<div class="success-icon">&#10003;</div>
			<h1 class="form-title">{m.auth_checkYourEmail()}</h1>
			<p class="success-text">{m.auth_resetEmailSent()}</p>
			<a href="/auth/login" class="back-link">{m.auth_backToLogin()}</a>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="auth-form">
			<h1 class="form-title">{m.auth_forgotPasswordTitle()}</h1>
			<p class="form-subtitle">{m.auth_forgotPasswordSubtitle()}</p>

			<FormError message={error} />

			<Input
				type="email"
				label={m.auth_email()}
				bind:value={email}
				required
				autocomplete="email"
				disabled={loading}
			/>

			<Button type="submit" disabled={loading}>
				{#if loading}
					<Loader size="sm" />
					{m.auth_sending()}
				{:else}
					{m.auth_sendResetLink()}
				{/if}
			</Button>

			<p class="form-footer">
				{m.auth_rememberPassword()}
				<a href="/auth/login">{m.auth_backToLogin()}</a>
			</p>
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

	.form-footer {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.form-footer a {
		color: var(--color-text);
		text-decoration: underline;
	}

	.success-state {
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

	.success-text {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.back-link {
		color: var(--color-text);
		text-decoration: underline;
		font-size: var(--text-sm);
	}
</style>
