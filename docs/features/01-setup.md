# Phase 1 : Setup projet

## Description

Mise en place des fondations techniques du projet : SvelteKit, base de données, authentification, et styles de base.

## Tâches

- [x] Créer structure documentation
- [x] Initialiser SvelteKit avec TypeScript
- [x] Configurer structure de fichiers selon PRD
- [x] Installer dépendances principales
  - [x] drizzle-orm + drizzle-kit
  - [x] better-auth
  - [x] @anthropic-ai/sdk
  - [x] postgres (driver)
- [x] Setup variables CSS (couleurs, typography, spacing)
- [x] Configurer .env.example
- [x] Setup Drizzle + connexion Neon
- [x] Créer schéma DB (users, projects, milestones)
- [x] Configurer Better-Auth

## Décisions techniques

- **TypeScript** : Oui, strict mode
- **Adapter** : @sveltejs/adapter-vercel
- **Node version** : 20+

## Notes

- Le schéma DB est défini dans le PRD
- Better-Auth gère ses propres tables, on étend avec nos champs custom
