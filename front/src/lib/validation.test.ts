import { describe, expect, it } from "vitest";
import {
  assertEmail,
  assertIdentifier,
  assertPhone,
  InputValidationError,
  isValidationError,
  readNonNegativeNumber,
  readOptionalString,
  readRequiredString,
} from "@/lib/validation";

function fd(entries: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(entries)) form.set(key, value);
  return form;
}

describe("readRequiredString", () => {
  it("trims and returns the value", () => {
    expect(readRequiredString(fd({ name: "  Alice  " }), "name", "Le nom", 50)).toBe("Alice");
  });

  it("throws when missing or empty", () => {
    expect(() => readRequiredString(fd({ name: "   " }), "name", "Le nom", 50)).toThrow(InputValidationError);
    expect(() => readRequiredString(fd({}), "name", "Le nom", 50)).toThrow(InputValidationError);
  });

  it("throws when too long", () => {
    expect(() => readRequiredString(fd({ name: "abcdef" }), "name", "Le nom", 3)).toThrow(/trop long/);
  });
});

describe("readOptionalString", () => {
  it("returns empty string when absent", () => {
    expect(readOptionalString(fd({}), "company", "L’entreprise", 50)).toBe("");
  });

  it("trims present values", () => {
    expect(readOptionalString(fd({ company: " Acme " }), "company", "L’entreprise", 50)).toBe("Acme");
  });
});

describe("assertEmail", () => {
  it("accepts valid emails and empty", () => {
    expect(() => assertEmail("")).not.toThrow();
    expect(() => assertEmail("a@b.co")).not.toThrow();
  });

  it("rejects malformed emails", () => {
    expect(() => assertEmail("nope")).toThrow(InputValidationError);
    expect(() => assertEmail("a@b")).toThrow(InputValidationError);
  });
});

describe("assertPhone", () => {
  it("accepts valid phone numbers and empty", () => {
    expect(() => assertPhone("")).not.toThrow();
    expect(() => assertPhone("+33 6 12 34 56 78")).not.toThrow();
  });

  it("rejects too-short or invalid characters", () => {
    expect(() => assertPhone("123")).toThrow(InputValidationError);
    expect(() => assertPhone("abcd1234")).toThrow(InputValidationError);
  });
});

describe("assertIdentifier", () => {
  it("accepts safe identifiers", () => {
    expect(assertIdentifier("abc-123_XYZ")).toBe("abc-123_XYZ");
  });

  it("rejects unsafe values", () => {
    expect(() => assertIdentifier("bad id!")).toThrow(InputValidationError);
    expect(() => assertIdentifier("")).toThrow(InputValidationError);
  });
});

describe("readNonNegativeNumber", () => {
  it("defaults to 0 when absent", () => {
    expect(readNonNegativeNumber(fd({}), "mrr", "Le MRR")).toBe(0);
  });

  it("parses valid numbers", () => {
    expect(readNonNegativeNumber(fd({ mrr: "42" }), "mrr", "Le MRR")).toBe(42);
  });

  it("rejects negatives and non-numbers", () => {
    expect(() => readNonNegativeNumber(fd({ mrr: "-1" }), "mrr", "Le MRR")).toThrow(InputValidationError);
    expect(() => readNonNegativeNumber(fd({ mrr: "abc" }), "mrr", "Le MRR")).toThrow(InputValidationError);
  });
});

describe("isValidationError", () => {
  it("discriminates validation errors", () => {
    expect(isValidationError(new InputValidationError("x"))).toBe(true);
    expect(isValidationError(new Error("x"))).toBe(false);
  });
});
