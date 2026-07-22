import type { Tone } from "@/components/dashboard/StatusPill";

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface AnalyticsMetric {
  value: number;
  changePct: number;
}

export interface AnalyticsSummary {
  visitors: AnalyticsMetric;
  sessions: AnalyticsMetric;
  conversionRate: AnalyticsMetric;
  revenue: AnalyticsMetric;
  averageOrderValue: AnalyticsMetric;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  revenue: number;
  visitors: number;
  sessions: number;
}

export interface TrafficSource {
  channel: string;
  sessions: number;
  sharePct: number;
  tone: Tone;
}

export interface TopProduct {
  productName: string;
  revenue: number;
  unitsSold: number;
}

interface PeriodAnalytics {
  summary: AnalyticsSummary;
  series: TimeSeriesPoint[];
  trafficSources: TrafficSource[];
  topProducts: TopProduct[];
}

const series7d: TimeSeriesPoint[] = [
  { date: "2026-06-26", label: "26 juin", revenue: 1240, visitors: 410, sessions: 520 },
  { date: "2026-06-27", label: "27 juin", revenue: 1510, visitors: 465, sessions: 588 },
  { date: "2026-06-28", label: "28 juin", revenue: 1330, visitors: 402, sessions: 510 },
  { date: "2026-06-29", label: "29 juin", revenue: 1830, visitors: 528, sessions: 640 },
  { date: "2026-06-30", label: "30 juin", revenue: 1640, visitors: 486, sessions: 601 },
  { date: "2026-07-01", label: "1 juil.", revenue: 2120, visitors: 590, sessions: 712 },
  { date: "2026-07-02", label: "2 juil.", revenue: 2380, visitors: 634, sessions: 758 },
];

const series30d: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 900 + i * 45 + Math.sin(i / 3) * 260;
  const visitors = Math.round(280 + i * 9 + Math.cos(i / 4) * 60);
  return {
    date: `2026-06-${String((i % 30) + 1).padStart(2, "0")}`,
    label: `J-${30 - i}`,
    revenue: Math.round(base),
    visitors,
    sessions: Math.round(visitors * 1.22),
  };
});

const series90d: TimeSeriesPoint[] = Array.from({ length: 12 }, (_, i) => {
  const base = 7200 + i * 620 + Math.sin(i / 2) * 1400;
  const visitors = Math.round(2100 + i * 140 + Math.cos(i / 2) * 380);
  return {
    date: `sem-${i + 1}`,
    label: `Sem. ${i + 1}`,
    revenue: Math.round(base),
    visitors,
    sessions: Math.round(visitors * 1.22),
  };
});

function sumSeries(series: TimeSeriesPoint[]) {
  return series.reduce(
    (acc, p) => {
      acc.revenue += p.revenue;
      acc.visitors += p.visitors;
      acc.sessions += p.sessions;
      return acc;
    },
    { revenue: 0, visitors: 0, sessions: 0 },
  );
}

const trafficSources7d: TrafficSource[] = [
  { channel: "Recherche organique", sessions: 1680, sharePct: 38, tone: "positive" },
  { channel: "Réseaux sociaux", sessions: 1120, sharePct: 25, tone: "info" },
  { channel: "Direct", sessions: 890, sharePct: 20, tone: "neutral" },
  { channel: "Email", sessions: 490, sharePct: 11, tone: "warning" },
  { channel: "Payant", sessions: 260, sharePct: 6, tone: "danger" },
];

const topProducts7d: TopProduct[] = [
  { productName: "Sérum Lumière C15", revenue: 3420, unitsSold: 70 },
  { productName: "Baume Nuit Régénérant", revenue: 2680, unitsSold: 54 },
  { productName: "Huile Sèche Éclat", revenue: 1950, unitsSold: 45 },
  { productName: "Coffret Découverte", revenue: 1410, unitsSold: 22 },
];

function buildSummary(series: TimeSeriesPoint[], changeScale: number): AnalyticsSummary {
  const totals = sumSeries(series);
  const conversionRate = totals.sessions > 0 ? (totals.revenue / 56.5 / totals.sessions) * 100 : 0;
  const aov = totals.revenue / Math.max(1, Math.round(totals.revenue / 56.5));
  return {
    visitors: { value: totals.visitors, changePct: 12.4 * changeScale },
    sessions: { value: totals.sessions, changePct: 9.8 * changeScale },
    conversionRate: { value: Number(conversionRate.toFixed(1)), changePct: 2.1 * changeScale },
    revenue: { value: totals.revenue, changePct: 14.2 * changeScale },
    averageOrderValue: { value: Math.round(aov), changePct: 3.4 * changeScale },
  };
}

export const analyticsByPeriod: Record<AnalyticsPeriod, PeriodAnalytics> = {
  "7d": {
    summary: buildSummary(series7d, 1),
    series: series7d,
    trafficSources: trafficSources7d,
    topProducts: topProducts7d,
  },
  "30d": {
    summary: buildSummary(series30d, 0.6),
    series: series30d,
    trafficSources: trafficSources7d.map((s) => ({ ...s, sessions: s.sessions * 4 })),
    topProducts: topProducts7d.map((p) => ({ ...p, revenue: p.revenue * 4, unitsSold: p.unitsSold * 4 })),
  },
  "90d": {
    summary: buildSummary(series90d, 0.35),
    series: series90d,
    trafficSources: trafficSources7d.map((s) => ({ ...s, sessions: s.sessions * 11 })),
    topProducts: topProducts7d.map((p) => ({ ...p, revenue: p.revenue * 11, unitsSold: p.unitsSold * 11 })),
  },
};
