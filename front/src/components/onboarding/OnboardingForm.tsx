"use client";

import { useState, useTransition } from "react";
import { LogoMark } from "@/components/marketing/Logo";
import { submitOnboarding } from "@/app/onboarding/actions";
import { COMPANY_SIZES, REFERRAL_SOURCES, SECTORS } from "@/lib/onboarding-options";

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        const result = await submitOnboarding(formData);
        if (!result.ok) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-elevated p-6 shadow-[var(--elevation-2)] sm:p-8">
      <div className="flex items-center gap-2.5">
        <LogoMark className="size-7" />
        <span className="text-[1.05rem] font-medium tracking-tight text-ink">Sigmood IA</span>
      </div>

      <h1 className="mt-7 text-2xl font-normal tracking-tight text-ink">Parle-nous de toi</h1>
      <p className="mt-1 text-sm text-ink-3">
        Quelques questions pour personnaliser ton expérience — ça prend 30 secondes.
      </p>

      <form onSubmit={handleSubmit} aria-describedby={error ? "onboarding-error" : undefined} className="mt-7 space-y-4">
        <div>
          <label htmlFor="company-name" className="mb-1.5 block text-xs font-medium text-ink-3">Nom de l&apos;entreprise</label>
          <input
            id="company-name"
            name="company_name"
            autoComplete="organization"
            required
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            placeholder="Atelier Nival"
          />
        </div>

        <div>
          <label htmlFor="company-size" className="mb-1.5 block text-xs font-medium text-ink-3">Taille de l&apos;entreprise</label>
          <select
            id="company-size"
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
          <label htmlFor="company-sector" className="mb-1.5 block text-xs font-medium text-ink-3">Secteur d&apos;activité</label>
          <select
            id="company-sector"
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
          <label htmlFor="referral-source" className="mb-1.5 block text-xs font-medium text-ink-3">
            Comment as-tu connu Sigmood IA ?
          </label>
          <select
            id="referral-source"
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

        {error && <p id="onboarding-error" role="alert" className="text-sm text-danger">{error}</p>}

        <button type="submit" disabled={isPending} aria-busy={isPending} className="btn btn-light w-full !py-2.5 text-sm">
          {isPending ? "Enregistrement…" : "Accéder au dashboard"}
        </button>
      </form>
    </div>
  );
}
