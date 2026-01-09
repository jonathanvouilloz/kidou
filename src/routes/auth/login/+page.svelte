<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { signIn } from '$lib/auth-client';
	import { showToast } from '$lib/stores/toast';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import FormError from '$lib/components/ui/FormError.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// URL de redirection apres login (depuis le layout parent)
	const redirectTo = $derived(data.redirectTo || '/dashboard');
	const isProjectRedirect = $derived(data.redirectTo === '/project/new');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const result = await signIn.email({
				email,
				password
			});

			if (result.error) {
				error = result.error.message ?? m.auth_loginError();
			} else {
				await invalidateAll();
				showToast('Welcome back!', 'success');
				await goto(redirectTo);
			}
		} catch (err) {
			error = m.auth_loginErrorCredentials();
		} finally {
			loading = false;
		}
	}

	// Construire le lien register avec le meme redirect param
	const registerLink = $derived(
		data.redirectTo ? `/auth/register?redirect=${encodeURIComponent(data.redirectTo)}` : '/auth/register'
	);
</script>

<svelte:head>
	<title>{m.auth_loginPageTitle()}</title>
</svelte:head>

<Card>
	<form onsubmit={handleSubmit} class="auth-form">
		<h1 class="form-title">{m.auth_loginTitle()}</h1>

		{#if isProjectRedirect}
			<p class="redirect-context">{m.auth_continueCreating()}</p>
		{/if}

		<FormError message={error} />

		<Input
			type="email"
			label={m.auth_email()}
			bind:value={email}
			required
			autocomplete="email"
			disabled={loading}
		/>

		<Input
			type="password"
			label={m.auth_password()}
			bind:value={password}
			required
			autocomplete="current-password"
			disabled={loading}
		/>

		<div class="forgot-password">
			<a href="/auth/forgot-password">{m.auth_forgotPassword()}</a>
		</div>

		<Button type="submit" disabled={loading}>
			{#if loading}
				<Loader size="sm" />
				{m.auth_loggingIn()}
			{:else}
				{m.auth_loginButton()}
			{/if}
		</Button>

		<p class="form-footer">
			{m.auth_noAccount()}
			<a href={registerLink}>{m.auth_createAccount()}</a>
		</p>
	</form>
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

	.forgot-password {
		text-align: right;
		margin-top: calc(-1 * var(--space-2));
	}

	.forgot-password a {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: underline;
	}

	.forgot-password a:hover {
		color: var(--color-text);
	}

	.redirect-context {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		padding: var(--space-2) var(--space-3);
		background: var(--color-bg-elevated);
		border-radius: var(--radius-sm);
		margin: 0;
	}
</style>
