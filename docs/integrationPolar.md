# Plan : Migration Polar vers Better-Auth Plugin

## Contexte

Migration de l'implémentation standalone Polar (`@polar-sh/sdk` + `@polar-sh/sveltekit`) vers le plugin Better-Auth intégré (`@polar-sh/better-auth`).

**Environnement cible:** Production

## Avantages du plugin Better-Auth

- Intégration native avec Better-Auth
- Création automatique du customer Polar au signup
- Routes gérées automatiquement par Better-Auth
- État client centralisé via `authClient.customer`

---

## Pré-requis : Configuration Polar Dashboard

### 1. Créer le produit Pro (subscription)

Sur https://polar.sh (nouvelle ORG) :

1. **Products** > **New Product**
2. **Type:** Subscription (récurrent)
3. **Name:** `Kidou Pro`
4. **Price:** $X/month (à définir)
5. **Copier l'ID du produit** → pour `POLAR_PRODUCT_ID_PRO`

### 2. Générer un Access Token

1. **Settings** > **Organization** > **Access Tokens**
2. **Create Token** avec permissions : `products:read`, `checkouts:write`, `customers:read/write`
3. **Copier le token** → pour `POLAR_ACCESS_TOKEN`

### 3. Configurer le Webhook (après déploiement)

1. **Settings** > **Webhooks** > **Add Webhook**
2. **URL:** `https://kidou.dev/api/auth/polar/webhooks`
3. **Events:** `subscription.active`, `subscription.canceled`, `subscription.revoked`
4. **Copier le secret** → pour `POLAR_WEBHOOK_SECRET`

---

## Étapes de migration (code)

### 1. Installation du package

```bash
npm install @polar-sh/better-auth
```

Note: `@polar-sh/sdk` est déjà installé, le conserver.

### 2. Configurer le plugin côté serveur

**Fichier:** `src/lib/server/auth.ts`

Ajouter le plugin Polar avec ses sous-plugins :

```typescript
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { POLAR_ACCESS_TOKEN, POLAR_WEBHOOK_SECRET, POLAR_PRODUCT_ID_PRO } from '$env/static/private';
import { PUBLIC_POLAR_SERVER } from '$env/static/public';

const polarClient = new Polar({
  accessToken: POLAR_ACCESS_TOKEN,
  server: PUBLIC_POLAR_SERVER as 'sandbox' | 'production'
});

export const auth = betterAuth({
  // ... config existante
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            { productId: POLAR_PRODUCT_ID_PRO, slug: "pro" }
          ],
          successUrl: "/settings?checkout=success",
          authenticatedUsersOnly: true
        }),
        portal(),
        webhooks({
          secret: POLAR_WEBHOOK_SECRET,
          onSubscriptionActive: async (payload) => {
            const externalId = payload.data.customer?.externalId;
            console.log('[Polar] Subscription active:', { externalId });

            if (externalId) {
              await db
                .update(users)
                .set({
                  plan: 'pro',
                  polarCustomerId: payload.data.customer?.id,
                  updatedAt: new Date()
                })
                .where(eq(users.id, externalId));
            }
          },
          onSubscriptionCanceled: async (payload) => {
            const externalId = payload.data.customer?.externalId;
            console.log('[Polar] Subscription canceled:', { externalId });

            if (externalId) {
              await db
                .update(users)
                .set({
                  plan: 'free',
                  updatedAt: new Date()
                })
                .where(eq(users.id, externalId));
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const externalId = payload.data.customer?.externalId;
            console.log('[Polar] Subscription revoked:', { externalId });

            if (externalId) {
              await db
                .update(users)
                .set({
                  plan: 'free',
                  updatedAt: new Date()
                })
                .where(eq(users.id, externalId));
            }
          }
        })
      ]
    })
  ]
});
```

### 3. Configurer le client

**Fichier:** `src/lib/auth-client.ts`

```typescript
import { createAuthClient } from 'better-auth/svelte';
import { polarClient } from "@polar-sh/better-auth/client";
import { PUBLIC_APP_URL } from '$env/static/public';

export const authClient = createAuthClient({
  baseURL: PUBLIC_APP_URL,
  plugins: [polarClient()]
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  changePassword,
  deleteUser
} = authClient;
```

### 4. Mettre à jour la page Settings

**Fichier:** `src/routes/settings/+page.svelte`

Ajouter l'import du client :

```svelte
<script lang="ts">
  import { authClient } from '$lib/auth-client';
  // ... autres imports
</script>
```

Remplacer les redirections manuelles :

```svelte
<!-- AVANT -->
<Button variant="primary" onclick={() => (window.location.href = '/api/checkout')}>
  Upgrade to Pro
</Button>

<Button variant="secondary" onclick={() => (window.location.href = '/api/portal')}>
  Manage Subscription
</Button>

<!-- APRÈS -->
<Button variant="primary" onclick={() => authClient.checkout({ slug: 'pro' })}>
  Upgrade to Pro
</Button>

<Button variant="secondary" onclick={() => authClient.customer.portal()}>
  Manage Subscription
</Button>
```

### 5. Supprimer les anciennes routes

Supprimer ces fichiers (remplacés par le plugin) :

- `src/routes/api/checkout/+server.ts`
- `src/routes/api/portal/+server.ts`
- `src/routes/api/webhook/polar/+server.ts`

### 6. Supprimer `@polar-sh/sveltekit`

```bash
npm uninstall @polar-sh/sveltekit
```

Le fichier `src/lib/server/polar.ts` peut aussi être supprimé (le client sera dans `auth.ts`).

### 7. Configurer le webhook sur Polar Dashboard

**Nouvelle URL webhook:** `https://kidou.dev/api/auth/polar/webhooks`

(Le plugin Better-Auth expose automatiquement cette route)

### 8. Variables d'environnement

Mettre à jour avec les nouvelles valeurs de ta nouvelle ORG :

**Local (`.env`):**
```env
POLAR_ACCESS_TOKEN="polar_oat_xxx"        # Nouveau token
POLAR_WEBHOOK_SECRET="whsec_xxx"          # Nouveau secret
POLAR_PRODUCT_ID_PRO="prod_xxx"           # Nouvel ID produit
PUBLIC_POLAR_SERVER="production"          # Production
```

**Vercel Dashboard:**
Mettre à jour les mêmes variables dans Settings > Environment Variables

---

## Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `src/lib/server/auth.ts` | Ajouter plugin Polar |
| `src/lib/auth-client.ts` | Ajouter polarClient |
| `src/routes/settings/+page.svelte` | Utiliser authClient.checkout/portal |
| `src/lib/server/polar.ts` | Supprimer |
| `src/routes/api/checkout/+server.ts` | Supprimer |
| `src/routes/api/portal/+server.ts` | Supprimer |
| `src/routes/api/webhook/polar/+server.ts` | Supprimer |

---

## Ordre d'exécution recommandé

1. **Dashboard Polar** : Créer produit + Access Token
2. **Code** : Migration vers Better-Auth plugin
3. **Local** : Mettre à jour `.env` et tester
4. **Vercel** : Mettre à jour les variables d'environnement
5. **Déployer** : `git push`
6. **Dashboard Polar** : Configurer le webhook avec la nouvelle URL
7. **Test** : Faire un achat test

---

## Sources

- [Polar Better-Auth Adapter](https://polar.sh/docs/integrate/sdk/adapters/better-auth)
- [Better Auth Polar Plugin](https://www.better-auth.com/docs/plugins/polar)
- [@polar-sh/better-auth npm](https://www.npmjs.com/package/@polar-sh/better-auth)
