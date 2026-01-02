# Phase 2 : Design System & Styleguide

## Description

Création de tous les composants UI réutilisables et de la page styleguide pour visualiser l'ensemble.

## Tâches

### Composants UI (`src/lib/components/ui/`)

- [ ] Button.svelte (variants: primary, secondary, ghost / sizes: sm, md, lg)
- [ ] Input.svelte (text, email, password / états: error, disabled)
- [ ] Checkbox.svelte (checked, disabled)
- [ ] Card.svelte (slots: header, default, footer)
- [ ] Badge.svelte (variants: default, success, warning, error)
- [ ] Modal.svelte (overlay, close button, slots)
- [ ] Toast.svelte (success, error, info)
- [ ] Loader.svelte (spinner style terminal)
- [ ] Avatar.svelte (image ou initiales)

### Composants Terminal (`src/lib/components/terminal/`)

- [ ] Terminal.svelte (wrapper avec header dots)
- [ ] TerminalLine.svelte (numéro de ligne + contenu)
- [ ] TerminalProgress.svelte (affichage progression complète)
- [ ] TerminalDone.svelte (ASCII art "DONE")

### Composants Project (`src/lib/components/project/`)

- [ ] ProjectCard.svelte (carte projet pour dashboard)
- [ ] MilestoneList.svelte (liste de milestones)
- [ ] MilestoneItem.svelte (item avec checkbox)
- [ ] ProjectHeader.svelte (titre + stats)

### Composants Layout (`src/lib/components/layout/`)

- [ ] Header.svelte (logo, nav, user menu)
- [ ] Footer.svelte (liens, copyright)
- [ ] Sidebar.svelte (navigation dashboard)

### Page Styleguide

- [ ] Route /styleguide avec tous les composants
- [ ] Sections : Couleurs, Typography, Buttons, Inputs, etc.
- [ ] Mock data pour les démos

## Notes

- Référence design : voir PRD section "Design System"
- Font : JetBrains Mono (à télécharger dans static/fonts/)
- Dark mode only, pas de light mode
