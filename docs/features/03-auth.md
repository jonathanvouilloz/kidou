# Phase 3 : Auth

## Description

Système d'authentification avec Better-Auth. Email/password pour le MVP.

## Tâches

- [ ] Page `/auth/login`
  - [ ] Formulaire email + password
  - [ ] Lien vers register
  - [ ] Gestion erreurs
- [ ] Page `/auth/register`
  - [ ] Formulaire email + password + username
  - [ ] Validation username unique
  - [ ] Redirection vers dashboard après inscription
- [ ] Protection des routes
  - [ ] Middleware/hook pour vérifier auth
  - [ ] Redirection vers login si non connecté
  - [ ] Routes protégées : /dashboard, /project/*
- [ ] Store user
  - [ ] Svelte store pour l'utilisateur courant
  - [ ] Sync avec session Better-Auth

## Routes

| Route | Type | Auth requise |
|-------|------|--------------|
| `/auth/login` | Public | Non |
| `/auth/register` | Public | Non |
| `/dashboard` | Privé | Oui |
| `/project/new` | Privé | Oui |
| `/project/[id]` | Privé | Oui |
| `/[user]` | Public | Non |
| `/[user]/[project]` | Public | Non |

## Notes

- Better-Auth gère les sessions automatiquement
- Username doit être unique et URL-safe (slug)
- Pas d'OAuth pour le MVP (à ajouter en V2)
