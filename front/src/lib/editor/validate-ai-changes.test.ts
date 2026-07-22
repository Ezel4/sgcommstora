import { describe, expect, it } from "vitest";
import { buildDefaultDocument } from "./default-document";
import { validateScopedAiChanges } from "./validate-ai-changes";

const seed = { id: "store_1", name: "Atelier Nival", slug: "atelier-nival", niche: "Cosmétiques", audience: "Femmes 25-40" };

function heroSelection() {
  return { pageId: "home", sectionId: "hero-main", blockId: "hero-content" };
}

describe("validateScopedAiChanges", () => {
  it("accepts changes to allowed fields of the selected block", () => {
    const document = buildDefaultDocument(seed);
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "hero-content",
      proposedChanges: [{ field: "heading", newValue: "Un nouveau titre premium" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.changes).toHaveLength(1);
      expect(result.changes[0].field).toBe("heading");
      expect(result.changes[0].newValue).toBe("Un nouveau titre premium");
    }
  });

  it("rejects a proposal that targets a different block than the selection", () => {
    const document = buildDefaultDocument(seed);
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "footer-content", // l'IA tente de viser un autre bloc
      proposedChanges: [{ field: "about", newValue: "Texte injecté" }],
    });
    expect(result.ok).toBe(false);
  });

  it("drops fields that are not declared editable for the block, without failing the whole request", () => {
    const document = buildDefaultDocument(seed);
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "hero-content",
      proposedChanges: [
        { field: "heading", newValue: "Titre valide" },
        { field: "price", newValue: "0" }, // champ inexistant sur ce bloc
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.changes).toHaveLength(1);
      expect(result.changes[0].field).toBe("heading");
      expect(result.rejected.some((entry) => entry.includes("price"))).toBe(true);
    }
  });

  it("rejects values containing dangerous content instead of applying them", () => {
    const document = buildDefaultDocument(seed);
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "hero-content",
      proposedChanges: [{ field: "heading", newValue: '<script>alert(1)</script>' }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.changes).toHaveLength(0);
      expect(result.rejected.some((entry) => entry.includes("dangereux"))).toBe(true);
    }
  });

  it("truncates a proposed value to the field's maxLength", () => {
    const document = buildDefaultDocument(seed);
    const longValue = "a".repeat(500);
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "hero-content",
      proposedChanges: [{ field: "description", newValue: longValue }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.changes[0].newValue.length).toBeLessThanOrEqual(300);
    }
  });

  it("fails cleanly when the selection no longer exists in the document", () => {
    const document = buildDefaultDocument(seed);
    const result = validateScopedAiChanges({
      document,
      selection: { pageId: "home", sectionId: "does-not-exist", blockId: "hero-content" },
      proposalBlockId: "hero-content",
      proposedChanges: [{ field: "heading", newValue: "x" }],
    });
    expect(result.ok).toBe(false);
  });

  it("never lets the AI touch a non-editable field even if named identically elsewhere", () => {
    const document = buildDefaultDocument(seed);
    // Le champ "text" n'existe que sur announcement-bar, pas sur hero-content.
    const result = validateScopedAiChanges({
      document,
      selection: heroSelection(),
      proposalBlockId: "hero-content",
      proposedChanges: [{ field: "text", newValue: "Injection tentée" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.changes).toHaveLength(0);
    }
  });
});
