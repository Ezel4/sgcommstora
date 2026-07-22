# PROGRESS.md — Sigmood IA

Suivi d'avancement du SaaS e-commerce AI-first. Mis à jour à chaque fin de phase.

---

## Décisions techniques notables

- **Stack réelle ≠ cahier des charges initial.** Le projet existant est en
  **Next.js 16 + React 19 + Tailwind v4** (et non Next 14 / Tailwind v3). On conserve
  le stack existant : il est plus récent, déjà installé et fonctionnel. Tailwind v4
  se configure en CSS (`@theme` dans `globals.css`), donc **pas de `tailwind.config.ts`**.
- **State / libs spec non installés.** Zustand, shadcn/ui, framer-motion, lucide-react
  ne sont pas dans `package.json`. Les composants de base sont **sans dépendance externe**
  (`cn()` maison, icônes SVG inline). À ajouter via `npm install` au moment où un module
  en a réellement besoin (ex. Zustand pour le state global, framer-motion pour animations avancées).
- **Aeonik (police payante)** : non livrable par l'IA. `@font-face` câblé vers
  `public/fonts/Aeonik-{Light,Bold}.woff2`. Fallback **DM Sans** (300/700) tant que
  les fichiers ne sont pas déposés. → Action utilisateur : déposer les fichiers (voir `public/fonts/README.md`).
- **Vert standardisé à `#25572A`** (le projet utilisait aussi `#06312E`) conformément au spec.
- Les dossiers vides parasites `../src` et `../public` à la racine du dossier OneDrive
  (créés par erreur, verrouillés par la sync) peuvent être supprimés manuellement.

---

## État de l'existant (audité)

Déjà présent dans `front/` avant cette session :
- Landing marketing complète (`(marketing)/page.tsx` + composants `components/marketing/*`).
- Dashboard : overview, produits, commandes, boutique, assistant-ia, images-ia, paramètres.
- Auth : login, register.
- Données : `types/commerce.ts` + `data/mock-commerce.ts` (mock FR), `lib/format.ts`, `lib/dashboard-navigation.ts`.

> ⚠️ Ces pages utilisent encore l'ancien style (blanc / slate / orange) et **ne respectent
> pas encore le design system**. Leur refonte sur les tokens organiques est planifiée
> (dashboard en priorité, voir « À faire »).

---

## Phases

### ✅ Phase 0 — Fondations (FAIT)
- [x] Audit du projet existant
- [x] `globals.css` réécrit : design system organique propre (crème `#FDFFF0` + vert `#25572A`),
      purge dark/violet/orange, tokens `@theme`, `@font-face` Aeonik, grain, keyframes, scrollbar/focus verts
- [x] `DESIGN_SYSTEM.md` (référence canonique des tokens)
- [x] `lib/utils.ts` (`cn` sans dépendance)
- [x] Composants UI de base : `Button`, `Card`, `Badge`, `Input`/`Textarea`, `Skeleton`, `EmptyState` + barrel `index.ts`
- [x] `StatusBadge` recoloré sur la palette organique
- [x] `public/fonts/README.md` (instructions Aeonik)
- [ ] **Checkpoint Phase 0 — en attente de validation**

### ⏳ Phase 1 — Fondations produit (À VENIR)
- [ ] Refonte **landing page** sur le design system propre (retirer la couche legacy `.glass-*`)
- [ ] Auth + Onboarding IA conversationnel
- [ ] Dashboard overview refondu sur tokens + primitives

### ⏳ Phase 2 — Core
- [ ] Mes boutiques (multi-boutiques, création par prompt)
- [ ] Éditeur de boutique (chat IA + preview split-screen)
- [ ] Catalogue produits (CRUD, génération IA, SEO, stock)
- [ ] Commandes (liste, détails, timeline statuts)

### ⏳ Phase 3 — Commerce & avancé
- [ ] Storefront public (produits, panier, checkout Stripe)
- [ ] Analytics (graphiques, top produits)
- [ ] Paramètres (compte, abonnement, intégrations clés API IA)

### ⏳ Phase 4 — [V2] (sur demande)
Marketing IA, variantes & retouche d'images, clients & remboursements, codes promo & livraison, domaines custom & équipe.

---

## À faire en priorité (post-checkpoint)
1. Déposer les fichiers Aeonik dans `public/fonts/`.
2. Refondre le **dashboard** (shell + pages) sur les tokens organiques et les primitives UI.
3. Refondre la **landing** et retirer la couche de compatibilité legacy de `globals.css`.
