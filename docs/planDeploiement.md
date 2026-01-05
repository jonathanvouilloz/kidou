# Plan de Déploiement Production - Kidou

> Checklist complète pour déployer Kidou en production

---

## Prérequis

- [ ] Compte GitHub (repo déjà connecté)
- [ ] Compte Vercel
- [ ] Carte de crédit pour les services payants (Anthropic, éventuellement Polar)

---

## Étape 1 : Base de données Neon

### 1.1 Créer le compte et la base
1. Aller sur [neon.tech](https://neon.tech)
2. Se connecter avec GitHub
3. Créer un nouveau projet : `kidou-prod`
4. Région : choisir la plus proche (EU West pour Europe)
5. Copier la `DATABASE_URL` (format : `postgresql://user:password@host/database?sslmode=require`)

### 1.2 Appliquer le schéma
```bash
# En local avec la DATABASE_URL de prod
export DATABASE_URL="postgresql://..."
npm run db:push
```

### 1.3 Vérifier
- Aller dans Neon Dashboard > Tables
- Vérifier que les tables sont créées : `users`, `sessions`, `accounts`, `verifications`, `projects`, `milestones`, `follows`

**Variable à noter :**
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

---

## Étape 2 : Anthropic (Claude API)

### 2.1 Créer le compte
1. Aller sur [console.anthropic.com](https://console.anthropic.com)
2. Créer un compte
3. Ajouter une méthode de paiement (pay-as-you-go)

### 2.2 Générer la clé API
1. Settings > API Keys
2. Create Key : `kidou-prod`
3. Copier la clé (format : `sk-ant-api03-...`)

**Variable à noter :**
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## Étape 3 : Resend (Email)

### 3.1 Créer le compte
1. Aller sur [resend.com](https://resend.com)
2. Se connecter avec GitHub
3. Copier l'API Key par défaut ou en créer une nouvelle

### 3.2 Configurer le domaine (IMPORTANT pour production)
1. Settings > Domains > Add Domain
2. Entrer ton domaine : `kidou.app` (ou ton domaine)
3. Ajouter les records DNS chez ton registrar :
   - **DKIM** : `resend._domainkey` → valeur fournie
   - **SPF** : TXT record → `v=spf1 include:amazonses.com ~all`
   - **DMARC** (optionnel) : `_dmarc` → `v=DMARC1; p=none;`
4. Attendre la vérification (quelques minutes à quelques heures)

### 3.3 Mettre à jour le code
Modifier `src/lib/server/email.ts` :
```typescript
// Changer cette ligne
const FROM_ADDRESS = 'Kidou <noreply@kidou.app>';  // ton domaine
```

**Variable à noter :**
```
RESEND_API_KEY=re_...
```

---

## Étape 4 : Polar.sh (Subscriptions)

### 4.1 Créer le compte
1. Aller sur [polar.sh](https://polar.sh)
2. Se connecter avec GitHub
3. Créer une organisation : `kidou`

### 4.2 Créer le produit
1. Products > New Product
2. Nom : `Kidou Pro`
3. Prix : $5/mois (ou ton prix)
4. Type : Subscription
5. Copier le Product ID (format : `prod_...`)

### 4.3 Générer les tokens
1. Settings > Developers > Access Tokens
2. Create Token : `kidou-prod` avec permissions `products:read`, `checkouts:write`, `customers:write`
3. Copier le token (format : `polar_at_...`)

### 4.4 Configurer le webhook
1. Settings > Developers > Webhooks
2. Add Webhook :
   - URL : `https://kidou.app/api/webhook/polar`
   - Events : `subscription.created`, `subscription.updated`, `subscription.canceled`, `subscription.revoked`
3. Copier le Webhook Secret (format : `whsec_...`)

### 4.5 Variables à noter
```
POLAR_ACCESS_TOKEN=polar_at_...
POLAR_WEBHOOK_SECRET=whsec_...
POLAR_PRODUCT_ID_PRO=prod_...
PUBLIC_POLAR_SERVER=production
```

---

## Étape 5 : Better-Auth Secret

Générer un secret sécurisé de 32+ caractères :

```bash
# Option 1 : OpenSSL
openssl rand -base64 32

# Option 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Variable à noter :**
```
BETTER_AUTH_SECRET=ton_secret_genere_ici
```

---

## Étape 6 : Vercel

### 6.1 Connecter le projet
1. Aller sur [vercel.com](https://vercel.com)
2. Import Project > GitHub
3. Sélectionner le repo `kidou`
4. Framework : SvelteKit (auto-détecté)

### 6.2 Configurer les variables d'environnement
Settings > Environment Variables

**Variables privées (Production) :**
| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://...` |
| `BETTER_AUTH_SECRET` | `(secret généré)` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `RESEND_API_KEY` | `re_...` |
| `POLAR_ACCESS_TOKEN` | `polar_at_...` |
| `POLAR_WEBHOOK_SECRET` | `whsec_...` |
| `POLAR_PRODUCT_ID_PRO` | `prod_...` |

**Variables publiques (Production) :**
| Variable | Valeur |
|----------|--------|
| `PUBLIC_APP_URL` | `https://kidou.app` |
| `PUBLIC_POLAR_SERVER` | `production` |

### 6.3 Configurer le domaine
1. Settings > Domains
2. Add Domain : `kidou.app`
3. Configurer les DNS chez ton registrar :
   - `A` record : `76.76.21.21`
   - `CNAME` : `cname.vercel-dns.com`

### 6.4 Déployer
```bash
git push origin main
```
Ou déclencher un redéploiement depuis le dashboard Vercel.

---

## Étape 7 : Vérifications post-déploiement

### 7.1 Test d'inscription
1. Aller sur `https://kidou.app/auth/register`
2. Créer un compte
3. Vérifier réception de l'email de vérification
4. Cliquer sur le lien de vérification
5. Se connecter

### 7.2 Test de création de projet
1. Dashboard > New Project
2. Uploader un PRD ou entrer des milestones manuellement
3. Vérifier que l'extraction Claude fonctionne

### 7.3 Test de souscription (optionnel)
1. Aller sur la page pricing
2. Cliquer sur "Go Pro"
3. Compléter le checkout Polar (mode test d'abord si disponible)
4. Vérifier que le plan passe à "pro"

### 7.4 Test des pages publiques
1. Créer un projet public
2. Accéder à `https://kidou.app/tonusername`
3. Accéder à `https://kidou.app/tonusername/tonprojet`

---

## Récapitulatif des variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_SECRET="..."

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Resend
RESEND_API_KEY="re_..."

# Polar
POLAR_ACCESS_TOKEN="polar_at_..."
POLAR_WEBHOOK_SECRET="whsec_..."
POLAR_PRODUCT_ID_PRO="prod_..."

# Public
PUBLIC_APP_URL="https://kidou.app"
PUBLIC_POLAR_SERVER="production"
```

---

## Checklist finale

- [ ] Neon : Base créée + schéma appliqué
- [ ] Anthropic : Compte créé + clé API
- [ ] Resend : Compte créé + domaine vérifié + code mis à jour
- [ ] Polar : Compte créé + produit + webhook + tokens
- [ ] Better-Auth : Secret généré
- [ ] Vercel : Variables configurées + domaine configuré
- [ ] Test : Inscription fonctionne
- [ ] Test : Email de vérification reçu
- [ ] Test : Création projet fonctionne
- [ ] Test : Pages publiques accessibles

---

## Troubleshooting

### Email non reçu
- Vérifier les logs Resend
- Vérifier que le domaine est vérifié
- Vérifier les spams

### Erreur 500 sur /api/parse-prd
- Vérifier `ANTHROPIC_API_KEY`
- Vérifier les logs Vercel

### Webhook Polar ne fonctionne pas
- Vérifier l'URL du webhook dans Polar
- Vérifier `POLAR_WEBHOOK_SECRET`
- Tester avec un événement manuel depuis Polar

### Erreur de connexion DB
- Vérifier `DATABASE_URL`
- Vérifier que l'IP Vercel n'est pas bloquée par Neon

---

## Contacts support

- Neon : [neon.tech/docs](https://neon.tech/docs)
- Resend : [resend.com/docs](https://resend.com/docs)
- Polar : [docs.polar.sh](https://docs.polar.sh)
- Vercel : [vercel.com/docs](https://vercel.com/docs)
- Anthropic : [docs.anthropic.com](https://docs.anthropic.com)
