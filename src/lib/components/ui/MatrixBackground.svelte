<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let width = window.innerWidth;
		let height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;

		// Caractères (Katakana + Latin + Chiffres)
		const letters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
		const splitLetters = letters.split('');

		const fontSize = 14;
		let columns = Math.floor(width / fontSize);

		// Position Y de chaque colonne (commence hors écran pour décaler)
		let drops: number[] = [];
		for (let x = 0; x < columns; x++) {
			drops[x] = Math.random() * -100;
		}

		// RAF-based animation with frame limiting (~20fps = 50ms interval)
		let animationId: number;
		let lastFrameTime = 0;
		const frameInterval = 50; // ms between frames
		let isPaused = false;

		const draw = (timestamp: number) => {
			if (isPaused) {
				animationId = requestAnimationFrame(draw);
				return;
			}

			// Throttle to ~20fps
			if (timestamp - lastFrameTime < frameInterval) {
				animationId = requestAnimationFrame(draw);
				return;
			}
			lastFrameTime = timestamp;

			// Reset shadow avant le fade
			ctx.shadowBlur = 0;
			ctx.shadowColor = 'transparent';

			// Effet de traînée (fading)
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, width, height);

			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < drops.length; i++) {
				// 97% gris foncé, 3% vert néon
				const isGreen = Math.random() > 0.97;

				if (isGreen) {
					ctx.shadowBlur = 5;
					ctx.shadowColor = '#00FF41';
					ctx.fillStyle = '#00FF41';
				} else {
					ctx.shadowBlur = 0;
					ctx.shadowColor = 'transparent';
					ctx.fillStyle = '#333333';
				}

				const text = splitLetters[Math.floor(Math.random() * splitLetters.length)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);

				// Reset quand dépasse l'écran
				if (drops[i] * fontSize > height && Math.random() > 0.975) {
					drops[i] = 0;
				}

				drops[i]++;
			}

			// Reset shadow à la fin
			ctx.shadowBlur = 0;
			ctx.shadowColor = 'transparent';

			animationId = requestAnimationFrame(draw);
		};

		// Start animation
		animationId = requestAnimationFrame(draw);

		// Pause when page is hidden
		const handleVisibilityChange = () => {
			isPaused = document.hidden;
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Debounced resize handler
		let resizeTimeout: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				width = window.innerWidth;
				height = window.innerHeight;
				canvas.width = width;
				canvas.height = height;
				columns = Math.floor(width / fontSize);

				// Recalculer les drops si le nombre de colonnes change
				if (drops.length !== columns) {
					const newDrops: number[] = [];
					for (let x = 0; x < columns; x++) {
						newDrops[x] = drops[x] ?? Math.random() * -100;
					}
					drops = newDrops;
				}
			}, 150);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			clearTimeout(resizeTimeout);
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<canvas bind:this={canvas} class="matrix-bg"></canvas>

<style>
	.matrix-bg {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0.7;
		pointer-events: none;
	}
</style>
