# Phase 5 : Pages publiques

## Description

Pages accessibles publiquement pour partager sa progression.

## Tâches

### Profil public (`/[user]`)

- [x] Header avec username et avatar
- [x] Liste des projets publics
- [x] Pour chaque projet : nom, progression, lien
- [x] Message si aucun projet public

### Page projet public (`/[user]/[project]`)

- [x] Header : nom projet, username, progression
- [x] Terminal avec liste milestones (read-only)
- [x] Pas de checkbox (juste indicateurs ✓ / ○)
- [x] Animation si 100% complété (ASCII art DONE via TerminalProgress)
- [x] Lien retour vers profil

### SEO & Open Graph

- [x] Meta tags dynamiques
- [x] `<title>` : "Projet | User - Kidou"
- [x] `og:title`, `og:description`
- [ ] `og:image` : screenshot du terminal (optionnel V2)
- [x] Twitter cards

## Routes

| Route | Description |
|-------|-------------|
| `/[user]` | Profil public d'un utilisateur |
| `/[user]/[project]` | Page projet publique |

## Fichiers créés

- `src/routes/[user]/+page.server.ts` - Load user + projets publics
- `src/routes/[user]/+page.svelte` - Page profil public
- `src/routes/[user]/[project]/+page.server.ts` - Load projet + milestones
- `src/routes/[user]/[project]/+page.svelte` - Page projet public

## Notes

- Ces pages sont indexables par les moteurs de recherche
- Pas d'auth requise
- Vérifier que le projet est public (is_public = true)
- 404 si user ou projet inexistant
