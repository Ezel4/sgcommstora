"use client";

import { useState } from "react";

const items = [
  { q: "Faut-il une carte bancaire pour commencer ?", a: "Non. Le plan Découverte est gratuit et ne demande aucune carte bancaire." },
  { q: "Combien de temps pour avoir ma boutique ?", a: "Quelques minutes. Stora génère le design, la structure et une première collection, que vous ajustez ensuite par simple message." },
  { q: "Faut-il savoir coder ?", a: "Non, aucune compétence technique n'est requise. Vous décrivez votre projet, l'IA construit la boutique." },
  { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement ni condition. Vous gardez vos données et pouvez exporter votre catalogue." },
];

// FAQ à plat, 4 objections courantes seulement (pas de catégories/onglets comme
// sur la home) : sur une page de conversion, l'objectif est de lever les derniers
// freins avant le CTA final, pas de documenter tout le produit.
export function LandingFaqSimple() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="shell mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-light tracking-tight sm:text-3xl">
          Les questions qu'on nous pose le plus.
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = i === open;
            return (
              <div key={item.q} className="card-dark overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[1.02rem] text-ink">{item.q}</span>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[0.95rem] leading-relaxed text-ink-2">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
