<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

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
				error = result.error.message ?? 'Erreur de connexion';
			} else {
				await goto('/dashboard');
			}
		} catch (err) {
			error = 'Erreur de connexion. Vérifiez vos identifiants.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Connexion - Kidou</title>
</svelte:head>

<Card>
	<form onsubmit={handleSubmit} class="auth-form">
		<h1 class="form-title">Connexion</h1>

		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<Input
			type="email"
			label="Email"
			bind:value={email}
			required
			autocomplete="email"
			disabled={loading}
		/>

		<Input
			type="password"
			label="Mot de passe"
			bind:value={password}
			required
			autocomplete="current-password"
			disabled={loading}
		/>

		<Button type="submit" disabled={loading}>
			{loading ? 'Connexion...' : 'Se connecter'}
		</Button>

		<p class="form-footer">
			Pas encore de compte ?
			<a href="/auth/register">Créer un compte</a>
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

	.error-message {
		padding: var(--space-3);
		background: rgba(255, 51, 51, 0.1);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-sm);
		color: var(--color-error);
		font-size: var(--text-sm);
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
