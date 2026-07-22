import { describe, expect, it } from "vitest";
import type { Tables } from "@/lib/supabase/database.types";
import {
  buildMetrics,
  mapCustomerSegment,
  mapOrderStatus,
  mapProduct,
  mapProductStatus,
  mapStore,
  mapStoreStatus,
} from "@/lib/commerce-mappers";
import type { Order, Product } from "@/types/commerce";

describe("mapStoreStatus", () => {
  it("keeps known statuses and falls back to needs-review", () => {
    expect(mapStoreStatus("published")).toBe("published");
    expect(mapStoreStatus("draft")).toBe("draft");
    expect(mapStoreStatus("whatever")).toBe("needs-review");
  });
});

describe("mapProductStatus", () => {
  const base: Tables<"products"> = {
    id: "p1",
    store_id: "s1",
    name: "Produit",
    category: null,
    price: 10,
    stock: 20,
    status: "active",
    margin_rate: null,
    image_prompt: null,
    created_at: "2026-01-01T00:00:00Z",
  };

  it("marks explicit drafts as draft", () => {
    expect(mapProductStatus({ ...base, status: "draft" })).toBe("draft");
  });

  it("marks low stock (<=5) as low-stock", () => {
    expect(mapProductStatus({ ...base, stock: 5 })).toBe("low-stock");
    expect(mapProductStatus({ ...base, stock: 0 })).toBe("low-stock");
  });

  it("marks healthy stock as active", () => {
    expect(mapProductStatus({ ...base, stock: 6 })).toBe("active");
  });
});

describe("mapCustomerSegment", () => {
  it("normalises FR and EN variants", () => {
    expect(mapCustomerSegment("loyal")).toBe("loyal");
    expect(mapCustomerSegment("fidele")).toBe("loyal");
    expect(mapCustomerSegment("a-risque")).toBe("at-risk");
    expect(mapCustomerSegment("unknown")).toBe("new");
  });
});

describe("mapOrderStatus", () => {
  it("normalises statuses with a processing fallback", () => {
    expect(mapOrderStatus("payee")).toBe("paid");
    expect(mapOrderStatus("expediee")).toBe("shipped");
    expect(mapOrderStatus("retour")).toBe("returned");
    expect(mapOrderStatus("???")).toBe("processing");
  });
});

describe("mapStore", () => {
  it("maps snake_case rows and coerces nulls to empty strings", () => {
    const row: Tables<"stores"> = {
      id: "s1",
      owner_id: null,
      name: "Ma Boutique",
      slug: "ma-boutique",
      subdomain: null,
      status: "published",
      niche: null,
      audience: null,
      visual_style: null,
      conversion_rate: 3.5,
      generated_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
    };
    const store = mapStore(row);
    expect(store).toMatchObject({
      id: "s1",
      name: "Ma Boutique",
      slug: "ma-boutique",
      status: "published",
      subdomain: "",
      niche: "",
      conversionRate: 3.5,
    });
  });
});

describe("mapProduct", () => {
  it("derives status and coerces margin", () => {
    const row: Tables<"products"> = {
      id: "p1",
      store_id: "s1",
      name: "Sérum",
      category: "Soin",
      price: 49,
      stock: 3,
      status: "active",
      margin_rate: null,
      image_prompt: null,
      created_at: "2026-01-01T00:00:00Z",
    };
    const product = mapProduct(row);
    expect(product.status).toBe("low-stock");
    expect(product.marginRate).toBe(0);
    expect(product.category).toBe("Soin");
  });
});

describe("buildMetrics", () => {
  const orders: Order[] = [
    { id: "1", customerName: "A", total: 100, status: "paid", itemsCount: 1, createdAt: "" },
    { id: "2", customerName: "B", total: 50, status: "processing", itemsCount: 2, createdAt: "" },
  ];
  const products: Product[] = [
    { id: "p1", name: "x", category: "", price: 10, stock: 2, status: "low-stock", imagePrompt: "", marginRate: 0 },
    { id: "p2", name: "y", category: "", price: 10, stock: 20, status: "active", imagePrompt: "", marginRate: 0 },
  ];

  it("computes revenue, count and low-stock count", () => {
    const [revenue, count, , stock] = buildMetrics(orders, products);
    expect(revenue.value).toContain("150");
    expect(count.value).toBe("2");
    expect(stock.value).toBe("1 SKU");
    expect(stock.tone).toBe("warning");
  });

  it("handles empty orders without dividing by zero", () => {
    const metrics = buildMetrics([], products);
    expect(metrics[1].value).toBe("0");
  });
});
