import { describe, expect, it } from "vitest";
import { buildDefaultDocument } from "./default-document";
import { insertSection, moveSection, removeSection, sectionIndex } from "./document-schema";
import { getBlockDefinition, getSectionDefinition } from "./section-definitions";
import { ADDABLE_SECTIONS, createSection, isSingletonSection } from "./section-library";

const seed = { id: "store_1", name: "Atelier Nival", slug: "atelier-nival", niche: "Cosmétiques", audience: "Femmes 25-40" };

function homePositions(doc: ReturnType<typeof buildDefaultDocument>) {
  const home = doc.pages.find((page) => page.id === "home")!;
  return [...home.sections].sort((a, b) => a.position - b.position).map((section) => section.type);
}

describe("createSection", () => {
  it("builds an addable section with a unique id, default blocks and visible=true", () => {
    const section = createSection("faq");
    expect(section).not.toBeNull();
    expect(section!.type).toBe("faq");
    expect(section!.visible).toBe(true);
    expect(section!.blocks.length).toBeGreaterThan(0);
    // Deux appels produisent des identifiants distincts.
    expect(createSection("faq")!.id).not.toBe(section!.id);
  });

  it("returns null for an unknown or non-addable type", () => {
    expect(createSection("does-not-exist")).toBeNull();
  });

  it("only lists content sections as addable (never singletons)", () => {
    for (const entry of ADDABLE_SECTIONS) {
      expect(isSingletonSection(entry.type)).toBe(false);
      expect(createSection(entry.type)).not.toBeNull();
    }
  });
});

describe("section structure helpers", () => {
  it("inserts a section at a visual index and renumbers positions 0..n", () => {
    const doc = buildDefaultDocument(seed);
    const faq = createSection("faq")!;
    const next = insertSection(doc, "home", faq, 2);
    const home = next.pages.find((page) => page.id === "home")!;
    const ordered = [...home.sections].sort((a, b) => a.position - b.position);
    expect(ordered[2].id).toBe(faq.id);
    // Positions denses et sans trou.
    expect(ordered.map((s) => s.position)).toEqual(ordered.map((_, i) => i));
  });

  it("removes a section and keeps positions dense", () => {
    const doc = buildDefaultDocument(seed);
    const before = homePositions(doc);
    const next = removeSection(doc, "home", "hero-main");
    const after = homePositions(next);
    expect(after).not.toContain("hero");
    expect(after.length).toBe(before.length - 1);
    const home = next.pages.find((page) => page.id === "home")!;
    expect([...home.sections].sort((a, b) => a.position - b.position).map((s) => s.position)).toEqual(
      home.sections.map((_, i) => i),
    );
  });

  it("moves a section up and down by visual index", () => {
    const doc = buildDefaultDocument(seed);
    const idx = sectionIndex(doc, "home", "faq-main");
    const up = moveSection(doc, "home", "faq-main", idx - 1);
    expect(sectionIndex(up, "home", "faq-main")).toBe(idx - 1);
    const back = moveSection(up, "home", "faq-main", idx);
    expect(sectionIndex(back, "home", "faq-main")).toBe(idx);
  });

  it("clamps out-of-range insert/move indices", () => {
    const doc = buildDefaultDocument(seed);
    const faq = createSection("faq")!;
    const appended = insertSection(doc, "home", faq, 999);
    expect(sectionIndex(appended, "home", faq.id)).toBe(
      appended.pages.find((p) => p.id === "home")!.sections.length - 1,
    );
  });
});

describe("default document integrity", () => {
  it("configures the product and collection template pages with sections", () => {
    const doc = buildDefaultDocument(seed);
    for (const id of ["product-template", "collection-template"]) {
      const page = doc.pages.find((p) => p.id === id)!;
      expect(page.status).toBe("configured");
      expect(page.sections.length).toBeGreaterThan(0);
    }
  });

  it("only uses section and block types that are declared in the library", () => {
    const doc = buildDefaultDocument(seed);
    for (const page of doc.pages) {
      for (const section of page.sections) {
        expect(getSectionDefinition(section.type), `section type ${section.type}`).not.toBeNull();
        for (const blockItem of section.blocks) {
          expect(getBlockDefinition(section.type, blockItem.type), `block ${section.type}/${blockItem.type}`).not.toBeNull();
        }
      }
    }
  });
});
