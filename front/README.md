# Sigmood IA — front

Application Next.js 16 du prototype Sigmood IA : landing page, onboarding, espace marchand, aperçu de boutique et back-office CRM.

## Prérequis

- Node.js 22 ou plus récent
- npm
- Un projet Supabase pour utiliser l'authentification et le CRM

## Installation

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Renseigner dans `.env.local` :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé-publique-anon>
```

Ne jamais placer de clé `service_role` dans une variable `NEXT_PUBLIC_*`.

En développement uniquement, l'absence de ces variables active un mode de démonstration local. En production, les espaces authentifiés échouent de façon fermée et redirigent vers la connexion avec un message de configuration.

## Commandes

```bash
npm run dev        # serveur de développement (Webpack)
npm run check      # ESLint + TypeScript + tests unitaires (Vitest)
npm run test       # tests unitaires seuls
npm run build      # build de production
npm run start      # serveur à partir du build
```

## Base de données Supabase

Le schéma, les fonctions RPC et les politiques RLS sont versionnés dans
[`supabase/`](supabase/README.md). Les appliquer avec `supabase db push`
(ou le SQL Editor) avant toute utilisation authentifiée réelle.

## État fonctionnel

- Authentification et garde admin : intégration Supabase.
- CRM et planning admin : intégration Supabase, avec validation serveur.
- Dashboard marchand (boutique, produits, commandes, clients) : lecture réelle
  depuis Supabase quand l'utilisateur possède une boutique, sinon jeu de
  démonstration signalé dans l'interface.
- Statistiques : encore sur données de démonstration (pas de table d'événements).
- Boutique publique : seules les boutiques `published` sont accessibles en
  production ; les brouillons peuvent être prévisualisés en développement.
- Formulaire de leads : ouvert en production, protégé par honeypot, contrôle de
  timing et rate-limit par IP.
- Paiement, livraison, domaine personnalisé, génération IA et envoi d'e-mails :
  interfaces de prototype, non connectées à des services réels.

Restent à faire avant une mise en production métier : provisionnement d'une
boutique à l'onboarding, écriture des vues Paramètres, tests E2E, et connexion
des services externes (paiement, IA, e-mails).

## Déploiement

Sur Vercel, définir `front` comme **Root Directory**, ajouter les deux variables Supabase à l'environnement de production, puis exécuter `npm run build` dans le pipeline.
