"use client";

// Panneau contextuel droit — dépend uniquement de la sélection active.
//   • aucune sélection → explication + suggestions ;
//   • contenu dynamique → renvoi vers le module concerné ;
//   • section (sans bloc) → résumé + liste de ses blocs ;
//   • bloc → onglets Contenu / Modifier avec l’IA.

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { findBlock, findPage, findSection, getFieldValue } from "@/lib/editor/document-schema";
import { getBlockDefinition, getSectionDefinition, isRepeatableBlock } from "@/lib/editor/section-definitions";
import { createBlock } from "@/lib/editor/section-library";
import { AiBlockEditor } from "./AiBlockEditor";
import { ContentEditor } from "./ContentEditor";
import { IconLayers, IconLock, IconPlus, IconSparkles, IconText, IconTrash } from "./editor-icons";
import { useEditor } from "./editor-store";

type InspectorTab = "content" | "ai";

function EmptyInspector() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="grid size-11 place-items-center rounded-2xl bg-surface-2 text-ink-3">
        <IconLayers className="size-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">Sélectionnez un bloc dans la boutique</p>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-3">
          Survolez la boutique au centre pour repérer les blocs modifiables, puis cliquez pour ouvrir ses réglages ici.
        </p>
      </div>
      <ul className="mt-1 flex flex-col gap-1.5 text-[0.8125rem] text-ink-2">
        <li>• Le Hero pour changer le message principal</li>
        <li>• La FAQ pour ajuster une réponse</li>
        <li>• Le footer pour la présentation de marque</li>
      </ul>
      <p className="text-[0.75rem] text-ink-3">Vous pouvez aussi partir de l’arborescence, à gauche.</p>
    </div>
  );
}

function DynamicInspector({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3 px-4 py-6">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[rgba(36,152,200,0.14)] px-2.5 py-1 text-[0.7rem] font-medium text-amber-ink">
        Contenu dynamique
      </div>
      <p className="text-sm text-ink-2">{label}</p>
      <p className="text-[0.8125rem] leading-relaxed text-ink-3">
        Cette information provient d’un autre module de la boutique et ne peut pas être transformée en texte statique ici.
      </p>
      <Link href="/dashboard/produits" className="btn btn-ghost mt-1 h-9 w-fit px-4 text-[0.8rem]">
        Modifier dans Produits
      </Link>
    </div>
  );
}

