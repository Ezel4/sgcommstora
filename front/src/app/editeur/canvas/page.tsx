"use client";

// -----------------------------------------------------------------------------
// Contenu de l'iframe du canvas.
//
// Cette page ne charge aucune donnée elle-même : elle reçoit le document, la
// boutique et les produits de l'éditeur parent via postMessage (même origine,
// canal signé — voir lib/editor/messaging). Elle rend la boutique avec le
// renderer partagé et remonte les interactions (survol CSS, clics de
// sélection). En mode édition, aucune navigation réelle n'est possible.
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import type { StorefrontProduct, StorefrontStore } from "@/components/storefront/storefront-data";
import type { ElementReference, StoreDocument, StorePage } from "@/lib/editor/document-schema";
import { findPage } from "@/lib/editor/document-schema";
import type { EditorSelection, EditorToCanvasEvent } from "@/lib/editor/messaging";
import { postToEditor, readEnvelope } from "@/lib/editor/messaging";

interface CanvasData {
  document: StoreDocument;
  pageId: string;
  store: StorefrontStore;
  products: StorefrontProduct[];
}

interface ToolbarPosition {
  top: number;
  left: number;
}

function referenceFromElement(element: Element): ElementReference | null {
  const host = element.closest("[data-sigmood-block-id]");
  if (!host) return null;
  const pageId = host.getAttribute("data-sigmood-page-id");
  const sectionId = host.getAttribute("data-sigmood-section-id");
  const blockId = host.getAttribute("data-sigmood-block-id");
  if (!pageId || !sectionId || !blockId) return null;
  const fieldId = element.closest("[data-sigmood-field]")?.getAttribute("data-sigmood-field") ?? undefined;
  return { pageId, sectionId, blockId, fieldId };
}

