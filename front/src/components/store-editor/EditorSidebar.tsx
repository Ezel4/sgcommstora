"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getSectionDefinition } from "@/lib/editor/section-definitions";
import type { StorePage } from "@/lib/editor/document-schema";
import { createSection, isSingletonSection } from "@/lib/editor/section-library";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevron,
  IconEye,
  IconEyeOff,
  IconFile,
  IconLayers,
  IconLock,
  IconPlus,
  IconTrash,
} from "./editor-icons";
import { SectionLibraryDrawer } from "./SectionLibraryDrawer";
import { useEditor } from "./editor-store";

type SidebarTab = "pages" | "sections";

const PAGE_TYPE_LABEL: Record<StorePage["type"], string> = {
  home: "Accueil",
  product: "Modèle produit",
  collection: "Modèle collection",
  content: "Page de contenu",
};

export function EditorSidebar() {
  const [tab, setTab] = useState<SidebarTab>("sections");
  const { state, dispatch } = useEditor();
  const currentPage = state.document.pages.find((page) => page.id === state.pageId) ?? null;
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Ordre visuel (identique au canvas), pas l'ordre de stockage.
  const orderedSections = currentPage ? [...currentPage.sections].sort((a, b) => a.position - b.position) : [];

  function toggleCollapsed(sectionId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function handleAddSection(type: string) {
    if (!currentPage) return;
    const section = createSection(type);
    if (!section) return;
    // Insérée avant le pied de page pour le garder en dernier.
    const footerIndex = orderedSections.findIndex((item) => item.type === "footer");
    const index = footerIndex === -1 ? orderedSections.length : footerIndex;
    dispatch({ type: "ADD_SECTION", pageId: state.pageId, section, index });
    setDrawerOpen(false);
  }

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-line bg-surface/70">
      <div className="flex gap-1 border-b border-line p-2">
        {(["pages", "sections"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-[0.8125rem] font-medium transition",
              tab === value ? "bg-surface-2 text-ink" : "text-ink-3 hover:text-ink",
            )}
          >
            {value === "pages" ? "Pages" : "Sections"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tab === "pages" ? (
          <ul className="flex flex-col gap-0.5">
            {state.document.pages.map((page) => {
              const active = page.id === state.pageId;
              const disabled = page.status === "not-configured";
              return (
                <li key={page.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      dispatch({ type: "SET_PAGE", pageId: page.id });
                      setTab("sections");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[0.8125rem] transition",
                      active ? "bg-surface-2 text-ink" : "text-ink-2 hover:bg-surface-2/70 hover:text-ink",
                      disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <IconFile className="size-4 shrink-0 text-ink-3" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{page.title}</span>
                      <span className="block truncate text-[0.7rem] text-ink-3">{PAGE_TYPE_LABEL[page.type]}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium",
                        disabled ? "bg-black/6 text-ink-3" : "bg-success-soft text-success",
                      )}
                    >
                      {disabled ? "Non configurée" : "Configurée"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {orderedSections.map((section, orderIndex) => {
              const definition = getSectionDefinition(section.type);
              const isCollapsed = collapsed.has(section.id);
              const sectionSelected = state.selection?.kind === "section" && state.selection.sectionId === section.id;
              const singleton = isSingletonSection(section.type);
              const prev = orderedSections[orderIndex - 1];
              const next = orderedSections[orderIndex + 1];
              const canMoveUp = !singleton && Boolean(prev) && !isSingletonSection(prev.type);
              const canMoveDown = !singleton && Boolean(next) && !isSingletonSection(next.type);
              return (
                <li key={section.id} data-testid="sidebar-section-item">
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-xl px-1.5 py-1.5 transition",
                      sectionSelected && "bg-surface-2",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(section.id)}
                      className="grid size-6 shrink-0 place-items-center rounded-md text-ink-3 hover:text-ink"
                      aria-label={isCollapsed ? "Déplier" : "Replier"}
                    >
                      <IconChevron className={cn("size-3.5 transition-transform", !isCollapsed && "rotate-90")} />
                    </button>
                    <button
                      type="button"
                      data-testid="sidebar-section-select"
                      onClick={() =>
                        dispatch({ type: "SELECT", selection: { kind: "section", pageId: state.pageId, sectionId: section.id } })
                      }
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1 text-left text-[0.8125rem] text-ink hover:text-ink"
                    >
                      <IconLayers className="size-3.5 shrink-0 text-ink-3" />
                      <span className="truncate font-medium">{definition?.label ?? section.type}</span>
                      {!section.visible && <IconEyeOff className="size-3.5 shrink-0 text-ink-3" aria-label="Section masquée" />}
                    </button>
                    <div className="flex shrink-0 items-center gap-0.5">
                      {!singleton && (
                        <>
                          <button
                            type="button"
                            disabled={!canMoveUp}
                            onClick={() => dispatch({ type: "MOVE_SECTION", pageId: state.pageId, sectionId: section.id, direction: "up" })}
                            className="grid size-6 place-items-center rounded-md text-ink-3 transition enabled:hover:bg-black/5 enabled:hover:text-ink disabled:opacity-30"
                            aria-label="Monter la section"
                            title="Monter"
                          >
                            <IconArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={!canMoveDown}
                            onClick={() => dispatch({ type: "MOVE_SECTION", pageId: state.pageId, sectionId: section.id, direction: "down" })}
                            className="grid size-6 place-items-center rounded-md text-ink-3 transition enabled:hover:bg-black/5 enabled:hover:text-ink disabled:opacity-30"
                            aria-label="Descendre la section"
                            title="Descendre"
                          >
                            <IconArrowDown className="size-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", pageId: state.pageId, sectionId: section.id })}
                        className="grid size-6 place-items-center rounded-md text-ink-3 transition hover:bg-black/5 hover:text-ink"
                        aria-label={section.visible ? "Masquer la section" : "Afficher la section"}
                        title={section.visible ? "Masquer" : "Afficher"}
                      >
                        {section.visible ? <IconEye className="size-3.5" /> : <IconEyeOff className="size-3.5" />}
                      </button>
                      {!singleton && (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "REMOVE_SECTION", pageId: state.pageId, sectionId: section.id })}
                          className="grid size-6 place-items-center rounded-md text-ink-3 transition hover:bg-danger-soft hover:text-danger"
                          aria-label="Supprimer la section"
                          title="Supprimer"
                        >
                          <IconTrash className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <ul className="ml-8 flex flex-col gap-0.5 border-l border-line pl-2 pb-1 pt-0.5">
                      {section.blocks.map((blockItem) => {
                        const blockDefinition = definition?.blocks[blockItem.type];
                        const selected = state.selection?.kind === "block" && state.selection.ref.blockId === blockItem.id;
                        const locked = !blockDefinition;
                        return (
                          <li key={blockItem.id} data-testid="sidebar-block-item">
                            <button
                              type="button"
                              disabled={locked}
                              onClick={() =>
                                dispatch({
                                  type: "SELECT",
                                  selection: { kind: "block", ref: { pageId: state.pageId, sectionId: section.id, blockId: blockItem.id } },
                                })
                              }
                              className={cn(
                                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[0.775rem] transition",
                                selected ? "bg-accent-soft text-accent-ink" : "text-ink-2 hover:bg-surface-2/70 hover:text-ink",
                                locked && "cursor-not-allowed opacity-50",
                              )}
                            >
                              {locked ? <IconLock className="size-3 shrink-0" /> : <span className="size-1.5 shrink-0 rounded-full bg-current opacity-40" />}
                              <span className="truncate">{blockDefinition?.label ?? blockItem.type}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
            {!orderedSections.length && (
              <li className="px-2 py-6 text-center text-[0.8125rem] text-ink-3">Cette page n’a pas encore de sections.</li>
            )}
          </ul>
        )}
      </div>

      {tab === "sections" && currentPage && (
        <div className="border-t border-line p-2">
          <button
            type="button"
            data-testid="add-section-button"
            onClick={() => setDrawerOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2.5 text-[0.8125rem] font-medium text-ink-2 transition hover:border-ink/30 hover:bg-surface-2 hover:text-ink"
          >
            <IconPlus className="size-4" />
            Ajouter une section
          </button>
        </div>
      )}

      <SectionLibraryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAddSection} />
    </aside>
  );
}
