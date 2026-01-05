<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import FormError from '$lib/components/ui/FormError.svelte';
	import * as m from '$lib/paraglide/messages';

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let errors = $state<Record<string, string>>({});
	let loading = $state(false);

	// Validation username (slug URL-safe)
	function validateUsername(value: string): string | null {
		if (value.length < 3) return m.auth_usernameMinLength();
		if (value.length > 50) return m.auth_usernameMaxLength();
		if (!/^[a-z0-9_-]+$/.test(value)) {
			return m.auth_usernameFormat();
		}
		return null;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = {};

		// Validation locale
		const usernameError = validateUsername(username);
		if (usernameError) {
			errors.username = usernameError;
			return;
		}

		if (password.length < 8) {
			errors.password = m.auth_passwordMinLength();
			return;
		}

		loading = true;

		try {
			const result = await signUp.email({
				email,
				password,
				name: username,
				username
			});

			if (result.error) {
				if (result.error.message?.includes('username')) {
					errors.username = m.auth_usernameTaken();
				} else if (result.error.message?.includes('email')) {
					errors.email = m.auth_emailTaken();
				} else {
					errors.form = result.error.message ?? m.auth_registerError();
				}
			} else {
				await goto(`/auth/verify-email?email=${encodeURIComponent(email)}`);
			}
		} catch (err) {
			errors.form = m.auth_registerErrorRetry();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.auth_registerPageTitle()}</title>
</svelte:head>

<Card>
	<form onsubmit={handleSubmit} class="auth-form">
		<h1 class="form-title">{m.auth_registerTitle()}</h1>

		<FormError message={errors.form || ''} />

		<Input
			type="email"
			label={m.auth_email()}
			bind:value={email}
			error={errors.email}
			required
			autocomplete="email"
			disabled={loading}
		/>

		<div class="input-group">
			<Input
				type="text"
				label={m.auth_username()}
				bind:value={username}
				error={errors.username}
				required
				autocomplete="username"
				disabled={loading}
				placeholder={m.auth_usernamePlaceholder()}
			/>
			<p class="input-hint">
				{m.auth_usernameHint({ username: username || 'your-username' })}
			</p>
		</div>

		<div class="input-group">
			<Input
				type="password"
				label={m.auth_password()}
				bind:value={password}
				error={errors.password}
				required
				autocomplete="new-password"
				disabled={loading}
			/>
			<p class="input-hint">{m.auth_passwordHint()}</p>
		</div>

		<Button type="submit" disabled={loading}>
			{#if loading}
				<Loader size="sm" />
				{m.auth_registering()}
			{:else}
				{m.auth_registerButton()}
			{/if}
		</Button>

		<p class="form-footer">
			{m.auth_hasAccount()}
			<a href="/auth/login">{m.auth_loginButton()}</a>
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

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.input-hint {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
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
