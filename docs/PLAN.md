# Plan d'exécution - Kidou

## Vue d'ensemble

| Phase | Feature | Statut | Complexité |
|-------|---------|--------|------------|
| 1 | Setup projet | ✅ DONE | S |
| 2 | Design System & Styleguide | ✅ DONE | M |
| 3 | Auth | ⬜ TODO | M |
| 4 | Core Features | ⬜ TODO | L |
| 5 | Pages publiques | ⬜ TODO | M |
| 6 | Polish & Deploy | ⬜ TODO | S |

---

## Détails par phase

### Phase 1 : Setup projet
**Fichier détail** : [01-setup.md](./features/01-setup.md)

- [x] Créer structure documentation
- [x] Initialiser SvelteKit avec TypeScript
- [x] Installer dépendances
- [x] Setup variables CSS
- [x] Configurer .env.example
- [x] Setup Drizzle + connexion Neon
- [x] Créer schéma DB
- [x] Configurer Better-Auth

### Phase 2 : Design System & Styleguide
**Fichier détail** : [02-design-system.md](./features/02-design-system.md)

- [ ] Composants UI de base
- [ ] Composants Terminal
- [ ] Composants Project
- [ ] Composants Layout
- [ ] Page /styleguide

### Phase 3 : Auth
**Fichier détail** : [03-auth.md](./features/03-auth.md)

- [ ] Page login
- [ ] Page register
- [ ] Protection des routes
- [ ] Store user

### Phase 4 : Core Features
**Fichier détail** : [04-core-features.md](./features/04-core-features.md)

- [ ] Landing page
- [ ] Dashboard privé
- [ ] Création projet
- [ ] API parse-prd
- [ ] Édition milestones
- [ ] Update progression

### Phase 5 : Pages publiques
**Fichier détail** : [05-public-pages.md](./features/05-public-pages.md)

- [ ] Page profil public
- [ ] Page projet public
- [ ] SEO/OG

### Phase 6 : Polish & Deploy
**Fichier détail** : [06-polish.md](./features/06-polish.md)

- [ ] Animations terminal
- [ ] Responsive
- [ ] Gestion erreurs
- [ ] Limite 3 projets
- [ ] Deploy Vercel

---

## Prochaines étapes

1. Finir setup projet (Phase 1)
2. Créer composants UI de base
3. Implémenter auth
