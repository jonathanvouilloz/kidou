<script lang="ts">
	import { goto } from '$app/navigation';
	import TerminalCard from '$lib/components/project/TerminalCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Milestone {
		id: string;
		title: string;
		isCompleted: boolean;
	}

	interface Project {
		id: string;
		name: string;
		slug: string;
		progress: number;
		milestones: Milestone[];
		deadline?: Date | null;
		isCompleted?: boolean;
		owner: {
			username: string;
			name: string | null;
			avatarUrl: string | null;
		};
	}

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();
</script>

<section class="last-projects">
	<h2 class="section-title">{m.landing_lastProjects_title()}</h2>

	{#if projects.length === 0}
		<p class="empty-state">{m.landing_lastProjects_empty()}</p>
	{:else}
		<div class="projects-grid">
			{#each projects as project (project.id)}
				<TerminalCard
					name={project.name}
					slug={project.slug}
					username={project.owner.username}
					progress={project.progress}
					milestones={project.milestones}
					deadline={project.deadline}
					isCompleted={project.isCompleted ?? false}
				/>
			{/each}
		</div>
	{/if}

	<div class="see-more">
		<Button variant="ghost" onclick={() => goto('/community')}>
			{m.landing_lastProjects_seeMore()} →
		</Button>
	</div>
</section>

<style>
	.last-projects {
		padding: var(--space-12) 0;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: 400;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: var(--space-10);
		text-align: center;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
		justify-items: center;
	}

	.empty-state {
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		padding: var(--space-8);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
	}

	.see-more {
		text-align: center;
		margin-top: var(--space-8);
	}

	@media (max-width: 1024px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.last-projects {
			padding: var(--space-8) 0;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: var(--space-4);
			max-width: 420px;
			margin: 0 auto;
		}
	}
</style>
