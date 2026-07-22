import { describe, expect, it } from "vitest";
import { containsDangerousContent, sanitizeText, truncateAtWord } from "./sanitize";

describe("sanitizeText", () => {
  it("strips HTML tags", () => {
    expect(sanitizeText("<script>alert(1)</script>Bonjour")).toBe("alert(1)Bonjour");
    expect(sanitizeText("<b>Gras</b>")).toBe("Gras");
  });

  it("removes control characters but keeps newlines and tabs", () => {
    const withControl = "Ligne 1Ligne 2\nLigne 3\tSuite";
    expect(sanitizeText(withControl)).toBe("Ligne 1Ligne 2\nLigne 3\tSuite");
  });

  it("normalizes CRLF to LF", () => {
    expect(sanitizeText("a\r\nb")).toBe("a\nb");
  });

  it("truncates to maxLength", () => {
    expect(sanitizeText("abcdefghij", 5)).toBe("abcde");
  });
});

describe("containsDangerousContent", () => {
  it("flags javascript: URLs", () => {
    expect(containsDangerousContent("javascript:alert(1)")).toBe(true);
  });

  it("flags inline event handlers", () => {
    expect(containsDangerousContent('onmouseover="alert(1)"')).toBe(true);
  });

  it("flags script tags", () => {
    expect(containsDangerousContent("<script>x</script>")).toBe(true);
  });

  it("does not flag ordinary marketing copy", () => {
    expect(containsDangerousContent("Découvrez notre collection premium, dès aujourd'hui.")).toBe(false);
  });
});

describe("truncateAtWord", () => {
  it("returns the input unchanged when under the limit", () => {
    expect(truncateAtWord("court", 20)).toBe("court");
  });

  it("cuts at a word boundary when possible", () => {
    const result = truncateAtWord("Une phrase assez longue pour être coupée", 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith(" ")).toBe(false);
  });
});
