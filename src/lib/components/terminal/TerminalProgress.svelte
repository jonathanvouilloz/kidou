<script lang="ts">
	import Terminal from './Terminal.svelte';
	import TerminalLine from './TerminalLine.svelte';
	import TerminalDone from './TerminalDone.svelte';

	interface Milestone {
		id: string;
		title: string;
		isCompleted: boolean;
	}

	interface Props {
		milestones: Milestone[];
		title?: string;
		showCursor?: boolean;
	}

	let { milestones, title = 'kidou', showCursor = true }: Props = $props();

	const completedCount = $derived(milestones.filter((m) => m.isCompleted).length);
	const totalCount = $derived(milestones.length);
	const percentage = $derived(totalCount > 0 ? (completedCount / totalCount) * 100 : 0);
	const isDone = $derived(percentage === 100);
</script>

<Terminal {title} progress={percentage} progressText="{completedCount}/{totalCount}">
	{#each milestones as milestone, i}
		<TerminalLine lineNumber={i + 1} completed={milestone.isCompleted} text={milestone.title} />
	{/each}

	{#if isDone}
		<TerminalDone />
	{:else if showCursor}
		<div class="terminal-cursor">
			<span class="cursor-blink">█</span>
		</div>
	{/if}
</Terminal>

<style>
	.terminal-cursor {
		margin-top: var(--space-4);
	}

	.cursor-blink {
		animation: blink 1s step-end infinite;
		color: var(--color-accent);
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
