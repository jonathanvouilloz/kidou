<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import EditableMilestoneList from '$lib/components/project/EditableMilestoneList.svelte';

	interface Milestone {
		id: string;
		title: string;
		position: number;
	}

	// Step management
	let step = $state<1 | 2>(1);

	// Step 1 state
	let projectName = $state('');
	let prdContent = $state('');
	let analyzing = $state(false);
	let analyzeError = $state('');
	let nameError = $state('');

	// Step 2 state
	let milestones = $state<Milestone[]>([]);
	let creating = $state(false);
	let createError = $state('');

	async function handleAnalyze(e: SubmitEvent) {
		e.preventDefault();
		nameError = '';
		analyzeError = '';

		// Validate name
		if (!projectName.trim()) {
			nameError = 'Le nom du projet est requis';
			return;
		}

		if (projectName.trim().length < 3) {
			nameError = 'Le nom doit contenir au moins 3 caractères';
			return;
		}

		// Validate PRD
		if (prdContent.trim().length < 50) {
			analyzeError = 'Le PRD doit contenir au moins 50 caractères';
			return;
		}

		analyzing = true;

		try {
			const res = await fetch('/api/parse-prd', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prdContent })
			});

			const data = await res.json();

			if (!res.ok) {
				analyzeError = data.message || "Erreur lors de l'analyse";
				return;
			}

			if (!data.milestones || data.milestones.length === 0) {
				analyzeError = 'Aucune milestone détectée. Vérifiez le contenu du PRD.';
				return;
			}

			// Convert to editable format
			milestones = data.milestones.map((title: string, i: number) => ({
				id: crypto.randomUUID(),
				title,
				position: i + 1
			}));

			step = 2;
		} catch {
			analyzeError = 'Erreur de connexion. Réessayez.';
		} finally {
			analyzing = false;
		}
	}

	async function handleCreate() {
		createError = '';

		// Filter out empty milestones
		const validMilestones = milestones.filter((m) => m.title.trim());

		if (validMilestones.length === 0) {
			createError = 'Ajoutez au moins une milestone';
			return;
		}

		creating = true;

		try {
			const res = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: projectName.trim(),
					originalPrd: prdContent,
					milestones: validMilestones.map((m) => m.title)
				})
			});

			const data = await res.json();

			if (!res.ok) {
				createError = data.message || 'Erreur lors de la création';
				return;
			}

			await goto(`/project/${data.id}`);
		} catch {
			createError = 'Erreur de connexion. Réessayez.';
		} finally {
			creating = false;
		}
	}

	function goBack() {
		step = 1;
	}
</script>

<svelte:head>
	<title>Nouveau projet - Kidou</title>
</svelte:head>

<main class="new-project">
	<div class="container">
		{#if step === 1}
			<header class="page-header">
				<h1>Nouveau projet</h1>
				<p class="subtitle">Entrez le nom de votre projet et collez votre PRD pour extraire les milestones.</p>
			</header>

			<form class="project-form" onsubmit={handleAnalyze}>
				<Input
					label="Nom du projet"
					bind:value={projectName}
					error={nameError}
					placeholder="Mon super projet"
					maxlength={100}
					required
				/>

				<Textarea
					label="Contenu du PRD"
					bind:value={prdContent}
					error={analyzeError}
					placeholder="Collez votre PRD, specs, ou notes de projet ici..."
					rows={12}
				/>

				<Button type="submit" variant="primary" disabled={analyzing}>
					{#if analyzing}
						<Loader size="sm" />
						Analyse en cours...
					{:else}
						Analyser
					{/if}
				</Button>
			</form>
		{:else}
			<header class="page-header">
				<Button variant="ghost" size="sm" onclick={goBack}>← Retour</Button>
				<h1>{projectName}</h1>
				<p class="subtitle">{milestones.length} milestone{milestones.length > 1 ? 's' : ''} détectée{milestones.length > 1 ? 's' : ''}</p>
			</header>

			<section class="milestones-section">
				<p class="instructions">Modifiez, supprimez ou réordonnez les milestones avant de créer le projet.</p>

				<EditableMilestoneList bind:milestones />

				{#if createError}
					<p class="error-message">{createError}</p>
				{/if}

				<div class="actions">
					<Button variant="primary" onclick={handleCreate} disabled={creating || milestones.length === 0}>
						{#if creating}
							<Loader size="sm" />
							Création...
						{:else}
							Créer le projet
						{/if}
					</Button>
				</div>
			</section>
		{/if}
	</div>
</main>

<style>
	.new-project {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: var(--space-6);
	}

	.page-header h1 {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin: var(--space-2) 0;
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.project-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.milestones-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.instructions {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.error-message {
		color: var(--color-error);
		font-size: var(--text-sm);
	}

	.actions {
		margin-top: var(--space-4);
		display: flex;
		justify-content: flex-end;
	}
</style>
