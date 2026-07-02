"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { UpgradeTeaser } from "@/components/dashboard/UpgradeTeaser";
import { customerSegment } from "@/lib/commerce-status";
import { formatCurrency } from "@/lib/format";
import type { Customer } from "@/types/commerce";

type Filter = "all" | Customer["segment"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "new", label: "Nouveau" },
  { value: "loyal", label: "Fidèle" },
  { value: "at-risk", label: "À risque" },
];

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const metrics = useMemo(() => {
    const loyal = customers.filter((c) => c.segment === "loyal").length;
    const atRisk = customers.filter((c) => c.segment === "at-risk").length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return { total: customers.length, loyal, atRisk, totalSpent };
  }, [customers]);

  const filtered = filter === "all" ? customers : customers.filter((c) => c.segment === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Boutique · Atelier Nival</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Tes clients.</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard metric={{ label: "Clients", value: String(metrics.total), change: `${metrics.loyal} fidèles`, tone: "neutral" }} />
        <MetricCard metric={{ label: "Fidèles", value: String(metrics.loyal), change: "achats répétés", tone: "positive" }} />
        <MetricCard metric={{ label: "À risque", value: String(metrics.atRisk), change: "à relancer", tone: metrics.atRisk > 0 ? "warning" : "neutral" }} />
        <MetricCard metric={{ label: "Valeur totale", value: formatCurrency(metrics.totalSpent), change: "cumul des achats", tone: "positive" }} />
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
          <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun client dans cette catégorie.</p>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((c) => {
              const cs = customerSegment[c.segment];
              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                    <p className="truncate text-xs text-ink-3">
                      {c.email} · {c.ordersCount} commande{c.ordersCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <StatusPill tone={cs.tone}>{cs.label}</StatusPill>
                  <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                    {formatCurrency(c.totalSpent)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <UpgradeTeaser />
    </div>
  );
}
