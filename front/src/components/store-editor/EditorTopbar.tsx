"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ViewportMode } from "@/lib/editor/messaging";
import {
  IconBack,
  IconDesktop,
  IconEye,
  IconMobile,
  IconRedo,
  IconTablet,
  IconUndo,
} from "./editor-icons";
import { getSaveStatus, hasUnpublishedChanges, useEditor } from "./editor-store";

const SAVE_LABEL: Record<ReturnType<typeof getSaveStatus>, { label: string; tone: string }> = {
  saved: { label: "Enregistré", tone: "text-ink-3" },
  dirty: { label: "Modifications non enregistrées", tone: "text-amber-ink" },
  saving: { label: "Enregistrement…", tone: "text-ink-3" },
  error: { label: "Erreur d’enregistrement", tone: "text-danger" },
  offline: { label: "Hors ligne", tone: "text-danger" },
};

const VIEWPORTS: { mode: ViewportMode; label: string; Icon: typeof IconDesktop }[] = [
  { mode: "desktop", label: "Bureau", Icon: IconDesktop },
  { mode: "tablet", label: "Tablette", Icon: IconTablet },
  { mode: "mobile", label: "Mobile", Icon: IconMobile },
];

interface EditorTopbarProps {
  onSave: () => void;
  onPublish: () => void;
}

export function EditorTopbar({ onSave, onPublish }: EditorTopbarProps) {
  const { state, dispatch, init } = useEditor();
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    // Détection différée au montage (et non lors du rendu serveur) pour ne
    // jamais faire dépendre le HTML initial de `navigator` et provoquer une
    // désynchronisation d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/mac/i.test(navigator.platform));
  }, []);
  const mod = isMac ? "⌘" : "Ctrl";

  const saveStatus = getSaveStatus(state, init.persistence);
  const save = SAVE_LABEL[saveStatus];
  const unpublished = hasUnpublishedChanges(state);
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const publishLabel = state.publishing
    ? "Publication…"
    : state.publishedVersion == null
      ? "Publier"
      : unpublished
        ? "Publier les modifications"
        : "Publié";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/90 px-3 backdrop-blur-md sm:h-16 sm:px-4">
      {/* Gauche : retour, logo, nom */}
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/dashboard/boutiques"
          className="grid size-9 place-items-center rounded-xl text-ink-2 transition hover:bg-surface-2 hover:text-ink"
          aria-label="Retour au dashboard"
        >
          <IconBack className="size-5" />
        </Link>
        <span aria-hidden className="brand-gradient hidden size-8 shrink-0 place-items-center rounded-lg text-sm font-semibold text-ink sm:grid">
          S
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium tracking-tight text-ink">{init.store.name}</p>
          <p className={cn("truncate text-[0.7rem]", save.tone)} aria-live="polite">
            {save.label}
          </p>
        </div>
      </div>

      {/* Centre : viewport */}
      <div className="hidden items-center gap-1 rounded-full border border-line bg-surface-2 p-1 lg:flex">
        {VIEWPORTS.map(({ mode, label, Icon }) => (
          <button
            key={mode}
            type="button"
            onClick={() => dispatch({ type: "SET_VIEWPORT", viewport: mode })}
            aria-pressed={state.viewport === mode}
            className={cn(
              "grid size-8 place-items-center rounded-full transition",
              state.viewport === mode ? "bg-white text-ink shadow-[var(--elevation-1)]" : "text-ink-3 hover:text-ink",
            )}
            title={label}
          >
            <Icon className="size-4" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>

      {/* Droite : historique, aperçu, save, publish */}
      <div className="flex items-center gap-1.5">
        <div className="hidden items-center gap-0.5 sm:flex">
          <button
            type="button"
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={!canUndo}
            className="grid size-9 place-items-center rounded-xl text-ink-2 transition enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:opacity-35"
            title={`Annuler (${mod}+Z)`}
          >
            <IconUndo className="size-[18px]" />
            <span className="sr-only">Annuler</span>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "REDO" })}
            disabled={!canRedo}
            className="grid size-9 place-items-center rounded-xl text-ink-2 transition enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:opacity-35"
            title={`Rétablir (${mod}+Shift+Z)`}
          >
            <IconRedo className="size-[18px]" />
            <span className="sr-only">Rétablir</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: "SET_PREVIEW", preview: !state.previewMode })}
          aria-pressed={state.previewMode}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full border px-3 text-[0.8rem] font-medium transition",
            state.previewMode
              ? "border-accent-ink bg-accent-soft text-accent-ink"
              : "border-line-strong bg-surface text-ink-2 hover:text-ink",
          )}
          title="Prévisualiser (P)"
        >
          <IconEye className="size-4" />
          <span className="hidden sm:inline">Aperçu</span>
        </button>

        {init.persistence === "supabase" && (
          <button
            type="button"
            onClick={onSave}
            disabled={state.saving || saveStatus === "saved"}
            className="flex h-9 items-center rounded-full border border-line-strong bg-surface px-3.5 text-[0.8rem] font-medium text-ink transition enabled:hover:bg-surface-2 disabled:opacity-45"
            title={`Enregistrer (${mod}+S)`}
          >
            Enregistrer
          </button>
        )}

        <button
          type="button"
          onClick={onPublish}
          disabled={state.publishing || init.persistence !== "supabase" || (state.publishedVersion != null && !unpublished)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-4 text-[0.8rem] font-semibold transition disabled:opacity-45",
            unpublished || state.publishedVersion == null
              ? "bg-ink text-white shadow-[var(--shadow-pill)] enabled:hover:bg-[#292929]"
              : "bg-success-soft text-success",
          )}
        >
          {publishLabel}
        </button>
      </div>
    </header>
  );
}
