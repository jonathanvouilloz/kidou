# Kidou — Product Requirements Document

> Dashboard visuel de progression pour développeurs solopreneurs. Build in public, simplifié.

---

## Vue d'ensemble

### Concept

Kidou (起動 — "boot/démarrage" en japonais) est une webapp qui permet aux développeurs solo de tracker visuellement l'avancement de leurs projets et de partager cette progression publiquement.

Métaphore visuelle : un terminal qui se remplit ligne par ligne jusqu'à afficher "DONE" quand le projet est complété.

### Problème

Les devs solopreneurs qui font du "build in public" n'ont pas d'outil simple pour :
- Visualiser leur progression de manière satisfaisante
- Partager l'avancement sans friction
- Garder une trace de ce qu'ils ont accompli

GitHub montre des commits, pas une progression compréhensible. Les outils de gestion de projet sont overkill pour un dev solo.

### Solution

Un dashboard minimaliste où :
1. Tu upload ton PRD/plan → l'app extrait les milestones
2. Tu coches ce qui est fait en fin de session
3. Tu partages ta page publique avec ta communauté

### Public cible

Développeurs solopreneurs qui :
- Travaillent sur des side-projects
- Font du build in public (Twitter, LinkedIn, IndieHackers)
- Commitent direct sur main (pas de PRs élaborées)
- Veulent montrer leur progression sans friction

---

## Fonctionnalités MVP

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| **Auth** | Inscription/connexion via Better-Auth | P0 |
| **Upload PRD** | Importer un document texte/markdown | P0 |
| **Parsing LLM** | Extraction automatique des milestones via LLM | P0 |
| **Édition milestones** | Valider, modifier, supprimer les milestones générés | P0 |
| **Dashboard privé** | Vue de tous ses projets avec progression | P0 |
| **Update manuel** | Cocher/décocher les milestones complétés | P0 |
| **Page publique** | URL partageable `kidou.io/[user]/[project]` | P0 |
| **Visuel terminal** | Animation de remplissage style terminal | P0 |
| **Limite 3 projets** | Gratuit jusqu'à 3 projets | P0 |

---

## User Flows

### Flow 1 : Création de projet

```
1. User connecté arrive sur /dashboard
2. Click "Nouveau projet"
3. Modal : nom du projet + zone de texte/upload PRD
4. Submit → loading "Analyse en cours..."
5. Affichage liste de milestones extraits
6. User peut : éditer, supprimer, réordonner, ajouter
7. Click "Créer" → projet créé, redirigé vers page projet
```

### Flow 2 : Update de progression

```
1. User sur /dashboard ou /[user]/[project]
2. Voit la liste des milestones avec checkboxes
3. Coche ce qui est fait
4. Animation : le terminal se remplit
5. À 100% : animation "DONE" / "BOOT COMPLETE"
6. Auto-save (pas de bouton submit)
```

### Flow 3 : Partage public

```
1. User copie l'URL kidou.io/[user]/[project]
2. Visiteur voit : nom projet, progression, liste milestones
3. Pas d'interaction (read-only)
4. Lien vers le profil du dev
```

---

## Schéma base de données

```sql
-- Users (géré par Better-Auth, on étend si besoin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  accent_color VARCHAR(7) DEFAULT '#FFFFFF',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  original_prd TEXT,
  is_public BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  position INT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Design System

### Philosophie

Terminal-first. Minimaliste. Dark mode only.

### Palette de couleurs

```css
:root {
  /* Base - Grayscale */
  --color-bg: #0D0D0D;
  --color-bg-elevated: #1A1A1A;
  --color-bg-hover: #262626;
  --color-border: #333333;
  --color-border-subtle: #222222;

  /* Text */
  --color-text: #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-muted: #666666;

  /* Accent */
  --color-accent: #FFFFFF;
  --color-accent-dim: rgba(255, 255, 255, 0.1);

  /* Semantic */
  --color-success: #00FF41;
  --color-error: #FF3333;
  --color-warning: #FFB000;
}
```

### Typography

- **Font mono** : JetBrains Mono
- **Font sans** : Inter (fallback système)

---

*Document de référence pour le développement de Kidou.*
