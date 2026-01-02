<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import TerminalProgress from '$lib/components/terminal/TerminalProgress.svelte';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';
	import MilestoneList from '$lib/components/project/MilestoneList.svelte';

	// State
	let checkboxChecked = $state(false);
	let modalOpen = $state(false);
	let toastVisible = $state(true);

	// Mock data
	const mockMilestones = [
		{ id: '1', title: 'Setup projet', isCompleted: true },
		{ id: '2', title: 'Design system', isCompleted: true },
		{ id: '3', title: 'Auth system', isCompleted: false },
		{ id: '4', title: 'Core features', isCompleted: false },
		{ id: '5', title: 'Deploy', isCompleted: false }
	];

	function handleMilestoneToggle(id: string, completed: boolean) {
		const milestone = mockMilestones.find((m) => m.id === id);
		if (milestone) {
			milestone.isCompleted = completed;
		}
	}
</script>

<svelte:head>
	<title>Styleguide - Kidou</title>
</svelte:head>

<div class="styleguide">
	<header class="styleguide-header">
		<h1>Kidou — Styleguide</h1>
		<p class="text-secondary">Tous les composants du design system</p>
	</header>

	<!-- Colors -->
	<section class="section">
		<h2>Couleurs</h2>
		<div class="color-grid">
			<div class="color-swatch" style="background: var(--color-bg)">
				<span>bg</span>
				<code>#0D0D0D</code>
			</div>
			<div class="color-swatch" style="background: var(--color-bg-elevated)">
				<span>bg-elevated</span>
				<code>#1A1A1A</code>
			</div>
			<div class="color-swatch" style="background: var(--color-bg-hover)">
				<span>bg-hover</span>
				<code>#262626</code>
			</div>
			<div class="color-swatch" style="background: var(--color-text); color: var(--color-bg)">
				<span>text</span>
				<code>#FFFFFF</code>
			</div>
			<div class="color-swatch" style="background: var(--color-text-secondary)">
				<span>text-secondary</span>
				<code>#A0A0A0</code>
			</div>
			<div class="color-swatch" style="background: var(--color-success)">
				<span>success</span>
				<code>#00FF41</code>
			</div>
			<div class="color-swatch" style="background: var(--color-error)">
				<span>error</span>
				<code>#FF3333</code>
			</div>
			<div class="color-swatch" style="background: var(--color-warning)">
				<span>warning</span>
				<code>#FFB000</code>
			</div>
		</div>
	</section>

	<!-- Typography -->
	<section class="section">
		<h2>Typographie</h2>
		<div class="type-scale">
			<p class="text-3xl">text-3xl — Heading 1</p>
			<p class="text-2xl">text-2xl — Heading 2</p>
			<p class="text-xl">text-xl — Heading 3</p>
			<p class="text-lg">text-lg — Large text</p>
			<p class="text-base">text-base — Body text</p>
			<p class="text-sm">text-sm — Small text</p>
			<p class="text-xs">text-xs — Extra small</p>
		</div>
	</section>

	<!-- Buttons -->
	<section class="section">
		<h2>Buttons</h2>
		<div class="component-row">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
		</div>
		<div class="component-row">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
		<div class="component-row">
			<Button disabled>Disabled</Button>
		</div>
	</section>

	<!-- Inputs -->
	<section class="section">
		<h2>Inputs</h2>
		<div class="component-stack">
			<Input placeholder="Nom du projet" />
			<Input type="email" placeholder="Email" label="Email" />
			<Input placeholder="Avec erreur" error="Ce champ est requis" />
			<Input placeholder="Disabled" disabled />
		</div>
	</section>

	<!-- Checkboxes -->
	<section class="section">
		<h2>Checkboxes</h2>
		<div class="component-stack">
			<Checkbox label="Non coché" />
			<Checkbox label="Coché" bind:checked={checkboxChecked} />
			<Checkbox label="Disabled" disabled />
		</div>
	</section>

	<!-- Badges -->
	<section class="section">
		<h2>Badges</h2>
		<div class="component-row">
			<Badge>Default</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
		</div>
	</section>

	<!-- Loader -->
	<section class="section">
		<h2>Loader</h2>
		<div class="component-row">
			<Loader size="sm" />
			<Loader size="md" />
			<Loader size="lg" />
		</div>
	</section>

	<!-- Avatar -->
	<section class="section">
		<h2>Avatar</h2>
		<div class="component-row">
			<Avatar username="John" size="sm" />
			<Avatar username="Jane" size="md" />
			<Avatar username="Bob" size="lg" />
		</div>
	</section>

	<!-- Card -->
	<section class="section">
		<h2>Card</h2>
		<Card>
			{#snippet header()}
				<h3>Card Title</h3>
			{/snippet}
			<p>Card content goes here. This is the body of the card.</p>
			{#snippet footer()}
				<Button size="sm">Action</Button>
			{/snippet}
		</Card>
	</section>

	<!-- Toast -->
	<section class="section">
		<h2>Toast</h2>
		<div class="component-stack">
			<Toast type="success" message="Opération réussie !" />
			<Toast type="error" message="Une erreur est survenue." />
			<Toast type="info" message="Information importante." visible={toastVisible} onClose={() => (toastVisible = false)} />
		</div>
	</section>

	<!-- Modal -->
	<section class="section">
		<h2>Modal</h2>
		<Button onclick={() => (modalOpen = true)}>Ouvrir Modal</Button>
		<Modal bind:open={modalOpen} title="Titre du modal">
			<p>Contenu du modal. Vous pouvez mettre ce que vous voulez ici.</p>
			{#snippet footer()}
				<Button variant="secondary" onclick={() => (modalOpen = false)}>Annuler</Button>
				<Button onclick={() => (modalOpen = false)}>Confirmer</Button>
			{/snippet}
		</Modal>
	</section>

	<!-- Terminal -->
	<section class="section">
		<h2>Terminal Progress</h2>
		<TerminalProgress milestones={mockMilestones} title="kidou" />
	</section>

	<!-- Project Card -->
	<section class="section">
		<h2>Project Card</h2>
		<div class="project-grid">
			<ProjectCard
				name="Kidou MVP"
				slug="kidou-mvp"
				username="john"
				progress={40}
				completedCount={2}
				totalCount={5}
			/>
			<ProjectCard
				name="Side Project"
				slug="side-project"
				username="john"
				progress={100}
				completedCount={3}
				totalCount={3}
				isCompleted
			/>
		</div>
	</section>

	<!-- Milestone List -->
	<section class="section">
		<h2>Milestone List</h2>
		<Card>
			<MilestoneList milestones={mockMilestones} onToggle={handleMilestoneToggle} />
		</Card>
	</section>
</div>

<style>
	.styleguide {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-8);
	}

	.styleguide-header {
		margin-bottom: var(--space-12);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.styleguide-header h1 {
		font-size: var(--text-3xl);
		margin-bottom: var(--space-2);
	}

	.section {
		margin-bottom: var(--space-12);
	}

	.section h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: var(--space-4);
	}

	.color-swatch {
		padding: var(--space-6) var(--space-4);
		border-radius: var(--radius-md);
		text-align: center;
		border: 1px solid var(--color-border);
	}

	.color-swatch span {
		display: block;
		font-size: var(--text-sm);
		margin-bottom: var(--space-1);
	}

	.color-swatch code {
		font-size: var(--text-xs);
		opacity: 0.7;
	}

	.type-scale {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.component-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.component-stack {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 400px;
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}
</style>
