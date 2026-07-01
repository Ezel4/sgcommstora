"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { orderStatus } from "@/lib/commerce-status";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/types/commerce";

type Filter = "all" | Order["status"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "paid", label: "Payée" },
  { value: "processing", label: "Traitement" },
  { value: "shipped", label: "Expédiée" },
  { value: "returned", label: "Retour" },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const metrics = useMemo(() => {
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    const avgBasket = total / (orders.length || 1);
    const processing = orders.filter((o) => o.status === "processing").length;
    return { count: orders.length, total, avgBasket, processing };
  }, [orders]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Boutique · Atelier Nival</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Toutes tes commandes.</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard metric={{ label: "Commandes", value: String(metrics.count), change: `${metrics.processing} en traitement`, tone: "neutral" }} />
        <MetricCard metric={{ label: "Chiffre d'affaires", value: formatCurrency(metrics.total), change: "sur ces commandes", tone: "positive" }} />
        <MetricCard metric={{ label: "Panier moyen", value: formatCurrency(metrics.avgBasket), change: "par commande", tone: "positive" }} />
        <MetricCard metric={{ label: "En traitement", value: String(metrics.processing), change: "à expédier", tone: metrics.processing > 0 ? "warning" : "neutral" }} />
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
          <p className="px-5 py-10 text-center text-sm text-ink-3">Aucune commande dans cette catégorie.</p>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((o) => {
              const os = orderStatus[o.status];
              return (
                <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{o.customerName}</p>
                    <p className="truncate text-xs text-ink-3">
                      {o.id} · {o.itemsCount} article{o.itemsCount > 1 ? "s" : ""} · {o.createdAt}
                    </p>
                  </div>
                  <StatusPill tone={os.tone}>{os.label}</StatusPill>
                  <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                    {formatCurrency(o.total)}
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
