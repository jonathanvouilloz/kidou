<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectHeader from '$lib/components/project/ProjectHeader.svelte';
	import MilestoneList from '$lib/components/project/MilestoneList.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { data } = $props();

	// Local state for optimistic updates
	let milestones = $state(data.milestones);
	let progress = $state(data.progress);
	let completedCount = $state(data.completedCount);
	let isCompleted = $state(data.project.isCompleted);

	// Toast state
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('info');
	let toastVisible = $state(false);

	// Loading state for individual toggles
	let togglingId = $state<string | null>(null);

	// Sync state when data changes
	$effect(() => {
		milestones = data.milestones;
		progress = data.progress;
		completedCount = data.completedCount;
		isCompleted = data.project.isCompleted;
	});

	function showToast(message: string, type: 'success' | 'error' | 'info') {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
		// Plus de temps pour les erreurs
		const timeout = type === 'error' ? 5000 : 3000;
		setTimeout(() => (toastVisible = false), timeout);
	}

	async function handleToggle(id: string, completed: boolean) {
		if (togglingId) return;

		togglingId = id;

		// Save previous state for rollback
		const previousMilestones = [...milestones];
		const previousProgress = progress;
		const previousCompletedCount = completedCount;
		const previousIsCompleted = isCompleted;

		// Optimistic update
		milestones = milestones.map((m) => (m.id === id ? { ...m, isCompleted: completed } : m));
		const newCompletedCount = milestones.filter((m) => m.isCompleted).length;
		completedCount = newCompletedCount;
		progress = data.totalCount > 0 ? Math.round((newCompletedCount / data.totalCount) * 100) : 0;

		const allComplete = newCompletedCount === data.totalCount;
		if (allComplete !== isCompleted) {
			isCompleted = allComplete;
		}

		try {
			const res = await fetch(`/api/milestones/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isCompleted: completed })
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Erreur');
			}

			const result = await res.json();

			if (result.projectCompleted !== undefined) {
				isCompleted = result.projectCompleted;
				if (result.projectCompleted) {
					showToast('Projet terminé ! Félicitations !', 'success');
				}
			}
		} catch {
			// Rollback on error
			milestones = previousMilestones;
			progress = previousProgress;
			completedCount = previousCompletedCount;
			isCompleted = previousIsCompleted;

			showToast('Erreur lors de la mise à jour', 'error');
		} finally {
			togglingId = null;
		}
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
				← Dashboard
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
			<h2 class="section-title">Milestones</h2>
			<MilestoneList {milestones} onToggle={handleToggle} />
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

	.toast-container {
		position: fixed;
		bottom: var(--space-4);
		right: var(--space-4);
		z-index: 1000;
	}
</style>