export default function EditorCanvasPage() {
  const [data, setData] = useState<CanvasData | null>(null);
  const [selection, setSelection] = useState<EditorSelection>(null);
  const [editing, setEditing] = useState(true);
  const [toolbar, setToolbar] = useState<ToolbarPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // --- Réception des événements de l'éditeur --------------------------------
  useEffect(() => {
    let acknowledged = false;

    function onMessage(message: MessageEvent) {
      const event = readEnvelope<EditorToCanvasEvent>(message);
      if (!event) return;
      switch (event.type) {
        case "LOAD_DOCUMENT":
          acknowledged = true;
          clearInterval(retry);
          setData(event.payload);
          break;
        case "SET_SELECTION":
          setSelection(event.payload);
          break;
        case "UPDATE_BLOCK": {
          const { pageId, sectionId, block } = event.payload;
          setData((current) =>
            current
              ? {
                  ...current,
                  document: {
                    ...current.document,
                    pages: current.document.pages.map((page) =>
                      page.id !== pageId
                        ? page
                        : {
                            ...page,
                            sections: page.sections.map((section) =>
                              section.id !== sectionId
                                ? section
                                : {
                                    ...section,
                                    blocks: section.blocks.map((item) => (item.id === block.id ? block : item)),
                                  },
                            ),
                          },
                    ),
                  },
                }
              : current,
          );
          break;
        }
        case "SET_SECTION_VISIBILITY": {
          const { pageId, sectionId, visible } = event.payload;
          setData((current) =>
            current
              ? {
                  ...current,
                  document: {
                    ...current.document,
                    pages: current.document.pages.map((page) =>
                      page.id !== pageId
                        ? page
                        : {
                            ...page,
                            sections: page.sections.map((section) =>
                              section.id !== sectionId ? section : { ...section, visible },
                            ),
                          },
                    ),
                  },
                }
              : current,
          );
          break;
        }
        case "SET_EDIT_MODE":
          setEditing(event.payload.editing);
          break;
      }
    }
    window.addEventListener("message", onMessage);

    // CANVAS_READY est annoncé en boucle jusqu'à réception du document : la
    // page parente (shell complet, plus lourd à monter) peut ne pas avoir
    // encore attaché son propre écouteur au moment du tout premier envoi, et
    // un postMessage manqué ne se rattrape jamais tout seul. Sans cette
    // relance, le canvas peut rester bloqué indéfiniment sur l'écran de
    // chargement (§32 — jamais de canvas vide sans explication).
    postToEditor({ type: "CANVAS_READY" });
    const retry = setInterval(() => {
      if (!acknowledged) postToEditor({ type: "CANVAS_READY" });
    }, 250);

    return () => {
      clearInterval(retry);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  // --- Défilement + barre flottante vers le bloc sélectionné -----------------
  // La barre doit disparaître dès que la sélection change ou que son élément
  // sort du DOM (document modifié) : ce nettoyage dépend d'un état externe
  // (sélection postMessage + DOM), pas d'une valeur dérivable au rendu.
  useEffect(() => {
    if (!editing || selection?.kind !== "block") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToolbar(null);
      return;
    }
    const element = document.querySelector(`[data-sigmood-block-id="${CSS.escape(selection.ref.blockId)}"]`);
    if (!(element instanceof HTMLElement)) {
      setToolbar(null);
      return;
    }
    const rect = element.getBoundingClientRect();
    const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!inView) element.scrollIntoView({ behavior: "smooth", block: "center" });

    function measure() {
      const box = (element as HTMLElement).getBoundingClientRect();
      setToolbar({
        top: Math.max(box.top + window.scrollY - 44, window.scrollY + 8),
        left: Math.max(box.left + window.scrollX, 8),
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selection, editing, data]);

  // --- Sélection au clic (aucune navigation en mode édition) -----------------
  const onClickCapture = useCallback(
    (event: React.MouseEvent) => {
      if (!editing) return;
      const target = event.target as Element;
      // La barre flottante reste cliquable normalement.
      if (target.closest("[data-sigmood-toolbar]")) return;
      event.preventDefault();
      event.stopPropagation();

      const ref = referenceFromElement(target);
      if (ref) {
        postToEditor({ type: "ELEMENT_SELECTED", payload: ref });
        return;
      }
      const dynamicHost = target.closest("[data-sigmood-dynamic]");
      if (dynamicHost) {
        postToEditor({
          type: "DYNAMIC_CONTENT_SELECTED",
          payload: {
            pageId: dynamicHost.getAttribute("data-sigmood-page-id") ?? data?.pageId ?? "home",
            sectionId: dynamicHost.getAttribute("data-sigmood-section-id"),
            label: dynamicHost.getAttribute("data-sigmood-dynamic") ?? "Contenu dynamique",
          },
        });
        return;
      }
      postToEditor({ type: "SELECTION_CLEARED" });
    },
    [editing, data],
  );

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-base px-6 text-center">
        <div>
          <p className="text-sm font-medium text-ink-2">Chargement de la boutique…</p>
          <p className="mt-2 text-xs text-ink-3">L’aperçu s’affiche dès que l’éditeur est prêt.</p>
        </div>
      </main>
    );
  }

  const page: StorePage | null = findPage(data.document, data.pageId);
  if (!page) {
    return (
      <main className="grid min-h-screen place-items-center bg-base px-6 text-center">
        <div>
          <p className="text-sm font-medium text-ink-2">Page introuvable</p>
          <p className="mt-2 text-xs text-ink-3">Cette page n’existe pas encore dans le document de la boutique.</p>
        </div>
      </main>
    );
  }

  const selectedBlockLabel =
    selection?.kind === "block"
      ? document
          .querySelector(`[data-sigmood-block-id="${CSS.escape(selection.ref.blockId)}"]`)
          ?.getAttribute("data-sigmood-label") ?? "Bloc"
      : "Bloc";

  return (
    <div ref={rootRef} className={editing ? "sigmood-canvas-edit" : undefined} onClickCapture={onClickCapture}>
      <StorefrontView page={page} store={data.store} products={data.products} editing={editing} selection={selection} />
      {editing && toolbar && selection?.kind === "block" && (
        <div
          data-sigmood-toolbar
          className="absolute z-50 flex items-center gap-1 rounded-full border border-line bg-ink px-1.5 py-1 shadow-[var(--elevation-3)]"
          style={{ top: toolbar.top, left: toolbar.left }}
        >
          <span className="px-2 text-[0.7rem] font-medium text-white/85">{selectedBlockLabel}</span>
          <button
            type="button"
            className="rounded-full bg-white/12 px-2.5 py-1 text-[0.7rem] font-medium text-white transition hover:bg-white/25"
            onClick={() => postToEditor({ type: "BLOCK_ACTION", payload: { action: "content", ref: selection.ref } })}
          >
            Modifier le texte
          </button>
          <button
            type="button"
            className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-medium text-ink transition hover:opacity-85"
            onClick={() => postToEditor({ type: "BLOCK_ACTION", payload: { action: "ai", ref: selection.ref } })}
          >
            Modifier avec l’IA
          </button>
        </div>
      )}
    </div>
  );
}
