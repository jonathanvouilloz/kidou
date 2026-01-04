<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectHeader from '$lib/components/project/ProjectHeader.svelte';
	import MilestoneList from '$lib/components/project/MilestoneList.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	// Original state (from server)
	let originalMilestones = $state(data.milestones.map((ms) => ({ ...ms })));

	// Editable state (local)
	let milestones = $state(data.milestones.map((ms) => ({ ...ms })));

	// Derived values
	let completedCount = $derived(milestones.filter((ms) => ms.isCompleted).length);
	let progress = $derived(
		data.totalCount > 0 ? Math.round((completedCount / data.totalCount) * 100) : 0
	);
	let isCompleted = $derived(completedCount === data.totalCount && data.totalCount > 0);

	// Check if there are unsaved changes
	let changedCount = $derived(
		milestones.filter((ms, i) => ms.isCompleted !== originalMilestones[i]?.isCompleted).length
	);
	let hasChanges = $derived(changedCount > 0);

	// Saving state
	let saving = $state(false);

	// Toast state
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('info');
	let toastVisible = $state(false);

	// Sync state when data changes (e.g., after navigation)
	$effect(() => {
		originalMilestones = data.milestones.map((ms) => ({ ...ms }));
		milestones = data.milestones.map((ms) => ({ ...ms }));
	});

	function showToast(message: string, type: 'success' | 'error' | 'info') {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
		const timeout = type === 'error' ? 5000 : 3000;
		setTimeout(() => (toastVisible = false), timeout);
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

	// Build public URL for sharing
	const publicUrl = $derived(
		data.project.isPublic ? `/${data.user.username}/${data.project.slug}` : undefined
	);
</script>

<svelte:head>
	<title>{data.project.name} - Kidou</title>
</svelte:head>

<main class="project-page">
	<div class="container">
		<nav class="breadcrumb">
			<Button variant="ghost" size="sm" onclick={() => goto('/dashboard')}>
				← {m.projectView_backToDashboard()}
			</Button>
		</nav>

		<ProjectHeader
			name={data.project.name}
			{progress}
			{completedCount}
			totalCount={data.totalCount}
			{isCompleted}
			isPublic={data.project.isPublic ?? true}
			{publicUrl}
		/>

		<section class="milestones-section">
			<h2 class="section-title">{m.projectView_milestones()}</h2>
			<MilestoneList {milestones} onToggle={handleToggle} />

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

	.breadcrumb {
		margin-bottom: var(--space-4);
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
