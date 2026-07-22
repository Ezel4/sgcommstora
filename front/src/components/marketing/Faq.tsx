"use client";

import { useState } from "react";

type QA = { q: string; a: string };
type Category = { id: string; label: string; items: QA[] };

const categories: Category[] = [
  {
    id: "general",
    label: "Général",
    items: [
      { q: "Faut-il savoir coder pour utiliser Sigmood IA ?", a: "Non. Vous décrivez votre projet en langage naturel et l'IA construit la boutique. Aucune compétence technique n'est requise." },
      { q: "Combien de temps pour créer une boutique ?", a: "Quelques minutes. Sigmood IA génère le design, la structure et une première collection de produits, que vous ajustez ensuite par simple message." },
      { q: "Puis-je gérer plusieurs boutiques ?", a: "Oui, selon votre plan. Vous pilotez toutes vos boutiques depuis un tableau de bord unifié." },
    ],
  },
  {
    id: "ia",
    label: "IA & capacités",
    items: [
      { q: "Comment sont générés les visuels produit ?", a: "Sigmood IA s'appuie sur des modèles de génération d'images pour créer des visuels photoréalistes et les mettre en scène, sans shooting." },
      { q: "Les textes sont-ils optimisés pour le SEO ?", a: "Oui. Titres, descriptions et balises méta sont rédigés pour le référencement et adaptés au ton de votre marque." },
      { q: "Puis-je modifier ce que l'IA propose ?", a: "Toujours. Vous gardez le contrôle : chaque élément se modifie par prompt ou manuellement." },
    ],
  },
  {
    id: "securite",
    label: "Intégrations & sécurité",
    items: [
      { q: "Quels services Sigmood IA connecte-t-il ?", a: "Paiements, génération de texte et d'images, stockage et authentification sont intégrés et orchestrés automatiquement." },
      { q: "Les paiements sont-ils sécurisés ?", a: "Oui. Les paiements passent par un prestataire certifié ; Sigmood IA ne stocke jamais les données de carte." },
      { q: "À qui appartiennent mes données et ma boutique ?", a: "Elles vous appartiennent. Vous pouvez exporter votre catalogue et brancher un domaine personnalisé." },
    ],
  },
];

export function Faq() {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState(0);

  const active = categories[cat];

  return (
    <section id="faq" className="relative py-20 sm:py-32">
      <div className="shell">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
            Les réponses aux questions les plus fréquentes.
          </h2>
          <p className="mt-5 text-ink-2">
            Comment Sigmood IA fonctionne, ce qu&apos;il connecte et ce que vous pouvez attendre au
            quotidien.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* categories */}
          <div className="card-dark h-fit p-2.5">
            {categories.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  setCat(i);
                  setOpen(0);
                }}
                className={`block w-full cursor-pointer rounded-2xl px-5 py-4 text-left text-[0.95rem] transition-colors duration-200 ${
                  i === cat ? "bg-white/[0.06] text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* accordion */}
          <div className="flex flex-col gap-3">
            {active.items.map((item, i) => {
              const isOpen = i === open;
              return (
                <div key={item.q} className="card-dark overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[1.05rem] text-ink">{item.q}</span>
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-[0.95rem] leading-relaxed text-ink-2">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
