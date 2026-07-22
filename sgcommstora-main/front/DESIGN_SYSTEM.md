# DESIGN_SYSTEM.md — Stora AI

Référence canonique de la charte « Sigmood mineral interface ». Les tokens sont déclarés dans `src/app/globals.css` via Tailwind v4.

## Direction visuelle

Interface claire, minérale et calme : fond gris mat, cartes légèrement plus claires, texte noir, formes généreusement arrondies et accent aqua–cyan utilisé avec parcimonie. L’interface reste plate et précise, avec des ombres très douces.

## Couleurs

| Rôle | Token | Valeur |
|---|---|---|
| Fond | `base` | `#dedede` |
| Panneau | `surface` | `#ececec` |
| Surface secondaire | `surface-2` | `#e7e7e7` |
| Carte élevée | `elevated` | `#f2f2f2` |
| Texte | `ink` | `#111111` |
| Texte secondaire | `ink-2` | noir à 66 % |
| Texte discret | `ink-3` | noir à 48 % |
| Bordure | `line` | noir à 8 % |
| Accent principal | `accent` | `#1fc5be` |
| Accent doux | `accent-soft` | aqua à 13 % |
| Aqua minéral | `clay` | `#82a99e` |
| Cyan | `amber` | `#2498c8` |

Les dégradés de marque suivent toujours l’ordre `#82a99e → #1fc5be → #2498c8`. Le noir plein est réservé aux CTA prioritaires et aux états actifs.

## Typographie

- Titres : Manrope 400/500, interlettrage serré (`-0.045em`).
- Interface et corps : Plus Jakarta Sans 400/500/600.
- Titres courts, directs, avec une hiérarchie fondée sur la taille plutôt que sur le gras.

## Formes et composants

- Boutons et badges : rayon complet (`rounded-full`).
- Cartes principales : 23 px environ.
- Champs et éléments de navigation : 12 à 16 px.
- Cartes : `surface` ou `elevated`, bordure `line`, ombre discrète.
- Barre de navigation : surface translucide grise avec flou léger.
- États actifs : fond noir + texte blanc, ou accent aqua pour un indicateur fin.

## Usage de l’accent

L’accent aqua–cyan sert aux graphiques, marqueurs, états sélectionnés, illustrations et zones de mise en avant. Il ne remplace pas le noir pour le texte courant et ne doit pas colorer de grandes portions de l’interface hors dégradé décoratif.

## Règles

1. Réutiliser les tokens et les composants de `src/components/ui`.
2. Éviter toute nouvelle couleur codée en dur hors palette sémantique.
3. Conserver des contrastes WCAG AA et des focus visibles aqua.
4. Garder les animations lentes, courtes et non intrusives.
5. Prévoir `prefers-reduced-motion` pour tout mouvement continu.