export function InspectorPanel() {
  const { state, dispatch } = useEditor();
  const [tab, setTab] = useState<InspectorTab>("content");
  const selection = state.selection;

  if (!selection) return <EmptyInspector />;
  if (selection.kind === "dynamic") return <DynamicInspector label={selection.label} />;

  if (selection.kind === "section") {
    const page = findPage(state.document, selection.pageId);
    const section = findSection(state.document, selection.pageId, selection.sectionId);
    const definition = section ? getSectionDefinition(section.type) : null;
    if (!page || !section || !definition) return <EmptyInspector />;
    // Types d'items dupliquables présents dans la section (pour les boutons « Ajouter »).
    const repeatableTypes = Array.from(
      new Set(section.blocks.filter((blockItem) => isRepeatableBlock(section.type, blockItem.type)).map((blockItem) => blockItem.type)),
    );

    const addItem = (blockType: string) => {
      const block = createBlock(section.type, blockType);
      if (!block) return;
      // Insérer juste après le dernier item du même type.
      let index = section.blocks.length;
      for (let i = section.blocks.length - 1; i >= 0; i--) {
        if (section.blocks[i].type === blockType) {
          index = i + 1;
          break;
        }
      }
      dispatch({ type: "ADD_BLOCK", pageId: page.id, sectionId: section.id, block, index });
    };

    return (
      <div className="flex flex-1 flex-col gap-3 px-4 py-6">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-3">{page.title}</p>
        <p className="text-base font-medium text-ink">{definition.label}</p>
        <p className="text-[0.8125rem] leading-relaxed text-ink-3">{definition.description}</p>
        <ul className="mt-1 flex flex-col gap-1">
          {section.blocks.map((blockItem) => {
            const blockDefinition = definition.blocks[blockItem.type];
            const repeatable = isRepeatableBlock(section.type, blockItem.type);
            // Un item dupliquable ne peut être supprimé que s'il en reste au moins un.
            const sameTypeCount = section.blocks.filter((item) => item.type === blockItem.type).length;
            return (
              <li key={blockItem.id} data-testid="inspector-block-item" className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!blockDefinition}
                  onClick={() =>
                    dispatch({ type: "SELECT", selection: { kind: "block", ref: { pageId: page.id, sectionId: section.id, blockId: blockItem.id } } })
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[0.8125rem] text-ink-2 transition enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:opacity-50"
                >
                  {blockDefinition ? <IconText className="size-3.5 shrink-0" /> : <IconLock className="size-3.5 shrink-0" />}
                  <span className="truncate">{blockDefinition?.label ?? blockItem.type}</span>
                </button>
                {repeatable && sameTypeCount > 1 && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_BLOCK", pageId: page.id, sectionId: section.id, blockId: blockItem.id })}
                    className="grid size-7 shrink-0 place-items-center rounded-lg text-ink-3 transition hover:bg-danger-soft hover:text-danger"
                    aria-label={`Supprimer : ${blockDefinition?.label ?? blockItem.type}`}
                    title="Supprimer cet élément"
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {repeatableTypes.length > 0 && (
          <div className="mt-1 flex flex-col gap-1.5">
            {repeatableTypes.map((blockType) => (
              <button
                key={blockType}
                type="button"
                data-testid="inspector-add-item"
                onClick={() => addItem(blockType)}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2 text-[0.8rem] font-medium text-ink-2 transition hover:border-ink/30 hover:bg-surface-2 hover:text-ink"
              >
                <IconPlus className="size-3.5" />
                Ajouter : {definition.blocks[blockType]?.label ?? blockType}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // selection.kind === "block"
  const { ref } = selection;
  const page = findPage(state.document, ref.pageId);
  const section = findSection(state.document, ref.pageId, ref.sectionId);
  const blockItem = findBlock(state.document, ref);
  const sectionDefinition = section ? getSectionDefinition(section.type) : null;
  const blockDefinition = section && blockItem ? getBlockDefinition(section.type, blockItem.type) : null;

  if (!page || !section || !blockItem || !sectionDefinition || !blockDefinition) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm font-medium text-ink">La sélection n’est plus disponible</p>
        <p className="text-[0.8125rem] text-ink-3">La boutique a peut-être été modifiée dans un autre onglet.</p>
      </div>
    );
  }

  const breadcrumb = `${page.title} > ${sectionDefinition.label} > ${blockDefinition.label}`;
  const savedSection = findSection(state.savedDocument, ref.pageId, ref.sectionId);
  const savedBlock = savedSection?.blocks.find((item) => item.id === blockItem.id);
  const originalValues = Object.fromEntries(
    Object.keys(blockDefinition.editableFields).map((fieldId) => [fieldId, savedBlock ? getFieldValue(savedBlock, fieldId) : ""]),
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-line px-4 pb-3 pt-4">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-3">{breadcrumb}</p>
        <p className="mt-1 text-base font-medium text-ink">{blockDefinition.label}</p>
      </div>
      <div className="flex gap-1 border-b border-line p-2">
        {([
          { id: "content" as const, label: "Contenu", Icon: IconText },
          { id: "ai" as const, label: "Modifier avec l’IA", Icon: IconSparkles },
        ]).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[0.8rem] font-medium transition",
              tab === id ? "bg-surface-2 text-ink" : "text-ink-3 hover:text-ink",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {tab === "content" ? (
          <ContentEditor pageId={page.id} sectionId={section.id} blockItem={blockItem} definition={blockDefinition} originalValues={originalValues} />
        ) : (
          <AiBlockEditor pageId={page.id} sectionId={section.id} blockItem={blockItem} sectionDefinition={sectionDefinition} breadcrumb={breadcrumb} />
        )}
      </div>
    </div>
  );
}
