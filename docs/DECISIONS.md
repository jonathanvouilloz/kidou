# Décisions techniques - Kidou

## Format

| Date | Décision | Contexte | Alternatives considérées |

---

## Log

| Date | Décision | Contexte | Alternatives |
|------|----------|----------|--------------|
| 2026-01-03 | PostgreSQL via Neon | Base de données principale | SQLite, PlanetScale |
| 2026-01-03 | Drizzle ORM | ORM type-safe et léger | Prisma (plus lourd) |
| 2026-01-03 | Better-Auth | Auth simple et moderne | Lucia, Auth.js |
| 2026-01-03 | Slug auto-généré | Simplifier UX création projet | Slug éditable manuellement |
| 2026-01-03 | Hard delete projets | Simplicité MVP | Soft delete avec archivage |
| 2026-01-03 | Auth email/password | Rapidité implémentation MVP | GitHub OAuth, Google OAuth |
| 2026-01-03 | CSS custom | Contrôle total sur thème terminal | Tailwind, UnoCSS |
