"use client";

import { useState } from "react";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { StackedBar } from "@/components/dashboard/charts/StackedBar";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { PageHeader } from "@/components/ui";
import { activeStore } from "@/data/mock-commerce";
import type { AnalyticsPeriod, analyticsByPeriod } from "@/data/mock-analytics";
import { formatCurrency, formatPercent } from "@/lib/format";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

function formatChange(value: number) {
  const formatted = Math.abs(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${value >= 0 ? "+" : "−"}${formatted} %`;
}

export function AnalyticsOverview({ data }: { data: typeof analyticsByPeriod }) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const current = data[period];
  const periodLabel = PERIODS.find((item) => item.value === period)?.label ?? "Période";
  const labels = current.series.map((point) => point.label);
  const topSource = current.trafficSources.length > 0
    ? current.trafficSources.reduce((best, source) => source.sessions > best.sessions ? source : best)
    : undefined;
  const topProduct = current.topProducts.length > 0
    ? current.topProducts.reduce((best, product) => product.revenue > best.revenue ? product : best)
    : undefined;

  const periodControl = (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choisir la période d’analyse">
      {PERIODS.map((item) => (
        <FilterTab key={item.value} label={item.label} active={period === item.value} onClick={() => setPeriod(item.value)} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={activeStore.name}
        title="Statistiques"
        description="Comprenez l’évolution du chiffre d’affaires, de l’audience et des produits qui contribuent le plus aux résultats."
        actions={periodControl}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink-2"
      >
        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-ink" aria-hidden />
        <p>
          <strong className="font-semibold text-ink">Données illustratives.</strong>{" "}
          Ces indicateurs d’audience proviennent d’un jeu de démonstration. La mesure réelle — visiteurs,
          sources de trafic et conversions — s’affichera ici une fois le suivi analytique connecté à votre boutique.
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Période sélectionnée : {periodLabel}. Chiffre d’affaires {formatCurrency(current.summary.revenue.value)},
        évolution {formatChange(current.summary.revenue.changePct)} par rapport à la période précédente.
      </p>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={`Indicateurs sur ${periodLabel}`}>
        <MetricCard
          period={periodLabel}
          metric={{
            label: "Visiteurs",
            value: current.summary.visitors.value.toLocaleString("fr-FR"),
            change: `${formatChange(current.summary.visitors.changePct)} vs période précédente`,
            tone: current.summary.visitors.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          period={periodLabel}
          metric={{
            label: "Taux de conversion",
            value: formatPercent(current.summary.conversionRate.value),
            change: `${formatChange(current.summary.conversionRate.changePct)} vs période précédente`,
            tone: current.summary.conversionRate.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          period={periodLabel}
          metric={{
            label: "Chiffre d’affaires",
            value: formatCurrency(current.summary.revenue.value),
            change: `${formatChange(current.summary.revenue.changePct)} vs période précédente`,
            tone: current.summary.revenue.changePct >= 0 ? "positive" : "warning",
          }}
        />
        <MetricCard
          period={periodLabel}
          metric={{
            label: "Panier moyen",
            value: formatCurrency(current.summary.averageOrderValue.value),
            change: `${formatChange(current.summary.averageOrderValue.changePct)} vs période précédente`,
            tone: current.summary.averageOrderValue.changePct >= 0 ? "positive" : "warning",
          }}
        />
      </section>

      <Panel
        title="Lecture rapide"
        description={`Les principaux enseignements calculés sur les ${periodLabel.toLocaleLowerCase("fr-FR")}.`}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl bg-white/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">Dynamique commerciale</p>
            <p className="mt-3 text-xl font-semibold tracking-tight text-ink">{formatChange(current.summary.revenue.changePct)}</p>
            <p className="mt-2 text-sm leading-6 text-ink-3">de chiffre d’affaires par rapport à la période précédente.</p>
          </article>
          <article className="rounded-2xl bg-white/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">Premier canal</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-ink">{topSource?.channel ?? "Aucune donnée"}</p>
            <p className="mt-2 text-sm leading-6 text-ink-3">
              {topSource ? `${topSource.sharePct} % des sessions, soit ${topSource.sessions.toLocaleString("fr-FR")}.` : "Les sources de trafic apparaîtront ici."}
            </p>
          </article>
          <article className="rounded-2xl bg-white/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">Produit moteur</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-ink">{topProduct?.productName ?? "Aucune donnée"}</p>
            <p className="mt-2 text-sm leading-6 text-ink-3">
              {topProduct ? `${formatCurrency(topProduct.revenue)} de revenu pour ${topProduct.unitsSold} vente${topProduct.unitsSold > 1 ? "s" : ""}.` : "Les performances produit apparaîtront ici."}
            </p>
          </article>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Chiffre d’affaires"
          description={`Évolution quotidienne sur ${periodLabel.toLocaleLowerCase("fr-FR")}.`}
        >
          <LineChart
            data={current.series.map((point) => point.revenue)}
            labels={labels}
            color="#1fc5be"
            formatValue={formatCurrency}
            ariaLabel={`Évolution du chiffre d’affaires sur ${periodLabel}`}
          />
        </Panel>

        <Panel
          title="Audience"
          description={`${current.summary.visitors.value.toLocaleString("fr-FR")} visiteurs · ${current.summary.sessions.value.toLocaleString("fr-FR")} sessions sur la période.`}
        >
          <LineChart
            data={current.series.map((point) => point.visitors)}
            labels={labels}
            color="#2498c8"
            formatValue={(value) => value.toLocaleString("fr-FR")}
            ariaLabel={`Évolution des visiteurs sur ${periodLabel}`}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sources de trafic" description="Part des sessions attribuée à chaque canal.">
          <StackedBar
            segments={current.trafficSources.map((source) => ({
              label: source.channel,
              sessions: source.sessions,
              sharePct: source.sharePct,
              tone: source.tone,
            }))}
          />
        </Panel>

        <Panel title="Top produits par revenu" description="Classement des références qui contribuent le plus au chiffre d’affaires.">
          <BarChart
            items={current.topProducts.map((product) => ({
              label: product.productName,
              value: product.revenue,
              meta: `${product.unitsSold} vente${product.unitsSold > 1 ? "s" : ""}`,
            }))}
            formatValue={formatCurrency}
            ariaLabel={`Produits les plus performants sur ${periodLabel}`}
          />
        </Panel>
      </div>
    </div>
  );
}
