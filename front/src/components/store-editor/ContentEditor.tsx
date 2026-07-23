"use client";

// Onglet « Contenu » — édition manuelle des champs textuels autorisés du bloc
// sélectionné. Chaque champ affiche label, compteur de caractères, limite,
// bouton de réinitialisation ; la valeur part directement dans l'historique
// (regroupée par coalescing, voir editor-store).

import { useState } from "react";
import { Input, Textarea } from "@/components/ui";
import type { BlockDefinition } from "@/lib/editor/section-definitions";
import type { StoreBlock } from "@/lib/editor/document-schema";
import { getFieldValue } from "@/lib/editor/document-schema";
import { IconRefresh } from "./editor-icons";
import { useEditor } from "./editor-store";

interface ContentEditorProps {
  pageId: string;
  sectionId: string;
  blockItem: StoreBlock;
  definition: BlockDefinition;
  originalValues: Record<string, string>;
}

export function ContentEditor({ pageId, sectionId, blockItem, definition, originalValues }: ContentEditorProps) {
  const { dispatch } = useEditor();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editableFields = Object.entries(definition.editableFields).filter(
    ([fieldId]) => blockItem.content[fieldId]?.editable,
  );

  if (editableFields.length === 0) {
    return <p className="px-4 py-6 text-sm text-ink-3">Ce bloc n’a pas de texte modifiable.</p>;
  }

  function update(fieldId: string, value: string, maxLength: number) {
    const overLimit = value.length > maxLength;
    setErrors((prev) => ({ ...prev, [fieldId]: overLimit ? `${value.length}/${maxLength} caractères — trop long` : "" }));
    dispatch({ type: "UPDATE_FIELD", ref: { pageId, sectionId, blockId: blockItem.id }, field: fieldId, value });
  }

  function reset(fieldId: string, maxLength: number) {
    const original = originalValues[fieldId] ?? "";
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    dispatch({ type: "UPDATE_FIELD", ref: { pageId, sectionId, blockId: blockItem.id }, field: fieldId, value: original });
    void maxLength;
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      {editableFields.map(([fieldId, fieldDef]) => {
        const value = getFieldValue(blockItem, fieldId);
        const changedFromOriginal = originalValues[fieldId] !== undefined && originalValues[fieldId] !== value;
        const count = `${value.length}/${fieldDef.maxLength}`;
        const commonProps = {
          id: `field-${blockItem.id}-${fieldId}`,
          value,
          error: errors[fieldId] || undefined,
          hint: !errors[fieldId] ? fieldDef.help : undefined,
          maxLength: fieldDef.maxLength + 40, // laisse taper au-delà pour afficher l'erreur, sans excès
        };
        return (
          <div key={fieldId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] font-medium tracking-tight text-ink-2">{fieldDef.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[0.7rem] tabular-nums ${value.length > fieldDef.maxLength ? "text-danger" : "text-ink-3"}`}>
                  {count}
                </span>
                {changedFromOriginal && (
                  <button
                    type="button"
                    onClick={() => reset(fieldId, fieldDef.maxLength)}
                    className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.7rem] text-ink-3 transition hover:bg-surface-2 hover:text-ink"
                    title="Réinitialiser à la version enregistrée"
                  >
                    <IconRefresh className="size-3" /> Réinitialiser
                  </button>
                )}
              </div>
            </div>
            {fieldDef.fieldType === "textarea" ? (
              <Textarea {...commonProps} rows={4} onChange={(event) => update(fieldId, event.target.value, fieldDef.maxLength)} />
            ) : fieldDef.fieldType === "image" ? (
              <div className="flex flex-col gap-2">
                <Input {...commonProps} placeholder="https://…" onChange={(event) => update(fieldId, event.target.value, fieldDef.maxLength)} />
                {value ? (
                  // Aperçu de l'image saisie (URL libre) → balise <img> simple.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={value} alt="" className="h-24 w-full rounded-lg border border-line object-cover" />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-line text-[0.75rem] text-ink-3">
                    Aperçu de l’image
                  </div>
                )}
              </div>
            ) : (
              <Input {...commonProps} onChange={(event) => update(fieldId, event.target.value, fieldDef.maxLength)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
