# HANDOFF — Stora AI (passation de session)

> Document de reprise pour une nouvelle session Claude, **après déplacement du projet hors de OneDrive**.
> Lis-le en premier. Tout est en français, le code en place est commenté.

---

## 0. Contexte ultra-court

- **Projet** : *Stora AI* — landing marketing (Next.js 16 + React 19 + Tailwind v4), thème sombre premium « Dusk + Liquid Glass ». L'app réelle est dans le sous-dossier **`front/`** (dépôt git).
- **Objectif de la session précédente** : améliorer l'interface (nouveaux blocs, animations 3D, scroll animations), corriger les bugs de lancement, éviter les conflits de paquets.
- **Découverte majeure** : tous les bugs de lancement venaient du fait que le projet était **dans un dossier OneDrive**. Le projet a donc été **déplacé en local** (ex. `C:\dev\Sigmood-commerce-ai`).

### Pourquoi OneDrive cassait tout
1. **EPERM au démarrage** — OneDrive verrouille `.next` pendant la synchro → `Error: EPERM: operation not permitted, rmdir ...\.next\...`.
2. **Modules « déshydratés »** — OneDrive « Fichiers à la demande » transforme des fichiers de `node_modules` en placeholders cloud non téléchargés → `Cannot find module 'next/dist/compiled/next-server/app-route.runtime.prod.js'`, dossiers `gsap`/`lenis` vides, etc.

Hors de OneDrive, ces deux problèmes **disparaissent**. Aucun contournement n'est nécessaire (les jonctions/`distDir` custom testés pendant la session ont été **retirés** : la config est redevenue standard).

---

## 1. ✅ Ce qui a été FAIT

### A. Correctifs de lancement / paquets
- **Conflit gsap/lenis résolu.** Avant : `SmoothScroll` chargeait GSAP **3.13** + Lenis depuis un **CDN**, alors que `package.json` déclarait `gsap ^3.15` (dossiers `node_modules/gsap` et `lenis` **vides** à cause de OneDrive). Maintenant : `gsap@3.15.0` + `lenis@1.3.23` **installés** et **importés depuis npm** (plus de CDN, plus de conflit de version, plus de dépendance réseau).
- **Warning « multiple lockfiles »** corrigé via `next.config.ts` (`turbopack.root` + `outputFileTracingRoot` ancrés sur le dossier `front`).
- **Warning CSS** corrigé : l'`@import` Google Fonts (Hanken Grotesk) est désormais **avant** `@import "tailwindcss"` dans `globals.css`.
- **Contournements OneDrive retirés** (config redevenue standard) : plus de `distDir: ".next-local"`, plus de scripts `predev/prebuild`, script `scripts/ensure-build-dir.cjs` supprimé. `start.bat` simplifié (ne demande plus de mettre OneDrive en pause).

