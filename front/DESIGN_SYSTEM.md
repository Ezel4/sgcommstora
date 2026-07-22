# Design system — Sigmood IA

Référence UI du produit. Les tokens Tailwind v4 sont déclarés dans `src/app/globals.css` et les primitives réutilisables dans `src/components/ui`.

## Direction

Sigmood IA adopte une interface lumineuse, éditoriale et chaleureuse : fond ivoire, surfaces blanches légèrement translucides, texte presque noir, rayons généreux et ombres très douces. Le turquoise, le bleu et le vert sauge structurent les actions et les zones de marque sans envahir l’interface.

Le produit privilégie la clarté et l’action : une seule action principale par zone, des pages respirantes, des informations secondaires réellement secondaires et aucun effet décoratif qui ralentit l’usage.

## Tokens principaux

| Rôle | Token | Valeur | Usage |
|---|---|---|---|
| Fond | `base` | `#F8F7F3` | Canevas global ivoire |
| Fond secondaire | `surface-2` | `#F2EFE8` | Zones groupées et navigation |
| Surface | `surface`, `elevated` | `#FFFFFF` | Cartes, menus et modales |
| Surface atténuée | `cream-muted` | `#F3F3F1` | Contrôles et cartes secondaires |
| Texte principal | `ink` | `#101010` | Titres, valeurs et actions |
| Texte secondaire | `ink-2`, `ink-3` | `#6F6F6B` | Corps, métadonnées et aide |
| Action noire | `pill`, `forest` | `#111111` / `#101010` | CTA prioritaires et états actifs |
| Turquoise | `accent` | `#1FC5BE` | Sélection et signature de marque |
| Turquoise clair | `rose`, `amber` | `#8EDDD8` | Halos et surfaces illustrées |
| Bleu turquoise | `plum` | `#2498C8` | Graphiques et dégradés |
| Vert sauge | `sage`, `clay` | `#82A99E` | Graphiques et dégradés |
| Surface turquoise | `accent-soft` | `#DDF3F4` | États informatifs et focus doux |
| Bordure | `line` | `rgba(20,20,20,0.08)` | Séparations et contours |
| Succès | `success`, `success-soft` | Sémantique | États positifs |
| Attention | `warning`, `warning-soft` | Sémantique | Stocks et étapes à traiter |
| Danger | `danger`, `danger-soft` | Sémantique | Erreurs et actions destructives |

Les couleurs codées en dur sont réservées aux illustrations ou gradients de marque. Les informations métier utilisent toujours les tokens sémantiques.

Le dégradé de marque canonique est :

```css
linear-gradient(135deg, #82A99E 0%, #1FC5BE 55%, #2498C8 100%)
```

## Typographie

- Titres : Urbanist, puis Manrope en repli ; graisse 400–600.
- Interface et corps : Plus Jakarta Sans ; graisse 400–600.
- Corps standard : 14–16 px avec interligne confortable.
- Métadonnées : 12 px minimum, jamais pour une information essentielle.
- Titres de page : `clamp(2rem, 4vw, 3rem)` via `PageHeader`.

## Espacement et formes

- Grille d’espacement basée sur 4 px.
- Contrôles interactifs : 44 px minimum, 40 px seulement dans une zone très dense sur desktop.
- Champs : rayon 14–16 px.
- Cartes : rayon 20–24 px.
- Modales et panneaux majeurs : rayon 24–28 px.
- Largeur de contenu dashboard : 1 600 px maximum, avec 20–32 px de marge selon le viewport.

## Composants

- `PageHeader` est la structure canonique d’une page : contexte, titre, description, actions.
- `Button` porte la hiérarchie primary / secondary / ghost / danger.
- `Card` et les panneaux dashboard utilisent les mêmes surfaces, bordures et élévations.
- `Badge` / `StatusPill` emploient uniquement les tons sémantiques.
- `Input` / `Textarea` associent label, aide et erreur au champ.
- `EmptyState` explique la situation et propose une prochaine étape quand elle existe.
- Les loaders utilisent `Skeleton` et respectent `prefers-reduced-motion`.

## Accessibilité et mouvement

1. Contraste WCAG AA pour le texte et les contrôles.
2. Focus visible turquoise foncé sur tous les éléments interactifs.
3. Labels explicites et cibles tactiles d’au moins 44 px.
4. Aucun état transmis uniquement par la couleur.
5. Dialogues et drawers : focus initial, Échap, restauration du focus et verrouillage du scroll.
6. Animations de 160 à 300 ms, avec désactivation via `prefers-reduced-motion`.

## Responsive

- Mobile : une colonne, actions prioritaires visibles, contenus métier en cartes structurées.
- Tablette : grilles 2 colonnes, navigation en drawer.
- Desktop : sidebar avec libellés et contenu jusqu’à 1 600 px.
- Aucun défilement horizontal de page ; les informations secondaires peuvent être masquées, jamais l’action principale.
