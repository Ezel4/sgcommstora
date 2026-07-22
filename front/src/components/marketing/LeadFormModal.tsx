"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { submitLeadForm } from "@/app/pubs/actions";

// Formulaire de contact ouvert par le CTA de la pub 1 : pousse directement un
// lead "à contacter" dans le CRM, tagué avec la source de la pub qui l'a ouvert.
export function LeadFormModal({ source, onClose }: { source: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  // Horodatage d'ouverture : sert au contrôle anti-bot côté serveur.
  const openedAtRef = useRef<number>(0);

  useEffect(() => {
    openedAtRef.current = Date.now();
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstFieldRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [isPending, onClose]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("form_ts", String(openedAtRef.current));
    startTransition(async () => {
      try {
        const result = await submitLeadForm(formData, source);
        if (result.ok) setDone(true);
        else setError(result.error);
      } catch {
        setError("Une erreur inattendue est survenue, réessaie.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-6">
        {done ? (
          <div className="py-6 text-center">
            <p id={titleId} className="text-lg font-medium text-ink">Merci !</p>
            <p className="mt-2 text-sm text-ink-2">
              Ta demande est bien enregistrée, on te recontacte rapidement.
            </p>
            <button type="button" onClick={onClose} className="btn btn-light mt-6 w-full !py-2.5 text-sm">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 id={titleId} className="text-lg font-medium text-ink">Être rappelé·e</h3>
              <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-10 place-items-center rounded-full text-ink-3 hover:bg-white/55 hover:text-ink">
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-3">
              Laisse tes coordonnées, on te recontacte pour te présenter Sigmood IA.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {/* Honeypot anti-bot : invisible et non focusable pour un humain. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="lead-company-website">Ne pas remplir</label>
                <input
                  id="lead-company-website"
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-xs font-medium text-ink-3">Nom</label>
                <input
                  ref={firstFieldRef}
                  id="lead-name"
                  name="name"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="lead-email" className="mb-1.5 block text-xs font-medium text-ink-3">Email</label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-medium text-ink-3">Téléphone</label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>

              {error && <p role="alert" className="text-sm text-danger">{error}</p>}

              <button type="submit" disabled={isPending} aria-busy={isPending} className="btn btn-light w-full !py-2.5 text-sm">
                {isPending ? "Envoi…" : "Envoyer"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
