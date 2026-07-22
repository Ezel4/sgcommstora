"use client";

// Comparaison avant/après d'une proposition IA. L'utilisateur choisit les
// champs à appliquer (au moins un) avant de valider — rien n'est appliqué
// automatiquement à la fermeture de la génération.

import { useState } from "react";
import type { ValidatedChange } from "@/lib/editor/validate-ai-changes";
import { IconCheck } from "./editor-icons";

interface AiDiffPreviewProps {
  changes: ValidatedChange[];
  rejected: string[];
  explanation: string;
  simulated: boolean;
  onApply: (fields: string[]) => void;
  onRegenerate: () => void;
  onDiscard: () => void;
}

export function AiDiffPreview({ changes, rejected, explanation, simulated, onApply, onRegenerate, onDiscard }: AiDiffPreviewProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(changes.map((change) => change.field)));

  function toggle(field: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  }

  if (changes.length === 0) {
    return (
      <div className="mx-4 rounded-2xl border border-line bg-surface-2 px-4 py-5 text-sm text-ink-2">
        <p>L’IA n’a proposé aucun changement exploitable pour cette demande.</p>
        <button type="button" onClick={onRegenerate} className="btn btn-ghost mt-3 h-9 px-4 text-[0.8rem]">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {simulated && (
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-[0.7rem] leading-relaxed text-accent-ink">
          Aperçu simulé — aucune API de génération n’est encore branchée. La validation de périmètre ci-dessous est bien réelle.
        </p>
      )}
      <p className="text-[0.8rem] leading-relaxed text-ink-2">{explanation}</p>

      <ul className="flex flex-col gap-3">
        {changes.map((change) => {
          const isSelected = selected.has(change.field);
          return (
            <li key={change.field} className="rounded-2xl border border-line bg-surface p-3.5 shadow-[var(--elevation-1)]">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(change.field)}
                  className="mt-0.5 size-4 shrink-0 rounded border-line-strong accent-[var(--color-accent)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-3">{change.fieldLabel}</span>
                  <span className="mt-1.5 block rounded-lg bg-danger-soft px-2.5 py-1.5 text-[0.8rem] text-ink-2 line-through decoration-danger/50">
                    {change.previousValue || <em className="not-italic opacity-60">Vide</em>}
                  </span>
                  <span className="mt-1.5 block rounded-lg bg-success-soft px-2.5 py-1.5 text-[0.8rem] font-medium text-ink">
                    {change.newValue}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {rejected.length > 0 && (
        <p className="text-[0.7rem] leading-relaxed text-ink-3">
          {rejected.length} élément{rejected.length > 1 ? "s" : ""} hors périmètre ignoré{rejected.length > 1 ? "s" : ""}.
        </p>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onApply([...selected])}
          disabled={selected.size === 0}
          className="btn btn-light h-9 gap-1.5 px-4 text-[0.8rem] disabled:opacity-45"
        >
          <IconCheck className="size-3.5" />
          Appliquer{selected.size < changes.length ? ` (${selected.size})` : ""}
        </button>
        <button type="button" onClick={onRegenerate} className="btn btn-ghost h-9 px-3.5 text-[0.8rem]">
          Régénérer
        </button>
        <button type="button" onClick={onDiscard} className="btn btn-ghost h-9 px-3.5 text-[0.8rem] text-ink-3">
          Conserver l’original
        </button>
      </div>
    </div>
  );
}
