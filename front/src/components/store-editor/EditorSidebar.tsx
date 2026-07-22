"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getSectionDefinition } from "@/lib/editor/section-definitions";
import type { StorePage } from "@/lib/editor/document-schema";
import { IconChevron, IconEyeOff, IconFile, IconLayers, IconLock } from "./editor-icons";
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

  function toggleCollapsed(sectionId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
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
                    onClick={() => dispatch({ type: "SELECT", selection: null })}
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
            {currentPage?.sections.map((section) => {
              const definition = getSectionDefinition(section.type);
              const isCollapsed = collapsed.has(section.id);
              const sectionSelected = state.selection?.kind === "section" && state.selection.sectionId === section.id;
              return (
                <li key={section.id}>
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
                      onClick={() =>
                        dispatch({ type: "SELECT", selection: { kind: "section", pageId: currentPage.id, sectionId: section.id } })
                      }
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1 text-left text-[0.8125rem] text-ink hover:text-ink"
                    >
                      <IconLayers className="size-3.5 shrink-0 text-ink-3" />
                      <span className="truncate font-medium">{definition?.label ?? section.type}</span>
                    </button>
                    {!section.visible && (
                      <span title="Section masquée" className="shrink-0 text-ink-3">
                        <IconEyeOff className="size-3.5" />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "TOGGLE_SECTION_VISIBILITY", pageId: currentPage.id, sectionId: section.id })}
                      className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium text-ink-3 transition hover:bg-black/5 hover:text-ink"
                    >
                      {section.visible ? "Masquer" : "Afficher"}
                    </button>
                  </div>

                  {!isCollapsed && (
                    <ul className="ml-8 flex flex-col gap-0.5 border-l border-line pl-2 pb-1 pt-0.5">
                      {section.blocks.map((blockItem) => {
                        const blockDefinition = definition?.blocks[blockItem.type];
                        const selected = state.selection?.kind === "block" && state.selection.ref.blockId === blockItem.id;
                        const locked = !blockDefinition;
                        return (
                          <li key={blockItem.id}>
                            <button
                              type="button"
                              disabled={locked}
                              onClick={() =>
                                dispatch({
                                  type: "SELECT",
                                  selection: { kind: "block", ref: { pageId: currentPage.id, sectionId: section.id, blockId: blockItem.id } },
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
            {!currentPage?.sections.length && (
              <li className="px-2 py-6 text-center text-[0.8125rem] text-ink-3">Cette page n’a pas encore de sections.</li>
            )}
          </ul>
        )}
      </div>
    </aside>
  );
}
