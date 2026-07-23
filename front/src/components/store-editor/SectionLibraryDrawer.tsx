"use client";

// Drawer « Ajouter une section ».
//
// Liste les sections proposées par la bibliothèque (section-library) avec un
// aperçu schématique. Cliquer une carte insère la section dans la page courante
// (avant le footer) via le store de l'éditeur, puis referme le drawer.
//
// Le périmètre est fermé : seules les sections déclarées `ADDABLE_SECTIONS`
// peuvent être ajoutées, chacune avec un contenu par défaut sans donnée inventée.

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ADDABLE_SECTIONS } from "@/lib/editor/section-library";
import { IconClose } from "./editor-icons";

// --- Aperçus schématiques (formes abstraites, aucun texte réel) --------------

function Bar({ className }: { className?: string }) {
  return <div className={cn("rounded-full bg-current opacity-25", className)} />;
}

function SectionPreview({ type }: { type: string }) {
  const frame = "flex h-20 flex-col justify-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-ink-3";
  switch (type) {
    case "benefits":
      return (
        <div className={frame}>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-md bg-current/10 p-1.5">
                <Bar className="h-1.5 w-3/4" />
                <Bar className="h-1 w-full" />
              </div>
            ))}
          </div>
        </div>
      );
    case "featured-products":
      return (
        <div className={frame}>
          <Bar className="h-1.5 w-1/3" />
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-current/15" />
            ))}
          </div>
        </div>
      );
    case "faq":
      return (
        <div className={cn(frame, "gap-2")}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-current/10 px-2 py-1">
              <Bar className="h-1.5 w-1/2" />
              <Bar className="h-1.5 w-1.5" />
            </div>
          ))}
        </div>
      );
    case "testimonials":
      return (
        <div className={frame}>
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-md bg-current/10 p-2">
                <Bar className="h-1 w-full" />
                <Bar className="h-1 w-2/3" />
                <Bar className="mt-1 h-1 w-1/3 opacity-40" />
              </div>
            ))}
          </div>
        </div>
      );
    case "newsletter":
      return (
        <div className={cn(frame, "items-center")}>
          <Bar className="h-1.5 w-1/2" />
          <Bar className="h-1 w-2/3 opacity-40" />
          <div className="mt-1 flex w-3/4 gap-1">
            <div className="h-3 flex-1 rounded-full bg-current/10" />
            <div className="h-3 w-10 rounded-full bg-current/40" />
          </div>
        </div>
      );
    case "content-section":
      return (
        <div className={cn(frame, "gap-2")}>
          <Bar className="h-1.5 w-1/3" />
          <Bar className="h-1 w-full" />
          <Bar className="h-1 w-full" />
          <Bar className="h-1 w-2/3" />
        </div>
      );
    default:
      return <div className={frame} />;
  }
}

export function SectionLibraryDrawer({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (type: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ajouter une section"
        data-testid="section-library-drawer"
        className="relative ml-0 flex h-full w-[380px] max-w-[90vw] flex-col border-r border-line bg-surface shadow-[var(--elevation-3)]"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-ink">Ajouter une section</p>
            <p className="text-[0.75rem] text-ink-3">Insérée avant le pied de page, prête à personnaliser.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-3 transition hover:bg-surface-2 hover:text-ink"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {ADDABLE_SECTIONS.map((section) => (
            <button
              key={section.type}
              type="button"
              data-testid={`section-card-${section.type}`}
              onClick={() => onAdd(section.type)}
              className="group block w-full rounded-2xl border border-line bg-surface p-2.5 text-left transition hover:border-line-strong hover:bg-surface-2/60"
            >
              <SectionPreview type={section.type} />
              <div className="mt-2 px-1 pb-0.5">
                <p className="text-[0.8125rem] font-medium text-ink">{section.label}</p>
                <p className="mt-0.5 text-[0.75rem] leading-snug text-ink-3">{section.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
