<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import FormError from '$lib/components/ui/FormError.svelte';
	import * as m from '$lib/paraglide/messages';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

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
				await goto('/dashboard');
			}
		} catch (err) {
			error = m.auth_loginErrorCredentials();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.auth_loginPageTitle()}</title>
</svelte:head>

<Card>
	<form onsubmit={handleSubmit} class="auth-form">
		<h1 class="form-title">{m.auth_loginTitle()}</h1>

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
			<a href="/auth/register">{m.auth_createAccount()}</a>
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
</style>
