"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { productStatus } from "@/lib/commerce-status";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Product } from "@/types/commerce";

type Filter = "all" | Product["status"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "active", label: "Actif" },
  { value: "low-stock", label: "Stock faible" },
  { value: "draft", label: "Brouillon" },
];

export function ProductsTable({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const metrics = useMemo(() => {
    const active = products.filter((p) => p.status === "active").length;
    const lowStock = products.filter((p) => p.status === "low-stock").length;
    const avgMargin =
      products.reduce((sum, p) => sum + p.marginRate, 0) / (products.length || 1);
    return { total: products.length, active, lowStock, avgMargin };
  }, [products]);

  const filtered = filter === "all" ? products : products.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Boutique · Atelier Nival</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Ton catalogue produits.</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard metric={{ label: "Produits", value: String(metrics.total), change: `${metrics.active} actifs`, tone: "neutral" }} />
        <MetricCard metric={{ label: "Stock faible", value: String(metrics.lowStock), change: "à réapprovisionner", tone: metrics.lowStock > 0 ? "warning" : "neutral" }} />
        <MetricCard metric={{ label: "Marge moyenne", value: formatPercent(metrics.avgMargin), change: "toutes catégories", tone: "positive" }} />
        <MetricCard metric={{ label: "Catégories", value: String(new Set(products.map((p) => p.category)).size), change: "dans ta boutique", tone: "neutral" }} />
      </div>

      <Panel
        title={
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <FilterTab key={f.value} label={f.label} active={filter === f.value} onClick={() => setFilter(f.value)} />
            ))}
          </div>
        }
        bodyClassName="p-0"
      >
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun produit dans cette catégorie.</p>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((p) => {
              const ps = productStatus[p.status];
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="truncate text-xs text-ink-3">
                      {p.category} · {p.stock} en stock · marge {p.marginRate}%
                    </p>
                  </div>
                  <StatusPill tone={ps.tone}>{ps.label}</StatusPill>
                  <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                    {p.price > 0 ? formatCurrency(p.price) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
