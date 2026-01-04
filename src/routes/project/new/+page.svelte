<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import TagInput from '$lib/components/ui/TagInput.svelte';
	import EditableMilestoneList from '$lib/components/project/EditableMilestoneList.svelte';
	import * as m from '$lib/paraglide/messages';

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
	let createError = $state('');

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

		creating = true;

		try {
			const res = await fetch('/api/projects', {
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

			const data = await res.json();

			if (!res.ok) {
				createError = data.message || m.project_createError();
				return;
			}

			await goto(`/project/${data.id}`);
		} catch {
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
</script>

<svelte:head>
	<title>{m.project_newTitle()} - Kidou</title>
</svelte:head>

<main class="new-project">
	<div class="container">
		{#if step === 1}
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

				<Button type="submit" variant="primary" disabled={analyzing}>
					{#if analyzing}
						<Loader size="sm" />
						{m.project_analyzing()}
					{:else}
						{m.project_analyzeButton()}
					{/if}
				</Button>
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
</style>
