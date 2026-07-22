"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AnimateIn from "./AnimateIn";

// lignes de perspective faibles (façon Powder)
const guide = {
  fill: "none",
  stroke: "rgba(238,234,228,0.12)",
  strokeWidth: 1,
};
const j = { strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/* Panneaux empilés en 3D avec icônes (fichier / play / globe) */
function IsoLayers() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
      <path d="M15 215 L285 80" {...guide} />
      <path d="M15 250 L285 115" {...guide} />

      {/* panneau arrière + globe */}
      <path d="M155 225 L220 190 L220 125 L155 160 Z" fill="rgba(255,255,255,0.028)" stroke="rgba(238,234,228,0.32)" strokeWidth={1.4} {...j} />
      <ellipse cx="188" cy="173" rx="12" ry="12" fill="none" stroke="rgba(238,234,228,0.34)" strokeWidth={1.1} />
      <ellipse cx="188" cy="173" rx="5" ry="12" fill="none" stroke="rgba(238,234,228,0.3)" strokeWidth={1} />
      <path d="M176 173 h24" stroke="rgba(238,234,228,0.3)" strokeWidth={1} {...j} />

      {/* panneau milieu + play */}
      <path d="M105 210 L170 175 L170 110 L105 145 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(238,234,228,0.5)" strokeWidth={1.4} {...j} />
      <path d="M126 162 L148 151 L126 140 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(238,234,228,0.5)" strokeWidth={1.3} {...j} />

      {/* panneau avant + lignes de texte */}
      <path d="M55 195 L120 160 L120 95 L55 130 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(238,234,228,0.62)" strokeWidth={1.5} {...j} />
      <path d="M70 150 h28 M70 140 h20 M70 130 h24" stroke="rgba(238,234,228,0.5)" strokeWidth={1.1} fill="none" {...j} />
    </svg>
  );
}

/* Touche de clavier 3D d'où jaillit une étincelle */
function IsoKey() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
      <path d="M20 205 L280 70" {...guide} />
      <path d="M20 240 L280 105" {...guide} />

      {/* face gauche */}
      <path d="M90 165 L150 200 L150 242 L90 207 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(238,234,228,0.45)" strokeWidth={1.4} {...j} />
      {/* face droite */}
      <path d="M150 200 L210 165 L210 207 L150 242 Z" fill="rgba(255,255,255,0.055)" stroke="rgba(238,234,228,0.5)" strokeWidth={1.4} {...j} />
      {/* dessus */}
      <path d="M150 130 L210 165 L150 200 L90 165 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(238,234,228,0.62)" strokeWidth={1.5} {...j} />
      <path d="M134 165 h32" stroke="rgba(238,234,228,0.5)" strokeWidth={1.2} {...j} />

      {/* étincelle */}
      <path d="M150 58 c4 30 12 38 34 41 c-22 3 -30 11 -34 41 c-4 -30 -12 -38 -34 -41 c22 -3 30 -11 34 -41 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(238,234,228,0.6)" strokeWidth={1.4} {...j} />
    </svg>
  );
}

/* Disque 3D avec bouton lecture */
function IsoRing() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
      <path d="M20 200 L280 65" {...guide} />
      <path d="M20 235 L280 100" {...guide} />

      {/* flanc du cylindre */}
      <path d="M75 150 L75 180 A75 42 0 0 0 225 180 L225 150" fill="rgba(255,255,255,0.035)" stroke="rgba(238,234,228,0.5)" strokeWidth={1.4} {...j} />
      {/* dessus */}
      <ellipse cx="150" cy="150" rx="75" ry="42" fill="rgba(255,255,255,0.06)" stroke="rgba(238,234,228,0.62)" strokeWidth={1.5} />
      {/* bouton lecture */}
      <path d="M138 134 L170 150 L138 166 Z" fill="rgba(255,255,255,0.09)" stroke="rgba(238,234,228,0.62)" strokeWidth={1.4} {...j} />
    </svg>
  );
}

const features = [
  {
    icon: <IsoLayers />,
    title: "Création par prompt",
    body: "Décrivez votre niche, votre style et votre cible. Sigmood IA génère nom, branding, palette et structure complète de la boutique.",
  },
  {
    icon: <IsoKey />,
    title: "Catalogue intelligent",
    body: "Titres, descriptions et balises SEO rédigés pour convertir. Vos fiches produits sont prêtes, optimisées et cohérentes.",
  },
  {
    icon: <IsoRing />,
    title: "Visuels produit IA",
    body: "Des images de produits photoréalistes générées et mises en scène en un clic, sans studio ni shooting.",
  },
];

export function Features() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ width: 40, left: 0 });

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const frac = Math.min(1, el.clientWidth / el.scrollWidth);
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setBar({ width: frac * 100, left: p * (100 - frac * 100) });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByDir = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="fonctionnalites" className="relative py-20 sm:py-32">
      <div className="shell">
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.6rem] sm:leading-[1.08]">
            Une seule IA pour concevoir, remplir et lancer votre boutique.
          </h2>
          <p className="mt-5 max-w-xl text-ink-2">
            Sigmood IA réunit le design, le catalogue et les visuels dans une interface unique,
            de l&apos;idée à la première vente.
          </p>
        </AnimateIn>
      </div>

      {/* Carrousel pleine largeur (façon Powder) */}
      <div
        ref={scrollerRef}
        onScroll={update}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pt-4 pb-12 md:px-8"
      >
        {features.map((feature) => (
          <article
            key={feature.title}
            className="card-dark flex w-[300px] shrink-0 snap-start flex-col p-5 sm:w-[380px]"
          >
            <div className="grid aspect-square place-items-center rounded-2xl border border-line bg-white/[0.02] p-8">
              {feature.icon}
            </div>
            <h3 className="mt-7 text-xl font-normal text-ink">{feature.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{feature.body}</p>
          </article>
        ))}
      </div>

      {/* Navigation : flèches + barre de progression */}
      <div className="shell mt-9 flex items-center gap-5">
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Précédent"
            onClick={() => scrollByDir(-1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition duration-200 hover:bg-white/[0.06]"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={() => scrollByDir(1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition duration-200 hover:bg-white/[0.06]"
          >
            →
          </button>
        </div>
        <div className="relative h-px flex-1 overflow-hidden bg-line">
          <span
            className="absolute inset-y-0 rounded-full bg-ink transition-[left,width] duration-200"
            style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
          />
        </div>
      </div>
    </section>
  );
}
