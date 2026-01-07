<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectHeader from '$lib/components/project/ProjectHeader.svelte';
	import MilestoneList from '$lib/components/project/MilestoneList.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import InlineEdit from '$lib/components/ui/InlineEdit.svelte';
	import InlineTagEdit from '$lib/components/ui/InlineTagEdit.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	// Local project state (for inline edits)
	let project = $state({ ...data.project });

	// Original state (from server)
	let originalMilestones = $state(data.milestones.map((ms) => ({ ...ms })));

	// Editable state (local)
	let milestones = $state(data.milestones.map((ms) => ({ ...ms })));

	// Derived values
	let totalCount = $derived(milestones.length);
	let completedCount = $derived(milestones.filter((ms) => ms.isCompleted).length);
	let progress = $derived(totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);
	let isCompleted = $derived(completedCount === totalCount && totalCount > 0);

	// Check if there are unsaved changes
	let changedCount = $derived(
		milestones.filter((ms, i) => ms.isCompleted !== originalMilestones[i]?.isCompleted).length
	);
	let hasChanges = $derived(changedCount > 0);

	// Saving state
	let saving = $state(false);
	let deleting = $state(false);

	// Toast state
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('info');
	let toastVisible = $state(false);
	let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

	// Accordion state
	let detailsOpen = $state(false);

	// Sync state when data changes (e.g., after navigation)
	$effect(() => {
		originalMilestones = data.milestones.map((ms) => ({ ...ms }));
		milestones = data.milestones.map((ms) => ({ ...ms }));
	});

	function showToast(message: string, type: 'success' | 'error' | 'info') {
		// Clear previous timeout to avoid orphaned timeouts
		if (toastTimeoutId) clearTimeout(toastTimeoutId);

		toastMessage = message;
		toastType = type;
		toastVisible = true;
		const timeout = type === 'error' ? 5000 : 3000;
		toastTimeoutId = setTimeout(() => {
			toastVisible = false;
			toastTimeoutId = null;
		}, timeout);
	}

	// Toggle is now instant (local only)
	function handleToggle(id: string, completed: boolean) {
		milestones = milestones.map((ms) => (ms.id === id ? { ...ms, isCompleted: completed } : ms));
	}

	// Save all changes at once
	async function handleSave() {
		saving = true;

		try {
			const res = await fetch('/api/milestones/batch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					projectId: data.project.id,
					milestones: milestones.map((ms) => ({ id: ms.id, isCompleted: ms.isCompleted }))
				})
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || m.common_error());
			}

			const result = await res.json();

			// Update original state to match current
			originalMilestones = milestones.map((ms) => ({ ...ms }));

			if (result.projectCompleted) {
				showToast(m.projectView_projectCompleted(), 'success');
			} else {
				showToast(m.projectView_saveSuccess(), 'success');
			}
		} catch {
			showToast(m.projectView_saveError(), 'error');
		} finally {
			saving = false;
		}
	}

	// Cancel and reset to original
	function handleCancel() {
		milestones = originalMilestones.map((ms) => ({ ...ms }));
	}

	// Project field save handlers
	async function handleStackSave(newStack: string[]) {
		const res = await fetch(`/api/projects/${data.project.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ stack: newStack })
		});
		if (!res.ok) {
			const err = await res.json();
			showToast(err.message || 'Error updating stack', 'error');
			throw new Error('Save failed');
		}
		project = { ...project, stack: newStack };
		showToast('Stack updated', 'success');
	}

	async function handleGithubSave(newUrl: string) {
		const res = await fetch(`/api/projects/${data.project.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ githubUrl: newUrl || null })
		});
		if (!res.ok) {
			const err = await res.json();
			showToast(err.message || 'Error updating GitHub URL', 'error');
			throw new Error('Save failed');
		}
		project = { ...project, githubUrl: newUrl || null };
		showToast('GitHub URL updated', 'success');
	}

	async function handleLiveSave(newUrl: string) {
		const res = await fetch(`/api/projects/${data.project.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ liveUrl: newUrl || null })
		});
		if (!res.ok) {
			const err = await res.json();
			showToast(err.message || 'Error updating Live URL', 'error');
			throw new Error('Save failed');
		}
		project = { ...project, liveUrl: newUrl || null };
		showToast('Live URL updated', 'success');
	}

	async function handleDescriptionSave(newDesc: string) {
		const res = await fetch(`/api/projects/${data.project.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ description: newDesc || null })
		});
		if (!res.ok) {
			const err = await res.json();
			showToast(err.message || 'Error updating description', 'error');
			throw new Error('Save failed');
		}
		project = { ...project, description: newDesc || null };
		showToast('Description updated', 'success');
	}

	// Add new milestone
	async function handleAddMilestone(title: string) {
		const res = await fetch('/api/milestones', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				projectId: data.project.id,
				title
			})
		});
		if (!res.ok) {
			const err = await res.json();
			showToast(err.message || 'Error adding milestone', 'error');
			throw new Error('Add failed');
		}
		const newMilestone = await res.json();
		milestones = [...milestones, newMilestone];
		originalMilestones = [...originalMilestones, { ...newMilestone }];
		showToast('Milestone added', 'success');
	}

	// Build public URL for sharing
	const publicUrl = $derived(
		data.project.isPublic ? `/${data.user.username}/${data.project.slug}` : undefined
	);

	// Delete project
	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
			return;
		}

		deleting = true;

		try {
			const res = await fetch(`/api/projects/${data.project.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const err = await res.json();
				showToast(err.message || 'Error deleting project', 'error');
				return;
			}

			await goto('/dashboard');
		} catch {
			showToast('Error deleting project', 'error');
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>{data.project.name} - Kidou</title>
</svelte:head>

<main class="project-page">
	<div class="container">
		<div class="top-bar">
			<nav class="breadcrumb">
				<Button variant="ghost" size="sm" onclick={() => goto('/dashboard')}>
					← {m.projectView_backToDashboard()}
				</Button>
			</nav>
			{#if hasChanges}
				<div class="top-actions">
					<Button variant="ghost" size="sm" onclick={handleCancel} disabled={saving}>
						{m.common_cancel()}
					</Button>
					<Button variant="primary" size="sm" onclick={handleSave} disabled={saving}>
						{#if saving}
							<Loader size="sm" />
							{m.projectView_saving()}
						{:else}
							{m.projectView_saveChanges({ count: changedCount })}
						{/if}
					</Button>
				</div>
			{/if}
		</div>

		<ProjectHeader
			name={data.project.name}
			{progress}
			{completedCount}
			{totalCount}
			{isCompleted}
			isPublic={data.project.isPublic ?? true}
			{publicUrl}
		/>

		<section class="project-details-accordion">
			<button class="accordion-header" onclick={() => detailsOpen = !detailsOpen}>
				<span class="accordion-icon" class:open={detailsOpen}>›</span>
				<span>Edit content</span>
			</button>
			{#if detailsOpen}
				<div class="accordion-content">
					<div class="detail-block">
						<span class="detail-label">Description</span>
						<InlineEdit
							value={project.description ?? ''}
							placeholder="Project description..."
							multiline
							onSave={handleDescriptionSave}
						/>
					</div>
					<div class="detail-row">
						<span class="detail-label">Stack</span>
						<InlineTagEdit
							tags={project.stack ?? []}
							placeholder="Add technologies..."
							onSave={handleStackSave}
						/>
					</div>
					<div class="detail-row">
						<span class="detail-label">GitHub</span>
						<InlineEdit
							value={project.githubUrl ?? ''}
							placeholder="https://github.com/..."
							type="url"
							onSave={handleGithubSave}
						/>
					</div>
					<div class="detail-row">
						<span class="detail-label">Website</span>
						<InlineEdit
							value={project.liveUrl ?? ''}
							placeholder="https://..."
							type="url"
							onSave={handleLiveSave}
						/>
					</div>
				</div>
			{/if}
		</section>

		<section class="milestones-section">
			<h2 class="section-title">{m.projectView_milestones()}</h2>
			<MilestoneList {milestones} onToggle={handleToggle} onAdd={handleAddMilestone} />

			{#if hasChanges}
				<div class="actions-bar">
					<Button variant="ghost" onclick={handleCancel} disabled={saving}>
						{m.common_cancel()}
					</Button>
					<Button variant="primary" onclick={handleSave} disabled={saving}>
						{#if saving}
							<Loader size="sm" />
							{m.projectView_saving()}
						{:else}
							{m.projectView_saveChanges({ count: changedCount })}
						{/if}
					</Button>
				</div>
			{/if}

			<div class="project-actions-row">
				<Button variant="danger" size="sm" onclick={handleDelete} disabled={deleting}>
					{deleting ? 'Deleting...' : 'Delete project'}
				</Button>
			</div>
		</section>
	</div>
</main>

<div class="toast-container">
	<Toast type={toastType} message={toastMessage} visible={toastVisible} onClose={() => (toastVisible = false)} />
</div>

<style>
	.project-page {
		padding: var(--space-8) var(--space-4);
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	.top-bar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--color-bg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.top-actions {
		display: flex;
		gap: var(--space-3);
	}

	.breadcrumb {
		/* margin géré par .top-bar */
	}

	.project-details-accordion {
		margin-top: var(--space-4);
	}

	.accordion-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) 0;
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: color var(--transition-fast);
	}

	.accordion-header:hover {
		color: var(--color-text);
	}

	.accordion-icon {
		font-size: var(--text-base);
		transition: transform var(--transition-fast);
	}

	.accordion-icon.open {
		transform: rotate(90deg);
	}

	.accordion-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		margin-top: var(--space-2);
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.detail-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.detail-label {
		min-width: 80px;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.milestones-section {
		margin-top: var(--space-6);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: 500;
		margin-bottom: var(--space-4);
		color: var(--color-text-secondary);
	}

	.project-actions-row {
		display: flex;
		justify-content: flex-end;
		margin-top: var(--space-4);
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.toast-container {
		position: fixed;
		bottom: var(--space-4);
		right: var(--space-4);
		z-index: 1000;
	}

	@media (max-width: 480px) {
		.project-page {
			padding: var(--space-4) var(--space-3);
		}

		.toast-container {
			left: var(--space-3);
			right: var(--space-3);
		}
	}
</style>
