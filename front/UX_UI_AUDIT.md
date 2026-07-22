# Audit UX/UI — Sigmood IA

Audit rapide réalisé sur l’ensemble des routes et composants visuels du projet, avant la passe de refonte. La logique métier, les appels Supabase et les modèles de données restent hors périmètre.

## Problèmes critiques observés

1. La navigation dashboard était réduite à une rail d’icônes sans libellés, y compris sur mobile, ce qui rendait les zones du produit difficiles à identifier.
2. La topbar dupliquait la navigation au lieu d’exposer le contexte de la boutique et les actions utiles.
3. Produits, commandes et clients étaient présentés comme des lignes compactes sans en-têtes, recherche ni structure mobile claire.
4. Le dashboard d’accueil montrait beaucoup de chiffres mais expliquait peu ce qui fonctionne, ce qui requiert une action et la prochaine étape recommandée.
5. De nombreuses informations métier descendaient entre 9 et 11 px, notamment dans les cartes, badges et graphiques.
6. Les pages n’utilisaient pas de structure commune pour le contexte, le titre, la description et les actions.
7. Le design system mélangeait plusieurs familles de boutons, cartes, badges et champs, ainsi que des noms de couleurs devenus trompeurs.
8. Les états vides se limitaient souvent à une phrase et les modules Assistant IA, Images IA et Paramètres étaient de simples placeholders.

## Incohérences principales

- Marque visible alternant entre Stora AI, Stora et Sigmood.
- Rayons, surfaces, ombres et graisses différents selon les pages.
- Topbars admin et dashboard au comportement différent.
- Filtres analytics dupliqués dans plusieurs panneaux.
- Contrôles tactiles inférieurs à 44 px et drawers sans gestion complète du focus.
- Champs dupliqués malgré une primitive `Input` existante.
- Cartes de boutique publique animées au survol alors qu’elles ne sont pas interactives.

## Priorités appliquées

1. Recentrer les tokens sur la palette Sigmood IA : ivoire, turquoise, bleu turquoise et vert sauge.
2. Créer un `PageHeader` partagé et harmoniser les primitives de base.
3. Refaire le shell dashboard, la sidebar groupée et la topbar contextuelle.
4. Rendre l’accueil orienté décision et prochaine action.
5. Restructurer Produits, Commandes et Clients avec recherche, filtres et vues mobiles lisibles.
6. Clarifier Statistiques, Boutique et les états guidés des modules à venir.
7. Corriger les écarts d’accessibilité des formulaires, modales et contrôles mobiles.
8. Harmoniser les écrans d’authentification, l’admin, le marketing secondaire et la boutique publique.

## Pages les plus concernées

- Priorité haute : shell dashboard, accueil, produits, commandes, clients.
- Priorité moyenne : statistiques, boutiques, assistant IA, images IA, paramètres.
- Finitions transverses : login, onboarding, admin CRM/planning, landing lancement et boutique publique.

## Contraintes respectées

- Aucun changement d’API, de schéma ou de logique métier.
- Aucune dépendance UI supplémentaire.
- Réutilisation des données et routes existantes.
- Les fonctionnalités absentes restent présentées honnêtement comme à venir ; aucun faux bouton d’action n’est ajouté.
