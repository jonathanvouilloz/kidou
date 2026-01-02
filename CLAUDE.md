# Kidou - Instructions Projet

## Résumé

**Kidou** (起動) est une webapp de tracking de progression style terminal pour développeurs solopreneurs. Upload ton PRD, l'app extrait les milestones via LLM, tu coches ta progression, tu partages ta page publique.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | SvelteKit |
| Auth | Better-Auth (email/password) |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| LLM | Claude API (Anthropic) |
| Hosting | Vercel |
| Styling | CSS custom (dark mode only) |

## Commandes utiles

```bash
# Développement
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Database
npm run db:generate    # Générer migrations Drizzle
npm run db:push        # Appliquer migrations
npm run db:studio      # Drizzle Studio (UI)
```

## Conventions de code

- **Composants** : PascalCase (`Button.svelte`)
- **Fichiers utilitaires** : camelCase (`parsing.ts`)
- **Routes** : kebab-case (`/auth/login`)
- **Imports** : Utiliser `$lib/` pour tous les imports depuis `src/lib/`
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

## Pointeurs documentation

- `docs/PRD.md` - Product Requirements Document complet
- `docs/PLAN.md` - Plan d'exécution avec statuts
- `docs/DECISIONS.md` - Log des décisions techniques
- `docs/STYLEGUIDE.md` - Conventions de code et design
- `docs/features/` - Détails par feature

## État actuel

**Phase** : 2 - Design System & Styleguide (TERMINÉE)
**Complété** :
- Phase 1 : Setup projet
- Font JetBrains Mono
- 9 composants UI (Button, Input, Checkbox, Card, Badge, Loader, Avatar, Modal, Toast)
- 4 composants Terminal (Terminal, TerminalLine, TerminalProgress, TerminalDone)
- 4 composants Project (ProjectCard, MilestoneItem, MilestoneList, ProjectHeader)
- 2 composants Layout (Header, Footer)
- Page /styleguide

**Prochaine étape** : Phase 3 - Auth
