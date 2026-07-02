"use client";

import { useMemo, useState } from "react";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { StackedBar } from "@/components/dashboard/charts/StackedBar";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import type { AnalyticsPeriod, analyticsByPeriod } from "@/data/mock-analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

function pct(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function AnalyticsOverview({ data }: { data: typeof analyticsByPeriod }) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const current = data[period];

  const periodTabs = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <FilterTab key={p.value} label={p.label} active={period === p.value} onClick={() => setPeriod(p.value)} />
        ))}
      </div>
    ),
    [period],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Boutique · Atelier Nival</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Statistiques.</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          metric={{
            label: "Visiteurs",
            value: current.summary.visitors.value.toLocaleString("fr-FR"),
            change: `${pct(current.summary.visitors.changePct)} vs période précédente`,
            tone: current.summary.visitors.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          metric={{
            label: "Taux de conversion",
            value: formatPercent(current.summary.conversionRate.value),
            change: `${pct(current.summary.conversionRate.changePct)} vs période précédente`,
            tone: current.summary.conversionRate.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          metric={{
            label: "Chiffre d'affaires",
            value: formatCurrency(current.summary.revenue.value),
            change: `${pct(current.summary.revenue.changePct)} vs période précédente`,
            tone: current.summary.revenue.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          metric={{
            label: "Panier moyen",
            value: formatCurrency(current.summary.averageOrderValue.value),
            change: `${pct(current.summary.averageOrderValue.changePct)} vs période précédente`,
            tone: current.summary.averageOrderValue.changePct >= 0 ? "positive" : "warning",
          }}
        />
      </div>

      <Panel title="Chiffre d'affaires dans le temps" action={periodTabs}>
        <LineChart data={current.series.map((p) => p.revenue)} color="#cd9089" />
      </Panel>

      <Panel title="Visiteurs & sessions" action={periodTabs}>
        <LineChart data={current.series.map((p) => p.visitors)} color="#54b8a8" />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sources de trafic">
          <StackedBar
            segments={current.trafficSources.map((s) => ({
              label: s.channel,
              sessions: s.sessions,
              sharePct: s.sharePct,
              tone: s.tone,
            }))}
          />
        </Panel>

        <Panel title="Top produits par revenu">
          <BarChart
            items={current.topProducts.map((p) => ({ label: p.productName, value: p.revenue }))}
            formatValue={formatCurrency}
          />
        </Panel>
      </div>
    </div>
  );
}
