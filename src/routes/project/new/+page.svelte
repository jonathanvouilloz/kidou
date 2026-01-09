<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import TagInput from '$lib/components/ui/TagInput.svelte';
	import EditableMilestoneList from '$lib/components/project/EditableMilestoneList.svelte';
	import TerminalBootOverlay from '$lib/components/terminal/TerminalBootOverlay.svelte';
	import { showToast } from '$lib/stores/toast';
	import {
		savePendingProject,
		loadPendingProject,
		clearPendingProject,
		type PendingProjectInput
	} from '$lib/utils/pending-project';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	interface Milestone {
		id: string;
		title: string;
		position: number;
	}

	// Step management
	let step = $state<1 | 2>(1);

	// Step 1 state
	let projectName = $state('');
	let description = $state('');
	let stack = $state<string[]>([]);
	let deadline = $state('');
	let githubUrl = $state('');
	let liveUrl = $state('');
	let prdContent = $state('');
	let analyzing = $state(false);
	let analyzeError = $state('');
	let nameError = $state('');
	let uploading = $state(false);
	let fileInputRef: HTMLInputElement;

	// Step 2 state
	let milestones = $state<Milestone[]>([]);
	let creating = $state(false);
	let showBootOverlay = $state(false);
	let createError = $state('');

	// Sauvegarde les donnees et redirige vers l'auth
	function redirectToAuth() {
		const pendingData: PendingProjectInput = {
			step,
			projectName,
			description,
			stack,
			deadline,
			githubUrl,
			liveUrl,
			prdContent,
			milestones
		};
		savePendingProject(pendingData);
		goto('/auth/register?redirect=/project/new');
	}

	// Restaurer les donnees depuis localStorage au montage
	onMount(() => {
		const pending = loadPendingProject();
		if (pending) {
			// Restaurer tous les champs
			projectName = pending.projectName;
			description = pending.description;
			stack = pending.stack;
			deadline = pending.deadline;
			githubUrl = pending.githubUrl;
			liveUrl = pending.liveUrl;
			prdContent = pending.prdContent;
			milestones = pending.milestones;
			step = pending.step;

			// Si l'utilisateur est maintenant connecte, clear le storage et notifier
			if (data.isAuthenticated) {
				clearPendingProject();
				showToast(m.project_dataRestored(), 'success');
			}
		}
	});

	async function handleAnalyze(e: SubmitEvent) {
		e.preventDefault();
		nameError = '';
		analyzeError = '';

		// Validate name
		if (!projectName.trim()) {
			nameError = m.project_nameRequired();
			return;
		}

		if (projectName.trim().length < 3) {
			nameError = m.project_nameMinLength();
			return;
		}

		// Validate PRD
		if (prdContent.trim().length < 50) {
			analyzeError = m.project_prdMinLength();
			return;
		}

		// Verifier l'authentification - rediriger si necessaire
		if (!data.isAuthenticated) {
			redirectToAuth();
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
				analyzeError = data.message || m.project_analyzeError();
				return;
			}

			if (!data.milestones || data.milestones.length === 0) {
				analyzeError = m.project_noMilestones();
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
			analyzeError = m.project_connectionError();
		} finally {
			analyzing = false;
		}
	}

	async function handleCreate() {
		createError = '';

		// Filter out empty milestones
		const validMilestones = milestones.filter((ms) => ms.title.trim());

		if (validMilestones.length === 0) {
			createError = m.project_addMilestoneMin();
			return;
		}

		// Verifier l'authentification - rediriger si necessaire
		if (!data.isAuthenticated) {
			redirectToAuth();
			return;
		}

		creating = true;
		showBootOverlay = true;

		try {
			// Run API call and minimum delay in parallel
			const minDelay = new Promise((r) => setTimeout(r, 2500));

			const apiCall = fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: projectName.trim(),
					description: description.trim() || undefined,
					stack: stack.length > 0 ? stack : undefined,
					deadline: deadline || undefined,
					githubUrl: githubUrl.trim() || undefined,
					liveUrl: liveUrl.trim() || undefined,
					originalPrd: prdContent,
					milestones: validMilestones.map((ms) => ms.title)
				})
			});

			const [res] = await Promise.all([apiCall, minDelay]);
			const data = await res.json();

			if (!res.ok) {
				showBootOverlay = false;
				createError = data.message || m.project_createError();
				return;
			}

			await goto(`/project/${data.id}`);
		} catch {
			showBootOverlay = false;
			createError = m.project_connectionError();
		} finally {
			creating = false;
		}
	}

	function goBack() {
		step = 1;
	}

	async function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		analyzeError = '';

		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/parse-file', {
				method: 'POST',
				body: formData
			});

			const data = await res.json();

			if (!res.ok) {
				analyzeError = data.message || m.project_uploadError();
				return;
			}

			prdContent = data.text;
		} catch {
			analyzeError = m.project_connectionError();
		} finally {
			uploading = false;
			// Reset file input
			input.value = '';
		}
	}

	function triggerFileInput() {
		fileInputRef?.click();
	}

	function handleSkipToManual() {
		nameError = '';

		// Validate name
		if (!projectName.trim()) {
			nameError = m.project_nameRequired();
			return;
		}

		if (projectName.trim().length < 3) {
			nameError = m.project_nameMinLength();
			return;
		}

		// Go to step 2 with empty milestones
		milestones = [];
		step = 2;
	}
</script>

<svelte:head>
	<title>{m.project_newTitle()} - Kidou</title>
</svelte:head>

<TerminalBootOverlay open={showBootOverlay} projectName={projectName} />

