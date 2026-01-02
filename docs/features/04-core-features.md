# Phase 4 : Core Features

## Description

Fonctionnalités principales de l'application : dashboard, création de projets, parsing LLM, gestion des milestones.

## Tâches

### Landing page (`/`)

- [ ] Hero section avec pitch
- [ ] Démo visuelle du terminal
- [ ] CTA inscription
- [ ] Footer

### Dashboard (`/dashboard`)

- [ ] Liste des projets de l'utilisateur
- [ ] Affichage progression par projet (barre + pourcentage)
- [ ] Bouton "Nouveau projet"
- [ ] Limite 3 projets (afficher compteur)
- [ ] Message si aucun projet

### Création projet (`/project/new`)

- [ ] Formulaire : nom du projet
- [ ] Zone de texte pour coller le PRD
- [ ] OU upload fichier .md/.txt
- [ ] Bouton "Analyser" → appel API
- [ ] État loading avec animation
- [ ] Affichage résultat : liste milestones éditables
- [ ] Actions : éditer, supprimer, réordonner (drag & drop), ajouter
- [ ] Bouton "Créer le projet"
- [ ] Redirection vers page projet

### API parse-prd (`/api/parse-prd`)

- [ ] Endpoint POST
- [ ] Validation input
- [ ] Appel Claude API avec prompt défini dans PRD
- [ ] Parsing réponse JSON
- [ ] Gestion erreurs
- [ ] Rate limiting (optionnel MVP)

### Page projet (`/project/[id]`)

- [ ] Header : nom, progression, lien public
- [ ] Liste milestones avec checkboxes
- [ ] Auto-save on checkbox toggle
- [ ] Animation terminal en temps réel
- [ ] Affichage "DONE" à 100%
- [ ] Actions : éditer projet, supprimer projet

### Édition milestones

- [ ] Édition inline du titre
- [ ] Réordonner par drag & drop
- [ ] Ajouter nouveau milestone
- [ ] Supprimer milestone
- [ ] Auto-save toutes les modifications

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
