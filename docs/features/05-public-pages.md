# Phase 5 : Pages publiques

## Description

Pages accessibles publiquement pour partager sa progression.

## Tâches

### Profil public (`/[user]`)

- [ ] Header avec username et avatar
- [ ] Liste des projets publics
- [ ] Pour chaque projet : nom, progression, lien
- [ ] Message si aucun projet public

### Page projet public (`/[user]/[project]`)

- [ ] Header : nom projet, username, progression
- [ ] Terminal avec liste milestones (read-only)
- [ ] Pas de checkbox (juste indicateurs ✓ / ○)
- [ ] Animation si 100% complété
- [ ] Lien retour vers profil

### SEO & Open Graph

- [ ] Meta tags dynamiques
- [ ] `<title>` : "Projet | User - Kidou"
- [ ] `og:title`, `og:description`
- [ ] `og:image` : screenshot du terminal (optionnel V2)
- [ ] Twitter cards

## Routes

| Route | Description |
|-------|-------------|
| `/[user]` | Profil public d'un utilisateur |
| `/[user]/[project]` | Page projet publique |

## Notes

- Ces pages sont indexables par les moteurs de recherche
- Pas d'auth requise
- Vérifier que le projet est public (is_public = true)
- 404 si user ou projet inexistant