<main class="new-project">
	<div class="container">
		{#if !data.canCreateProject}
			<div class="limit-reached">
				<div class="limit-icon">⚠️</div>
				<h1>Project limit reached</h1>
				<p class="limit-message">
					You've reached the limit of <strong>{data.projectCount}/{data.maxProjects}</strong> projects
					on the {data.userPlan === 'free' ? 'Free' : 'Pro'} plan.
				</p>
				<div class="limit-actions">
					<span class="coming-soon">Pro plan coming soon</span>
					<Button variant="ghost" onclick={() => goto('/dashboard')}>
						← Dashboard
					</Button>
				</div>
			</div>
		{:else if step === 1}
			<header class="page-header">
				<h1>{m.project_newTitle()}</h1>
				<p class="subtitle">{m.project_newSubtitle()}</p>
			</header>

			<form class="project-form" onsubmit={handleAnalyze}>
				<Input
					label={m.project_nameLabel()}
					bind:value={projectName}
					error={nameError}
					placeholder={m.project_namePlaceholder()}
					maxlength={100}
					required
				/>

				<Textarea
					label={m.project_descriptionLabel()}
					bind:value={description}
					placeholder={m.project_descriptionPlaceholder()}
					rows={3}
				/>

				<TagInput
					label={m.project_stackLabel()}
					bind:tags={stack}
					placeholder={m.project_stackPlaceholder()}
					maxTags={10}
				/>

				<div class="form-row">
					<Input
						label={m.project_deadlineLabel()}
						type="date"
						bind:value={deadline}
					/>
				</div>

				<div class="form-row">
					<Input
						label={m.project_githubLabel()}
						type="url"
						bind:value={githubUrl}
						placeholder="https://github.com/..."
					/>
					<Input
						label={m.project_liveLabel()}
						type="url"
						bind:value={liveUrl}
						placeholder="https://..."
					/>
				</div>

				{#if data.canAnalyze}
					<div class="prd-section">
						<div class="prd-header">
							<label class="prd-label" for="prd-content">{m.project_prdLabel()}</label>
							<button type="button" class="upload-btn" onclick={triggerFileInput} disabled={uploading}>
								{#if uploading}
									<Loader size="sm" />
									{m.project_uploadingFile()}
								{:else}
									{m.project_uploadFile()}
								{/if}
							</button>
						</div>
						<p class="prd-help">{m.project_prdHelp()}</p>
						<input
							bind:this={fileInputRef}
							type="file"
							accept=".txt,.md,.pdf,.docx"
							onchange={handleFileUpload}
							class="file-input-hidden"
						/>
						<Textarea
							id="prd-content"
							bind:value={prdContent}
							error={analyzeError}
							placeholder={m.project_prdPlaceholder()}
							rows={12}
						/>
					</div>

					<div class="analyze-actions">
						<Button type="submit" variant="primary" disabled={analyzing}>
							{#if analyzing}
								<Loader size="sm" />
								{m.project_analyzing()}
							{:else}
								{m.project_analyzeButton()}
							{/if}
						</Button>
						<p class="usage-counter">{data.llmUsed}/{data.llmMax} analysis used today</p>
					</div>
				{:else}
					<div class="analysis-limit-box">
						<div class="limit-header">
							<span class="limit-badge">⚠️ Daily limit reached</span>
							<span class="limit-count">{data.llmUsed}/{data.llmMax} used</span>
						</div>
						<p class="limit-text">
							You've used your daily AI analysis. Add milestones manually or upgrade to Pro for more analyses.
						</p>
						<div class="limit-buttons">
							<Button type="button" variant="primary" onclick={handleSkipToManual}>
								Add milestones manually
							</Button>
							<span class="coming-soon">Pro coming soon</span>
						</div>
					</div>
				{/if}
			</form>
		{:else}
			<header class="page-header">
				<Button variant="ghost" size="sm" onclick={goBack}>← {m.common_back()}</Button>
				<h1>{projectName}</h1>
				<p class="subtitle">{m.project_milestonesDetected({ count: milestones.length })}</p>
			</header>

			<section class="milestones-section">
				<p class="instructions">{m.project_editMilestonesHint()}</p>

				<EditableMilestoneList bind:milestones />

				{#if createError}
					<p class="error-message">{createError}</p>
				{/if}

				<div class="actions">
					<Button variant="primary" onclick={handleCreate} disabled={creating || milestones.length === 0}>
						{#if creating}
							<Loader size="sm" />
							{m.project_creating()}
						{:else}
							{m.project_createButton()}
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

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

	.prd-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.prd-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.prd-label {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.prd-help {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: 0;
	}

	.upload-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.upload-btn:hover:not(:disabled) {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}

	.upload-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.file-input-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.actions {
		margin-top: var(--space-4);
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 480px) {
		.new-project {
			padding: var(--space-4) var(--space-3);
		}
	}

	/* Limit reached block */
	.limit-reached {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--space-12) var(--space-4);
		min-height: 50vh;
	}

	.limit-icon {
		font-size: 3rem;
		margin-bottom: var(--space-4);
	}

	.limit-reached h1 {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin-bottom: var(--space-3);
	}

	.limit-message {
		color: var(--color-text-secondary);
		font-size: var(--text-base);
		margin-bottom: var(--space-6);
		max-width: 400px;
	}

	.limit-message strong {
		color: var(--color-text);
	}

	.limit-actions {
		display: flex;
		gap: var(--space-3);
	}

	/* Analyze actions with counter */
	.analyze-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.usage-counter {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Analysis limit box */
	.analysis-limit-box {
		padding: var(--space-4);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.limit-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.limit-badge {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-warning, #f59e0b);
	}

	.limit-count {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.limit-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0 0 var(--space-4);
	}

	.limit-buttons {
		display: flex;
		gap: var(--space-3);
	}

	.coming-soon {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		padding: var(--space-2) var(--space-3);
	}
</style>
