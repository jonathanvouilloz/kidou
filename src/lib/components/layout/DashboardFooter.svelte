<script lang="ts">
	interface Props {
		username: string;
	}

	let { username }: Props = $props();

	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-container">
		<nav class="quick-links">
			<a href="/dashboard">Dashboard</a>
			<span class="separator">·</span>
			<a href="/project/new">New Project</a>
			<span class="separator">·</span>
			<a href="/{username}">My Page</a>
			<span class="separator">·</span>
			<a href="/settings">Settings</a>
		</nav>

		<div class="footer-right">
			<a href="https://github.com/jonathanvouilloz/kidou" target="_blank" rel="noopener">
				GitHub
			</a>
			<span class="separator">·</span>
			<span class="copyright">© {currentYear} Kidou</span>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--color-border);
		background: var(--color-bg);
		margin-top: auto;
	}

	.footer-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-2);
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	.quick-links,
	.footer-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.quick-links a,
	.footer-right a {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.quick-links a:hover,
	.footer-right a:hover {
		color: var(--color-text);
	}

	.separator {
		color: var(--color-text-muted);
		opacity: 0.5;
	}

	.copyright {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	@media (max-width: 600px) {
		.footer-container {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
