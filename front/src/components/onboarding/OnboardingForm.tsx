"use client";

import { useState, useTransition } from "react";
import { LogoMark } from "@/components/marketing/Logo";
import { submitOnboarding } from "@/app/onboarding/actions";

const COMPANY_SIZES = ["Solo", "2-10", "11-50", "51-200", "200+"];
const SECTORS = [
  "Mode & accessoires",
  "Beauté & cosmétiques",
  "Alimentation",
  "Maison & décoration",
  "High-tech",
  "Autre",
];
const REFERRAL_SOURCES = [
  "Recherche Google",
  "Réseaux sociaux",
  "Bouche à oreille",
  "Publicité",
  "Autre",
];

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await submitOnboarding(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <LogoMark className="size-7" />
        <span className="text-[1.05rem] font-medium tracking-tight text-ink">Stora AI</span>
      </div>

      <h1 className="mt-6 text-xl font-light tracking-tight text-ink">Parle-nous de toi</h1>
      <p className="mt-1 text-sm text-ink-3">
        Quelques questions pour personnaliser ton expérience — ça prend 30 secondes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">Nom de l'entreprise</label>
          <input
            name="company_name"
            required
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            placeholder="Atelier Nival"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">Taille de l'entreprise</label>
          <select
            name="company_size"
            required
            defaultValue=""
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} {s === "Solo" ? "" : "personnes"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">Secteur d'activité</label>
          <select
            name="sector"
            required
            defaultValue=""
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">
            Comment as-tu connu Stora AI ?
          </label>
          <select
            name="referral_source"
            required
            defaultValue=""
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {REFERRAL_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-rose">{error}</p>}

        <button type="submit" disabled={isPending} className="btn btn-light w-full !py-2.5 text-sm">
          {isPending ? "Enregistrement…" : "Accéder au dashboard"}
        </button>
      </form>
    </div>
  );
}
