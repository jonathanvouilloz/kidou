<script lang="ts">
	import { browser } from '$app/environment';
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
		animateOnMount?: boolean;
		lineDelay?: number;
		typingSpeed?: number;
	}

	let {
		milestones,
		title = 'kidou',
		showCursor = true,
		animateOnMount = false,
		lineDelay = 150,
		typingSpeed = 25
	}: Props = $props();

	const completedCount = $derived(milestones.filter((m) => m.isCompleted).length);
	const totalCount = $derived(milestones.length);
	const percentage = $derived(totalCount > 0 ? (completedCount / totalCount) * 100 : 0);
	const isDone = $derived(percentage === 100);

	function getLineDelay(index: number): number {
		let totalDelay = 0;
		for (let i = 0; i < index; i++) {
			totalDelay += lineDelay + milestones[i].title.length * typingSpeed;
		}
		return totalDelay;
	}

	const totalAnimationTime = $derived(
		animateOnMount && milestones.length > 0
			? getLineDelay(milestones.length) + 300
			: 0
	);

	let showFinalElement = $state(!animateOnMount);

	$effect(() => {
		if (animateOnMount && browser) {
			showFinalElement = false;
			const timeout = setTimeout(() => {
				showFinalElement = true;
			}, totalAnimationTime);
			return () => clearTimeout(timeout);
		} else {
			showFinalElement = true;
		}
	});
</script>

<Terminal {title} progress={percentage} progressText="{completedCount}/{totalCount}">
	{#each milestones as milestone, i (milestone.id)}
		<TerminalLine
			lineNumber={i + 1}
			completed={milestone.isCompleted}
			text={milestone.title}
			animate={animateOnMount}
			delay={getLineDelay(i)}
			{typingSpeed}
		/>
	{/each}

	{#if showFinalElement}
		{#if isDone}
			<TerminalDone />
		{:else if showCursor}
			<div class="terminal-cursor">
				<span class="cursor-blink">█</span>
			</div>
		{/if}
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
