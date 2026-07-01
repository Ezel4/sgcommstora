"use client";

import { useState } from "react";

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Découverte",
    monthly: 0,
    yearly: 0,
    tagline: "Pour tester et lancer une première boutique.",
    features: ["1 boutique", "50 produits générés / mois", "Visuels IA limités", "Support communauté"],
  },
  {
    name: "Pro",
    monthly: 24,
    yearly: 19,
    tagline: "Pour les marques qui veulent vendre vite.",
    features: ["5 boutiques", "Produits illimités", "500 visuels IA / mois", "SEO automatique", "Support prioritaire"],
    featured: true,
  },
  {
    name: "Business",
    monthly: 59,
    yearly: 49,
    tagline: "Pour scaler sur plusieurs boutiques.",
    features: ["Boutiques illimitées", "Visuels IA illimités", "Multi-utilisateurs", "Domaines personnalisés", "Accès API"],
  },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(84,184,168,0.5)" strokeWidth="1.2" />
      <path d="M6 10.2 8.6 13 14 7.5" stroke="#54b8a8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="tarifs" className="relative py-20 sm:py-32">
      <div className="shell">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
              Des plans clairs qui grandissent avec vous.
            </h2>
          </div>

          {/* toggle */}
          <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
            <button
              onClick={() => setYearly(false)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${!yearly ? "bg-white/10 text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${yearly ? "bg-white/10 text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              Annuel
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.65rem] font-medium text-accent">-20%</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <article
                key={plan.name}
                className={`card-dark flex flex-col p-7 ${plan.featured ? "ring-1 ring-[rgba(205,144,137,0.45)] shadow-[0_44px_100px_-34px_rgba(205,144,137,0.45)] lg:-translate-y-3" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-3">{plan.name}</span>
                  {plan.featured && (
                    <span className="rounded-full border border-line-strong bg-white/[0.06] px-2.5 py-0.5 text-[0.65rem] text-ink">
                      Populaire
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-5xl font-light tracking-tight text-ink">
                    {price === 0 ? "Gratuit" : `${price}€`}
                  </span>
                  {price !== 0 && <span className="pb-1.5 text-sm text-ink-3">/ mois</span>}
                </div>
                <p className="mt-3 text-sm text-ink-2">{plan.tagline}</p>

                <a
                  href="#cta"
                  className={`mt-6 ${plan.featured ? "btn btn-light" : "btn btn-ghost"}`}
                >
                  Commencer
                </a>

                <div className="hairline my-7" />

                <ul className="flex flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-ink-2">
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
