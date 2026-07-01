"use client";

import dynamic from "next/dynamic";
import AnimateIn from "./AnimateIn";

// La scène WebGL (Three.js / R3F) ne tourne que côté client.
const Orbit3D = dynamic(() => import("./Orbit3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-20 rounded-[28%] border border-line-strong bg-elevated shadow-[0_0_50px_-6px_rgba(205,144,137,0.45)]" />
    </div>
  ),
});

export function Integrations() {
  return (
    <section id="integrations" className="relative overflow-hidden py-20 sm:py-32">
      <div className="shell">
        <div className="grid items-end gap-8 md:grid-cols-2">
          <AnimateIn>
            <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
              Connecté aux outils qui font tourner votre commerce.
            </h2>
          </AnimateIn>
          <AnimateIn direction="right">
            <p className="text-ink-2 md:pb-2">
              Paiements, génération de texte et d'images, stockage, authentification :
              Stora s'appuie sur les meilleurs services et orchestre tout pour vous, sans
              configuration technique.
            </p>
          </AnimateIn>
        </div>
      </div>

      {/* orbite 3D (WebGL) — pleine largeur, sans cadre carré */}
      <AnimateIn className="relative mt-4 h-[clamp(440px,58vw,720px)] w-full">
        <Orbit3D />
      </AnimateIn>
    </section>
  );
}
