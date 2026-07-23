import { describe, expect, it } from "vitest";
import { findBlock, getFieldValue } from "./document-schema";
import { mergeSubmittedDocument } from "./validate-document";

const seed = { id: "store_1", name: "Atelier Nival", slug: "atelier-nival", niche: "Cosmétiques", audience: "Femmes 25-40" };

describe("mergeSubmittedDocument", () => {
  it("falls back to the canonical document when the payload is unreadable", () => {
    const { document, issues } = mergeSubmittedDocument(seed, null);
    expect(document.pages.some((page) => page.id === "home")).toBe(true);
    expect(issues.length).toBeGreaterThan(0);
  });

  it("applies a legitimate edit to an editable field", () => {
    const payload = {
      pages: [
        {
          id: "home",
          sections: [
            {
              id: "hero-main",
              blocks: [{ id: "hero-content", content: { heading: { value: "Nouveau titre" } } }],
            },
          ],
        },
      ],
    };
    const { document } = mergeSubmittedDocument(seed, payload);
    const block = findBlock(document, { pageId: "home", sectionId: "hero-main", blockId: "hero-content" });
    expect(block && getFieldValue(block, "heading")).toBe("Nouveau titre");
  });

  it("ignores an attempt to inject an unknown field and reports it", () => {
    const payload = {
      pages: [
        {
          id: "home",
          sections: [
            {
              id: "hero-main",
              blocks: [{ id: "hero-content", content: { rogueField: { value: "injected" } } }],
            },
          ],
        },
      ],
    };
    const { document, issues } = mergeSubmittedDocument(seed, payload);
    const block = findBlock(document, { pageId: "home", sectionId: "hero-main", blockId: "hero-content" });
    expect(block?.content.rogueField).toBeUndefined();
    expect(issues.some((issue) => issue.includes("rogueField"))).toBe(true);
  });

  it("strips HTML tags from submitted values", () => {
    const payload = {
      pages: [
        {
          id: "home",
          sections: [
            {
              id: "hero-main",
              blocks: [{ id: "hero-content", content: { heading: { value: "<b>Gras</b> et texte" } } }],
            },
          ],
        },
      ],
    };
    const { document } = mergeSubmittedDocument(seed, payload);
    const block = findBlock(document, { pageId: "home", sectionId: "hero-main", blockId: "hero-content" });
    expect(block && getFieldValue(block, "heading")).toBe("Gras et texte");
  });

  it("rejects dangerous content instead of storing it", () => {
    const payload = {
      pages: [
        {
          id: "home",
          sections: [
            {
              id: "hero-main",
              blocks: [{ id: "hero-content", content: { heading: { value: "javascript:alert(1)" } } }],
            },
          ],
        },
      ],
    };
    const { document, issues } = mergeSubmittedDocument(seed, payload);
    const block = findBlock(document, { pageId: "home", sectionId: "hero-main", blockId: "hero-content" });
    expect(block && getFieldValue(block, "heading")).not.toContain("javascript:");
    expect(issues.some((issue) => issue.includes("dangereux"))).toBe(true);
  });

  it("never lets a submitted document change which store the document belongs to", () => {
    const payload = { storeId: "someone-elses-store", pages: [] };
    const { document } = mergeSubmittedDocument(seed, payload);
    expect(document.storeId).toBe(seed.id);
  });

  it("falls back to version 0 for a non-integer or negative version", () => {
    const { document: d1 } = mergeSubmittedDocument(seed, { pages: [], version: -1 });
    expect(d1.version).toBe(0);
    const { document: d2 } = mergeSubmittedDocument(seed, { pages: [], version: 1.5 });
    expect(d2.version).toBe(0);
  });
});

function home(document: ReturnType<typeof mergeSubmittedDocument>["document"]) {
  return document.pages.find((page) => page.id === "home")!;
}

describe("mergeSubmittedDocument — sections dynamiques", () => {
  it("keeps a newly added section and sanitizes its fields", () => {
    const payload = {
      pages: [
        {
          id: "home",
          sections: [
            { id: "hero-main", type: "hero", visible: true, blocks: [] },
            {
              id: "custom-benefits-1",
              type: "benefits",
              visible: true,
              blocks: [
                { id: "b-intro", type: "benefits-intro", content: { heading: { value: "<b>Nos</b> atouts" } } },
                { id: "b-1", type: "benefit-item", content: { title: { value: "Rapide" }, description: { value: "Soigné" } } },
              ],
            },
          ],
        },
      ],
    };
    const { document } = mergeSubmittedDocument(seed, payload);
    const added = home(document).sections.find((section) => section.id === "custom-benefits-1");
    expect(added?.type).toBe("benefits");
    const intro = added?.blocks.find((block) => block.id === "b-intro");
    expect(intro && getFieldValue(intro, "heading")).toBe("Nos atouts");
  });

  it("drops a canonical section omitted from the submission (supports deletion)", () => {
    const { document } = mergeSubmittedDocument(seed, {
      pages: [{ id: "home", sections: [{ id: "hero-main", type: "hero", blocks: [] }] }],
    });
    expect(home(document).sections.some((section) => section.id === "hero-main")).toBe(true);
    expect(home(document).sections.some((section) => section.id === "faq-main")).toBe(false);
  });

  it("reflects the submitted section order in positions (supports reordering)", () => {
    const { document } = mergeSubmittedDocument(seed, {
      pages: [
        {
          id: "home",
          sections: [
            { id: "faq-main", type: "faq", blocks: [] },
            { id: "hero-main", type: "hero", blocks: [] },
          ],
        },
      ],
    });
    const ordered = [...home(document).sections].sort((a, b) => a.position - b.position).map((section) => section.id);
    expect(ordered).toEqual(["faq-main", "hero-main"]);
  });

  it("rejects dangerous content inside an added section field", () => {
    const { document, issues } = mergeSubmittedDocument(seed, {
      pages: [
        {
          id: "home",
          sections: [
            {
              id: "x-1",
              type: "benefits",
              blocks: [{ id: "i", type: "benefits-intro", content: { heading: { value: "javascript:alert(1)" } } }],
            },
          ],
        },
      ],
    });
    const intro = home(document).sections.find((section) => section.id === "x-1")?.blocks.find((block) => block.id === "i");
    expect(intro && getFieldValue(intro, "heading")).toBe("");
    expect(issues.some((issue) => issue.includes("dangereux"))).toBe(true);
  });

  it("ignores a submitted section whose type is unknown", () => {
    const { document, issues } = mergeSubmittedDocument(seed, {
      pages: [
        {
          id: "home",
          sections: [
            { id: "hero-main", type: "hero", blocks: [] },
            { id: "evil-1", type: "evil", blocks: [] },
          ],
        },
      ],
    });
    expect(home(document).sections.some((section) => section.id === "evil-1")).toBe(false);
    expect(issues.some((issue) => issue.includes("type inconnu"))).toBe(true);
  });
});