### B. Nouveaux blocs (composants créés)
Tous dans `front/src/components/marketing/` :
- **`LogoMarquee.tsx`** — bandeau de logos partenaires en défilement infini (marquee CSS, pause au survol).
- **`HowItWorks.tsx`** — section « Comment ça marche » : 4 étapes numérotées avec ligne de liaison, révélées en cascade au scroll.
- **`Stats.tsx`** — bande de statistiques avec **compteurs animés** (comptent de 0 à la valeur quand le bloc entre dans l'écran).
- **`Testimonials.tsx`** — 3 témoignages en **cartes 3D** (composant `Tilt`).

### C. Animations 3D
- **`Tilt.tsx`** (nouveau) — wrapper 3D réutilisable : perspective + rotation qui suit le curseur + reflet lumineux. Sans dépendance.
- Appliqué sur : les cartes **Features**, les cartes **Testimonials**, et l'**aperçu chat du Hero**.

### D. Scroll animations (moteur réécrit)
`SmoothScroll.tsx` réécrit (GSAP + ScrollTrigger + Lenis en **npm**). Conventions via data-attributes :
- `[data-reveal]` (+ variantes `="up|left|right|scale"`, `[data-reveal-delay]`) — apparition au scroll.
- `[data-stagger]` — anime les enfants directs en cascade.
- `[data-parallax="n"]` — parallaxe au scroll.
- `[data-counter="n"]` (+ `[data-counter-decimals]`) — compteur animé.
- Respect de **`prefers-reduced-motion`** (désactive Lenis + les mouvements continus).
- `AnimateIn.tsx` mis à jour pour câbler `direction` + `delay`.

### E. Fichiers modifiés (récap)
| Fichier | Changement |
|--------|-----------|
| `front/src/components/marketing/SmoothScroll.tsx` | CDN → npm, moteur de scroll enrichi |
| `front/src/components/marketing/AnimateIn.tsx` | `direction` + `delay` câblés |
| `front/src/components/marketing/Tilt.tsx` | **créé** (3D tilt) |
| `front/src/components/marketing/LogoMarquee.tsx` | **créé** |
| `front/src/components/marketing/HowItWorks.tsx` | **créé** |
| `front/src/components/marketing/Stats.tsx` | **créé** |
| `front/src/components/marketing/Testimonials.tsx` | **créé** |
| `front/src/components/marketing/Features.tsx` | Tilt + `data-stagger` |
| `front/src/components/marketing/Hero.tsx` | Tilt autour du `ChatPreview` |
| `front/src/app/(marketing)/page.tsx` | nouveaux blocs insérés + halo décoratif ajouté |
| `front/src/app/globals.css` | styles tilt + marquee + `prefers-reduced-motion`, ré-ordre `@import` |
| `front/next.config.ts` | `turbopack.root` + `outputFileTracingRoot` |
| `front/tsconfig.json`, `.gitignore`, `eslint.config.mjs`, `next-env.d.ts`, `start.bat` | nettoyage / standard |

**Ordre final des sections** (`page.tsx`) : Navbar · Hero · LogoMarquee · Features · HowItWorks · Stats · Integrations · Testimonials · Pricing · Faq · FinalCta · Footer.

### Statut de vérification
- `npm run build` : **compilation OK** (`✓ Compiled successfully`, TypeScript OK). L'unique échec observé était au stade « collecting page data » **uniquement à cause de OneDrive** (module déshydraté) → doit passer en local.
- Le dev server répondait `GET / 200` (avant la relocalisation).

---

## 2. ⏳ Ce qu'il RESTE à faire (par ordre)

1. **Installer + lancer dans le nouveau chemin** (priorité 1 — valider que les bugs de lancement ont disparu) :
   ```powershell
   cd "<NOUVEAU_CHEMIN>\front"
   npm install
   npm run dev      # http://localhost:3000  (ou start.bat -> port 8080)
   ```
   ✅ Vérifier : démarrage **sans EPERM**, **sans « Cannot find module »**.

2. **Valider le build de production** :
   ```powershell
   npm run build
   ```
   Doit aller jusqu'au bout (« Generating static pages », table des routes) — l'échec précédent était dû à OneDrive uniquement.

3. **Vérification visuelle** (idéalement via les outils preview/screenshot) : confirmer le rendu et l'animation des 4 nouveaux blocs (LogoMarquee, HowItWorks, Stats avec compteurs, Testimonials 3D), du tilt sur Hero/Features, et des reveals au scroll. Tester aussi le mobile + `prefers-reduced-motion`.

4. **Supprimer la copie OneDrive** une fois le local validé : `C:\Users\muham\OneDrive\Sigmood commerce ai` (la sauvegarde, c'est git → `git push`).

### Points d'attention / décisions ouvertes
- **Polices Aeonik manquantes** : `globals.css` déclare `@font-face` Aeonik mais `public/fonts/` ne contient pas les `.woff2` → 404 en dev, fallback **Hanken Grotesk** (Google Fonts). Décider : déposer les fichiers Aeonik **ou** retirer les `@font-face` pour supprimer les 404.
- **Docs obsolètes** : `front/DESIGN_SYSTEM.md` et `front/PROGRESS.md` décrivent un thème **crème + vert forêt**, mais l'implémentation réelle est le thème **sombre « Dusk »**. Les docs sont en retard sur le code — à réaligner si on s'y fie.
- **`.claude/launch.json`** (créé pour l'outil preview) pointe vers `front` via `npm --prefix` sur le port 8080 — purement local, sans impact.

---

## 3. Repères utiles
- App : `front/` · pages marketing : `front/src/components/marketing/` · styles & tokens : `front/src/app/globals.css` (Tailwind v4 `@theme`).
- Tokens couleur clés : `--color-base #0a0a0c`, encres `--color-ink*`, accents `--color-rose #cd9089`, `--color-accent #54b8a8`.
- Scripts : `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.
