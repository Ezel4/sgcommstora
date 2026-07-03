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
    features: [
      "Génération d'une boutique",
      "50 clients maximum",
      "10 visuels IA / mois",
      "Accès CRM restreint",
    ],
  },
  {
    name: "Pro",
    monthly: 39.99,
    yearly: 39.99,
    tagline: "Pour les marques qui veulent vendre vite.",
    features: [
      "5 boutiques",
      "Clients illimités",
      "200 visuels IA / mois",
      "Accès CRM avancé",
      "Hébergement + nom de domaine",
    ],
    featured: true,
  },
  {
    name: "Advanced",
    monthly: 199.99,
    yearly: 199.99,
    tagline: "Pour les marques qui veulent tout, sans limite.",
    features: [
      "Boutiques illimitées",
      "Clients illimités",
      "Visuels IA illimités",
      "Accès CRM complet + export",
      "Hébergement prioritaire + domaine personnalisé",
      "Support dédié sous 24h",
    ],
  },
];

const enterprisePlan: Plan = {
  name: "Entreprise",
  monthly: 0,
  yearly: 0,
  tagline: "Pour les équipes qui veulent du sur-mesure, sans limite.",
  features: [
    "Tout le plan Advanced, en illimité",
    "Boutiques et visuels IA illimités",
    "Personnalisation des agents IA",
    "Account manager dédié",
    "SLA et onboarding sur-mesure",
  ],
};

const SIGNUP_HREF = "/login?mode=signup";

type Mode = "monthly" | "yearly" | "enterprise";

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(84,184,168,0.5)" strokeWidth="1.2" />
      <path d="M6 10.2 8.6 13 14 7.5" stroke="#54b8a8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatPrice(price: number) {
  return price.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function PlanCard({ plan, price, cta }: { plan: Plan; price: number | null; cta: string }) {
  return (
    <article
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
          {price === null ? "Sur devis" : price === 0 ? "Gratuit" : `${formatPrice(price)}€`}
        </span>
        {price !== null && price !== 0 && <span className="pb-1.5 text-sm text-ink-3">/ mois</span>}
      </div>
      <p className="mt-3 text-sm text-ink-2">{plan.tagline}</p>

      <a href={SIGNUP_HREF} className={`mt-6 ${plan.featured ? "btn btn-light" : "btn btn-ghost"}`}>
        {cta}
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
}

export function Pricing() {
  const [mode, setMode] = useState<Mode>("yearly");

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
              onClick={() => setMode("monthly")}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${mode === "monthly" ? "bg-white/10 text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setMode("yearly")}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${mode === "yearly" ? "bg-white/10 text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              Annuel
            </button>
            <button
              onClick={() => setMode("enterprise")}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${mode === "enterprise" ? "bg-white/10 text-ink" : "text-ink-3 hover:text-ink-2"}`}
            >
              Entreprise
            </button>
          </div>
        </div>

        {mode === "enterprise" ? (
          <div className="mx-auto mt-14 max-w-md">
            <PlanCard plan={enterprisePlan} price={null} cta="Nous contacter" />
          </div>
        ) : (
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = mode === "yearly" ? plan.yearly : plan.monthly;
              return (
                <PlanCard key={plan.name} plan={plan} price={price} cta={price === 0 ? "Commencer" : "S'abonner"} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
