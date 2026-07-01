# Polices Aeonik

Le design system de Stora AI utilise **Aeonik** (police commerciale).
Dépose ici les fichiers suivants, exactement avec ces noms :

```
public/fonts/
  Aeonik-Light.woff2   (poids 300)
  Aeonik-Light.woff    (poids 300, fallback)
  Aeonik-Bold.woff2    (poids 700)
  Aeonik-Bold.woff     (poids 700, fallback)
```

Le `@font-face` est déjà câblé dans `src/app/globals.css`.
Tant que les fichiers ne sont pas présents, l'app utilise **DM Sans** (300/700)
comme substitut visuellement proche — aucune erreur, le rendu reste cohérent.

> N'utilise que les graisses **300 (light)** et **700 (bold)** : le contraste
> bold/light est l'identité visuelle du projet. Jamais de 400 (regular).
