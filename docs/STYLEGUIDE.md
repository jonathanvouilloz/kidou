# Styleguide - Kidou

## Conventions de nommage

### Fichiers

| Type | Convention | Exemple |
|------|------------|---------|
| Composants Svelte | PascalCase | `Button.svelte`, `TerminalProgress.svelte` |
| Fichiers utilitaires | camelCase | `parsing.ts`, `animations.ts` |
| Routes | kebab-case | `/auth/login`, `/project/new` |
| CSS | kebab-case | `terminal-progress.css` |

### Code

| Type | Convention | Exemple |
|------|------------|---------|
| Variables | camelCase | `const projectName` |
| Constantes | SCREAMING_SNAKE_CASE | `const MAX_PROJECTS = 3` |
| Fonctions | camelCase | `function parseMarkdown()` |
| Types/Interfaces | PascalCase | `type Project`, `interface Milestone` |
| CSS classes | kebab-case | `.terminal-line`, `.btn-primary` |

## Structure des fichiers

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # Composants génériques réutilisables
│   │   ├── terminal/     # Composants spécifiques terminal
│   │   ├── project/      # Composants liés aux projets
│   │   └── layout/       # Header, Footer, Sidebar
│   ├── server/
│   │   ├── db/           # Schéma Drizzle et connexion
│   │   ├── auth.ts       # Config Better-Auth
│   │   └── llm.ts        # Wrapper Claude API
│   ├── stores/           # Svelte stores
│   ├── utils/            # Fonctions utilitaires
│   └── styles/           # CSS globaux
└── routes/               # Pages SvelteKit
```

## Patterns utilisés

### Imports

Toujours utiliser les alias SvelteKit :

```typescript
// Bien
import Button from '$lib/components/ui/Button.svelte';
import { db } from '$lib/server/db';

// Éviter
import Button from '../../../lib/components/ui/Button.svelte';
```

### Props Svelte

Typer avec JSDoc ou TypeScript :

```svelte
<script>
  /** @type {'primary' | 'secondary' | 'ghost'} */
  export let variant = 'primary';

  /** @type {boolean} */
  export let disabled = false;
</script>
```

### Events

Toujours forwarder les events communs :

```svelte
<button on:click on:focus on:blur>
  <slot />
</button>
```

### CSS

- Variables CSS pour tout ce qui est configurable
- Mobile-first (styles de base pour mobile, media queries pour desktop)
- Styles scopés dans les composants

## Conventions de commits

Format : Conventional Commits

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de code) |
| `refactor` | Refactoring |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, dépendances |

### Exemples

```
feat(auth): add login form component
fix(api): handle null response from server
docs: update README with setup instructions
style(terminal): fix indentation in TerminalProgress
refactor(db): extract query helpers
test(parsing): add unit tests for milestone extraction
chore: update dependencies
```

## Design tokens

### Couleurs

```css
:root {
  /* Background */
  --color-bg: #0D0D0D;
  --color-bg-elevated: #1A1A1A;
  --color-bg-hover: #262626;

  /* Border */
  --color-border: #333333;
  --color-border-subtle: #222222;

  /* Text */
  --color-text: #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-muted: #666666;

  /* Accent */
  --color-accent: #FFFFFF;

  /* Semantic */
  --color-success: #00FF41;
  --color-error: #FF3333;
  --color-warning: #FFB000;
}
```

### Typography

```css
:root {
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
}
```

### Spacing

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```
