<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-left">
			<span class="copyright">© {currentYear} Kidou</span>
		</div>

		<nav class="footer-links">
			<a href="/about" class="footer-link">À propos</a>
			<a href="https://github.com/jonathanvouilloz/kidou" class="footer-link" target="_blank" rel="noopener">
				GitHub
			</a>
		</nav>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--color-border);
		background: var(--color-bg);
	}

	.footer-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-4);
	}

	.copyright {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.footer-links {
		display: flex;
		gap: var(--space-4);
	}

	.footer-link {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer-link:hover {
		color: var(--color-text);
	}
</style>
