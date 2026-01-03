# Phase 4 : Core Features

## Description

Fonctionnalités principales de l'application : dashboard, création de projets, parsing LLM, gestion des milestones.

## Tâches

### Landing page (`/`)

- [x] Hero section avec pitch
- [x] Démo visuelle du terminal
- [x] CTA inscription
- [x] Footer

### Dashboard (`/dashboard`)

- [x] Liste des projets de l'utilisateur
- [x] Affichage progression par projet (barre + pourcentage)
- [x] Bouton "Nouveau projet"
- [x] Limite 3 projets (afficher compteur)
- [x] Message si aucun projet

### Création projet (`/project/new`)

- [x] Formulaire : nom du projet
- [x] Zone de texte pour coller le PRD
- [ ] OU upload fichier .md/.txt (reporté post-MVP)
- [x] Bouton "Analyser" → appel API
- [x] État loading avec animation
- [x] Affichage résultat : liste milestones éditables
- [x] Actions : éditer, supprimer, réordonner (up/down), ajouter
- [x] Bouton "Créer le projet"
- [x] Redirection vers page projet

### API parse-prd (`/api/parse-prd`)

- [x] Endpoint POST
- [x] Validation input
- [x] Appel Claude API avec prompt défini dans PRD
- [x] Parsing réponse JSON
- [x] Gestion erreurs
- [ ] Rate limiting (optionnel MVP)

### Page projet (`/project/[id]`)

- [ ] Header : nom, progression, lien public
- [ ] Liste milestones avec checkboxes
- [ ] Auto-save on checkbox toggle
- [ ] Animation terminal en temps réel
- [ ] Affichage "DONE" à 100%
- [ ] Actions : éditer projet, supprimer projet

### Édition milestones (dans /project/new)

- [x] Édition inline du titre
- [x] Réordonner par up/down
- [x] Ajouter nouveau milestone
- [x] Supprimer milestone
- [ ] Auto-save toutes les modifications (pour /project/[id])

## API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/parse-prd` | POST | Parser PRD et extraire milestones |
| `/api/projects` | GET | Liste projets utilisateur |
| `/api/projects` | POST | Créer projet |
| `/api/projects/[id]` | GET | Détails projet |
| `/api/projects/[id]` | PATCH | Modifier projet |
| `/api/projects/[id]` | DELETE | Supprimer projet |
| `/api/projects/[id]/milestones` | PATCH | Modifier milestones |

## Notes

- Slug projet auto-généré depuis le nom
- Max 3 projets par utilisateur (gratuit)
- PRD original stocké dans la DB
