import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats euros without decimals", () => {
    const out = formatCurrency(1234);
    expect(out).toContain("1");
    expect(out).toContain("234");
    expect(out).toContain("€");
    expect(out).not.toContain(",00");
  });

  it("rounds to whole euros", () => {
    expect(formatCurrency(56.5)).toContain("57");
  });
});

describe("formatPercent", () => {
  it("formats a percentage from a 0-100 value with one decimal", () => {
    const out = formatPercent(3.8);
    expect(out).toContain("3,8");
    expect(out).toContain("%");
  });
});
