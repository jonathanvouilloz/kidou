<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/auth-client';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let errors = $state<Record<string, string>>({});
	let loading = $state(false);

	// Validation username (slug URL-safe)
	function validateUsername(value: string): string | null {
		if (value.length < 3) return 'Minimum 3 caractères';
		if (value.length > 50) return 'Maximum 50 caractères';
		if (!/^[a-z0-9_-]+$/.test(value)) {
			return 'Lettres minuscules, chiffres, tirets et underscores uniquement';
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
			errors.password = 'Minimum 8 caractères';
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
					errors.username = "Ce nom d'utilisateur est déjà pris";
				} else if (result.error.message?.includes('email')) {
					errors.email = 'Cet email est déjà utilisé';
				} else {
					errors.form = result.error.message ?? "Erreur lors de l'inscription";
				}
			} else {
				await goto('/dashboard');
			}
		} catch (err) {
			errors.form = "Erreur lors de l'inscription. Réessayez.";
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Inscription - Kidou</title>
</svelte:head>

<Card>
	<form onsubmit={handleSubmit} class="auth-form">
		<h1 class="form-title">Créer un compte</h1>

		{#if errors.form}
			<div class="error-message">{errors.form}</div>
		{/if}

		<Input
			type="email"
			label="Email"
			bind:value={email}
			error={errors.email}
			required
			autocomplete="email"
			disabled={loading}
		/>

		<div class="input-group">
			<Input
				type="text"
				label="Nom d'utilisateur"
				bind:value={username}
				error={errors.username}
				required
				autocomplete="username"
				disabled={loading}
				placeholder="mon-pseudo"
			/>
			<p class="input-hint">
				Visible dans votre URL publique: kidou.io/{username || 'votre-pseudo'}
			</p>
		</div>

		<div class="input-group">
			<Input
				type="password"
				label="Mot de passe"
				bind:value={password}
				error={errors.password}
				required
				autocomplete="new-password"
				disabled={loading}
			/>
			<p class="input-hint">Minimum 8 caractères</p>
		</div>

		<Button type="submit" disabled={loading}>
			{loading ? 'Création...' : 'Créer mon compte'}
		</Button>

		<p class="form-footer">
			Déjà un compte ?
			<a href="/auth/login">Se connecter</a>
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
