import { describe, expect, it } from "vitest";
import { buildDefaultDocument } from "@/lib/editor/default-document";
import { sectionIndex } from "@/lib/editor/document-schema";
import { createSection } from "@/lib/editor/section-library";
import { createInitialState, editorReducer, type EditorInit } from "./editor-store";

const seed = { id: "store_1", name: "Atelier Nival", slug: "atelier-nival", niche: "Cosmétiques", audience: "Femmes 25-40" };

function initialState() {
  const document = buildDefaultDocument(seed);
  const init = {
    document,
    draftVersion: 0,
    publishedVersion: null,
    publishedAt: null,
    persistence: "local",
  } as unknown as EditorInit;
  return createInitialState(init);
}

function orderedTypes(document: ReturnType<typeof buildDefaultDocument>) {
  const home = document.pages.find((page) => page.id === "home")!;
  return [...home.sections].sort((a, b) => a.position - b.position).map((section) => section.type);
}

describe("editorReducer — structure", () => {
  it("adds a section at the requested index and selects it", () => {
    const state = initialState();
    const section = createSection("newsletter")!;
    const next = editorReducer(state, { type: "ADD_SECTION", pageId: "home", section, index: 2 });
    expect(sectionIndex(next.document, "home", section.id)).toBe(2);
    expect(next.selection).toEqual({ kind: "section", pageId: "home", sectionId: section.id });
    expect(next.revision).toBe(state.revision + 1);
  });

  it("undo/redo of an add restores then re-applies the section", () => {
    const state = initialState();
    const section = createSection("faq")!;
    const added = editorReducer(state, { type: "ADD_SECTION", pageId: "home", section, index: 3 });
    const undone = editorReducer(added, { type: "UNDO" });
    expect(sectionIndex(undone.document, "home", section.id)).toBe(-1);
    const redone = editorReducer(undone, { type: "REDO" });
    expect(sectionIndex(redone.document, "home", section.id)).toBe(3);
  });

  it("removes a section and clears a selection that pointed at it", () => {
    const state = initialState();
    const withSelection = editorReducer(state, {
      type: "SELECT",
      selection: { kind: "section", pageId: "home", sectionId: "faq-main" },
    });
    const removed = editorReducer(withSelection, { type: "REMOVE_SECTION", pageId: "home", sectionId: "faq-main" });
    expect(orderedTypes(removed.document)).not.toContain("faq");
    expect(removed.selection).toBeNull();
    // La suppression est réversible.
    const restored = editorReducer(removed, { type: "UNDO" });
    expect(orderedTypes(restored.document)).toContain("faq");
  });

  it("moves a section up while preserving other sections", () => {
    const state = initialState();
    const before = sectionIndex(state.document, "home", "faq-main");
    const moved = editorReducer(state, { type: "MOVE_SECTION", pageId: "home", sectionId: "faq-main", direction: "up" });
    expect(sectionIndex(moved.document, "home", "faq-main")).toBe(before - 1);
    expect(orderedTypes(moved.document).sort()).toEqual(orderedTypes(state.document).sort());
  });
});
