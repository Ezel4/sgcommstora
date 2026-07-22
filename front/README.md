# Stora AI — front

Application Next.js 16 du prototype Stora AI : landing page, onboarding, espace marchand, aperçu de boutique et back-office CRM.

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
npm run check      # ESLint puis vérification TypeScript
npm run build      # build de production
npm run start      # serveur à partir du build
```

## État fonctionnel

- Authentification et garde admin : intégration Supabase.
- CRM et planning admin : intégration Supabase, avec validation serveur.
- Dashboard marchand, commandes, clients et statistiques : données locales de démonstration, signalées dans l'interface.
- Boutique publique : seules les boutiques `published` sont accessibles en production ; les brouillons peuvent être prévisualisés en développement.
- Paiement, livraison, domaine personnalisé, génération IA et envoi d'e-mails : interfaces de prototype, non connectées à des services réels.

Avant une mise en production métier, ajouter les migrations versionnées et politiques RLS Supabase, remplacer les jeux de données locaux, mettre en place l'anti-abus du formulaire public et ajouter une suite de tests automatisés.

## Déploiement

Sur Vercel, définir `front` comme **Root Directory**, ajouter les deux variables Supabase à l'environnement de production, puis exécuter `npm run build` dans le pipeline.
