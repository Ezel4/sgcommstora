"use client";

// Boîte de dialogue de publication (§17). Affiche un résumé des changements de
// la session (pages, blocs, textes modifiés) avant de confirmer — la
// publication n'est jamais déclenchée par la sauvegarde automatique.

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui";
import type { HistoryEntry } from "./editor-store";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface PublishSummary {
  pages: number;
  blocks: number;
  textChanges: number;
}

export function summarizePublishChanges(past: HistoryEntry[]): PublishSummary {
  const pages = new Set<string>();
  const blocks = new Set<string>();
  let textChanges = 0;
  for (const entry of past) {
    for (const op of entry.operations) {
      if (op.kind === "field") {
        pages.add(op.pageId);
        blocks.add(`${op.sectionId}/${op.blockId}`);
        textChanges += 1;
      }
    }
  }
  return { pages: pages.size, blocks: blocks.size, textChanges };
}

interface PublishDialogProps {
  summary: PublishSummary;
  lastPublishedAt: string | null;
  ownerEmail: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PublishDialog({ summary, lastPublishedAt, ownerEmail, pending, error, onCancel, onConfirm }: PublishDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
    // onCancel intentionnellement omis : capturé une fois à l'ouverture du dialogue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastPublishedLabel = lastPublishedAt
    ? new Date(lastPublishedAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
    : "Jamais publiée";

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md rounded-[23px] border border-line bg-elevated p-5 shadow-[var(--elevation-4)] outline-none sm:p-6"
      >
        <h2 id={titleId} className="text-xl font-medium text-ink">
          Publier les modifications
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Votre boutique publique reflétera ces changements immédiatement après la publication.
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-surface-2 p-3 text-center">
          <div>
            <dt className="text-[0.7rem] text-ink-3">Pages</dt>
            <dd className="text-lg font-medium text-ink">{summary.pages}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] text-ink-3">Blocs</dt>
            <dd className="text-lg font-medium text-ink">{summary.blocks}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] text-ink-3">Textes</dt>
            <dd className="text-lg font-medium text-ink">{summary.textChanges}</dd>
          </div>
        </dl>

        <p className="mt-4 text-[0.8rem] text-ink-3">Dernière publication : {lastPublishedLabel}</p>
        <p className="text-[0.8rem] text-ink-3">Publié par : {ownerEmail}</p>

        {error && <p className="mt-3 rounded-xl bg-danger-soft px-3 py-2 text-[0.8rem] text-danger">{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="ghost" disabled={pending} onClick={onCancel}>
            Annuler
          </Button>
          <Button type="button" variant="primary" isLoading={pending} onClick={onConfirm}>
            {pending ? "Publication…" : "Publier"}
          </Button>
        </div>
      </div>
    </div>
  );
}
