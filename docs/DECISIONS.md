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
| 2026-01-06 | Driver Neon serverless + région sin1 | Optimisation performances | postgres-js standard |

---

## Détail décision : Migration driver DB (2026-01-06)

### Problème
L'app était très lente (~500-800ms par requête) malgré une DB Neon à Singapour.

### Avant
```typescript
// postgres-js standard - connexion TCP
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```
- Chaque cold start Vercel ouvrait une nouvelle connexion TCP
- Région Vercel par défaut = US (latence triangle US↔Singapour↔Thaïlande)

### Après
```typescript
// @neondatabase/serverless - connexion HTTP
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
```
+ `vercel.json` avec `"regions": ["sin1"]`

### Pourquoi c'est mieux
- **HTTP vs TCP** : Le driver serverless utilise HTTP, évitant l'overhead de handshake TCP sur chaque cold start
- **Région sin1** : Fonctions Vercel déployées à Singapour, proche de la DB Neon et des utilisateurs APAC
- **Gain estimé** : ~300-500ms par requête
