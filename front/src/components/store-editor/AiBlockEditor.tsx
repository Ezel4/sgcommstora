"use client";

// Onglet « Modifier avec l’IA » — assistant contextuel lié au bloc sélectionné.
//
// Le contexte envoyé est construit et validé côté serveur (voir
// /api/editor/ai-edit) : cette UI ne fait qu'afficher le badge de périmètre,
// proposer des suggestions rapides adaptées au type de bloc, et présenter la
// comparaison avant/après avant toute application.

import { useRef, useState } from "react";
import type { StoreBlock } from "@/lib/editor/document-schema";
import type { SectionDefinition } from "@/lib/editor/section-definitions";
import { requestAiEdit } from "./editor-api";
import { AiDiffPreview } from "./AiDiffPreview";
import { IconClose, IconSparkles } from "./editor-icons";
import { useEditor } from "./editor-store";

interface AiBlockEditorProps {
  pageId: string;
  sectionId: string;
  blockItem: StoreBlock;
  sectionDefinition: SectionDefinition;
  breadcrumb: string;
}

export function AiBlockEditor({ pageId, sectionId, blockItem, sectionDefinition, breadcrumb }: AiBlockEditorProps) {
  const { state, dispatch, init } = useEditor();
  const [instruction, setInstruction] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const allowedFields = Object.entries(sectionDefinition.blocks[blockItem.type]?.editableFields ?? {}).filter(
    ([fieldId]) => blockItem.content[fieldId]?.editable,
  );

  async function generate(text: string) {
    const trimmed = text.trim();
    if (trimmed.length < 3) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    dispatch({ type: "AI_START", instruction: trimmed });
    // Contenu réellement affiché à l'instant présent (peut inclure des
    // modifications manuelles pas encore enregistrées) : c'est ce texte-là
    // que l'IA doit transformer, pas une copie serveur potentiellement en retard.
    const currentContent = Object.fromEntries(
      allowedFields.map(([fieldId]) => [fieldId, blockItem.content[fieldId]?.value ?? ""]),
    );
    const result = await requestAiEdit({
      storeId: init.store.id,
      selection: { pageId, sectionId, blockId: blockItem.id },
      instruction: trimmed,
      currentContent,
      signal: controller.signal,
    });

    if (result.error === "Génération annulée.") return;
    if (!result.ok || !result.changes) {
      dispatch({ type: "AI_ERROR", instruction: trimmed, message: result.error ?? "La génération n’a pas pu être terminée." });
      return;
    }
    dispatch({
      type: "AI_PROPOSAL",
      instruction: trimmed,
      response: { blockId: result.blockId ?? blockItem.id, changes: result.changes, explanation: result.explanation ?? "", simulated: result.simulated ?? true },
      changes: result.changes,
      rejected: result.rejected ?? [],
    });
  }

  function cancelGeneration() {
    controllerRef.current?.abort();
    dispatch({ type: "AI_RESET" });
  }

  function applyFields(fields: string[]) {
    if (state.ai.status !== "proposal") return;
    const changes = state.ai.changes.filter((change) => fields.includes(change.field));
    dispatch({ type: "APPLY_AI_CHANGES", ref: { pageId, sectionId, blockId: blockItem.id }, changes });
  }

  const ai = state.ai;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-3">Bloc sélectionné</p>
        <p className="mt-1 text-[0.8125rem] font-medium text-ink">{breadcrumb}</p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[0.7rem] font-medium text-accent-ink">
          <IconSparkles className="size-3" />
          L’IA modifiera uniquement ce bloc
        </div>
        {allowedFields.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {allowedFields.map(([fieldId, fieldDef]) => (
              <span key={fieldId} className="rounded-full border border-line bg-surface px-2 py-0.5 text-[0.7rem] text-ink-2">
                {fieldDef.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {ai.status === "proposal" ? (
        <div className="mt-4">
          <AiDiffPreview
            changes={ai.changes}
            rejected={ai.rejected}
            explanation={ai.response.explanation}
            simulated={ai.response.simulated}
            onApply={applyFields}
            onRegenerate={() => void generate(ai.instruction)}
            onDiscard={() => dispatch({ type: "AI_RESET" })}
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 px-4 pb-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.8125rem] font-medium tracking-tight text-ink-2">Votre demande</span>
            <textarea
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="Rends ce texte plus premium et plus convaincant."
              rows={3}
              disabled={ai.status === "generating"}
              className="min-h-20 w-full rounded-xl border border-line-strong bg-elevated px-4 py-2.5 text-sm text-ink shadow-[var(--elevation-1)] placeholder:text-ink-4 focus-visible:border-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:opacity-60"
            />
          </label>

          <div className="flex flex-wrap gap-1.5">
            {sectionDefinition.aiSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={ai.status === "generating"}
                onClick={() => setInstruction(suggestion)}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.7rem] text-ink-2 transition hover:border-accent-ink hover:text-accent-ink disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {ai.status === "generating" && (
            <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-3 text-[0.8rem] text-ink-2">
              <span className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-accent" />
                Préparation d’une nouvelle version…
              </span>
              <button type="button" onClick={cancelGeneration} className="text-ink-3 transition hover:text-ink" aria-label="Annuler">
                <IconClose className="size-4" />
              </button>
            </div>
          )}

          {ai.status === "error" && (
            <p className="rounded-xl bg-danger-soft px-3.5 py-3 text-[0.8rem] text-danger">{ai.message}</p>
          )}

          <button
            type="button"
            onClick={() => void generate(instruction)}
            disabled={ai.status === "generating" || instruction.trim().length < 3}
            className="btn btn-light h-10 gap-2 self-start px-4 text-[0.8125rem] disabled:opacity-45"
          >
            <IconSparkles className="size-4" />
            {ai.status === "error" ? "Réessayer" : "Générer une proposition"}
          </button>
        </div>
      )}
    </div>
  );
}
