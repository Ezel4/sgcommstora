# DESIGN_SYSTEM.md — Stora AI

Référence canonique des tokens. **Tout module doit réutiliser ces tokens et les
composants `src/components/ui/`. Jamais de valeur en dur, jamais de composant dupliqué.**

Implémentation : Tailwind v4 via `@theme` dans `src/app/globals.css`.

---

## 1. Direction visuelle

Organique, premium, *nature-tech* — « si Aesop et Linear avaient un enfant ».
Light mode crème, propre, aéré, sophistiqué. Le contraste typographique **bold/light est l'identité du projet.**

Interdits absolus : noir `#000`, blanc pur `#FFF`, gris froids (slate), gradient violet-bleu, orange.

---

## 2. Couleurs

### Surfaces (crème)
| Token | Valeur | Usage |
|-------|--------|-------|
| `cream` | `#FDFFF0` | Fond principal |
| `cream-soft` | `#F5F7E6` | Fond secondaire |
| `cream-muted` | `#EDF2D9` | Fond tertiaire / hover |
| `cream-elevated` | `#FBFDE9` | Cartes surélevées |

### Encre (vert forêt)
| Token | Valeur | Usage |
|-------|--------|-------|
| `forest` | `#25572A` | Texte, accents, boutons |
| `forest-deep` | `#06312E` | Titres très forts |
| `forest-700` | `#1F4A23` | Hover bouton primaire |
| `forest-soft` | `rgba(37,87,42,0.08)` | Fonds subtils |
| `forest-muted` | `rgba(37,87,42,0.15)` | Fonds / bordures moyens |

### Texte (opacités du vert)
`text-forest` (100 %) · `text-forest/70` (secondaire) · `text-forest/50` (tertiaire) · `text-forest/35` (muet / placeholder).

### Bordures
`stroke` `rgba(37,87,42,0.12)` · `stroke-strong` `rgba(37,87,42,0.22)` · `stroke-focus` `rgba(37,87,42,0.55)`.

### Sémantique (désaturée, organique)
| Token | Valeur |
|-------|--------|
| `success` | `#3A7D42` (+ `success-soft`) |
| `warning` | `#B9821F` (+ `warning-soft`) |
| `danger` | `#A23A2E` (+ `danger-soft`) |

> Accessibilité : `#25572A` sur `#FDFFF0` ≈ contraste **7:1** (WCAG AAA pour texte normal).

---

## 3. Typographie — Aeonik UNIQUEMENT

- **Bold (700)** : titres, prix, CTA, labels forts.
- **Light (300)** : corps de texte, descriptions, labels.
- **Jamais 400 (regular).** `body` est en 300, `h1–h6` et `strong` en 700.
- Fichiers à déposer dans `public/fonts/` (voir `public/fonts/README.md`).
- Fallback temporaire tant que les fichiers Aeonik ne sont pas fournis : **DM Sans** (300/700).
- Titres : `letter-spacing: -0.02em`, `line-height: 1.1`.

---

## 4. Rayons, ombres, easing

- Rayons : boutons/badges `rounded-full` ; cartes `rounded-2xl` (16px) ; champs `rounded-xl`.
- Ombres : `--shadow-soft`, `--shadow-organic`, `--shadow-card`, `--shadow-card-hover` (toutes en `rgba(37,87,42,…)`).
- Easing : `--ease-out-expo`, `--ease-out-cubic`, `--ease-in-out-expo`.

---

## 5. Éléments signature

- Texture **grain** : classe `.grain-overlay` (overlay SVG noise à 4 % d'opacité).
- Bordures vertes fines `stroke`.
- Animations staggerées : `.animate-fade-up` + `.delay-100…700`.
- Boutons vert plein sur crème.
- Hover cartes : translation `-2px` + ombre organique renforcée.

---

## 6. Animations disponibles

`animate-fade-in`, `animate-fade-up` (alias `animate-fade-in-up`, `animate-fadeInUp`),
`animate-fade-in-down`, `animate-scale-in`, `animate-float`, `animate-drift`,
`animate-pulse-soft`. Délais : `delay-100…700` / `animation-delay-100…300`.
Scroll-reveal : `.animate-in-block` + `.animate-in--up|left|right` + `.animate-in--visible`.
Skeleton : classe `.skeleton-shimmer`.

---

## 7. Composants UI de base (`src/components/ui/`)

| Composant | Variantes / props clés |
|-----------|------------------------|
| `Button` | `variant` (primary, secondary, ghost, danger), `size` (sm, md, lg), `isLoading`, `fullWidth` |
| `Card` (+ `CardHeader/Title/Description/Content/Footer`) | `variant` (default, elevated, flat), `interactive` |
| `Badge` | `tone` (neutral, forest, success, warning, danger, ai) |
| `Input` / `Textarea` | `label`, `hint`, `error` |
| `Skeleton` / `SkeletonCard` | `rounded` (sm, md, lg, full) |
| `EmptyState` | `title`, `description`, `icon`, `action` |
| `StatusBadge` | `tone` (positive, neutral, warning, danger, ai) — palette organique |

Import groupé : `import { Button, Card, Badge } from "@/components/ui";`

Aucune dépendance externe : `cn()` maison (`src/lib/utils.ts`), icônes inline.

---

## 8. Règles d'or

1. Réutiliser tokens + composants UI — ne jamais dupliquer ni mettre de valeur en dur.
2. Crème + vert seulement — pas de noir, blanc pur, gris froid, violet, orange.
3. Aeonik bold/light partout — contraste sacré, jamais de 400.
4. 3 états obligatoires par vue : empty, loading, error.
5. WCAG AA minimum (vert sur crème ≈ 7:1).
