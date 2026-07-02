"use client";

import { useState, useTransition } from "react";
import { submitLeadForm } from "@/app/pubs/actions";

// Formulaire de contact ouvert par le CTA de la pub 1 : pousse directement un
// lead "à contacter" dans le CRM, tagué avec la source de la pub qui l'a ouvert.
export function LeadFormModal({ source, onClose }: { source: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await submitLeadForm(formData, source);
        setDone(true);
      } catch {
        setError("Une erreur est survenue, réessaie.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        {done ? (
          <div className="py-6 text-center">
            <p className="text-lg font-medium text-ink">Merci !</p>
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
              <h3 className="text-lg font-medium text-ink">Être rappelé·e</h3>
              <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-3 hover:text-ink">
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-3">
              Laisse tes coordonnées, on te recontacte pour te présenter Stora.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-3">Nom</label>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-3">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-3">Téléphone</label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-rose">{error}</p>}

              <button type="submit" disabled={isPending} className="btn btn-light w-full !py-2.5 text-sm">
                {isPending ? "Envoi…" : "Envoyer"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
