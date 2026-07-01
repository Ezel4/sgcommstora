import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { IconArrowUpRight, IconExternal, IconSparkles } from "@/components/dashboard/icons";
import {
  activeStore,
  aiTasks,
  dashboardMetrics,
  orders,
  products,
} from "@/data/mock-commerce";
import { orderStatus, productStatus, storeStatus } from "@/lib/commerce-status";
import { formatCurrency } from "@/lib/format";

const revenue7d = [9.2, 11.5, 10.1, 13.8, 12.4, 16.2, 18.4];

function Sparkline({ data }: { data: number[] }) {
  const w = 100;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-12 w-full" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(205,144,137,0.35)" />
          <stop offset="1" stopColor="rgba(205,144,137,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark)" />
      <polyline points={line} fill="none" stroke="#cd9089" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardOverviewPage() {
  const ss = storeStatus[activeStore.status];
  const lowStock = products.filter((p) => p.status !== "draft");

  return (
    <div className="space-y-6">
      {/* en-tête */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Bonjour Sigmood 👋</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">
          Voici l'activité de vos boutiques aujourd'hui.
        </h2>
      </div>

      {/* bannière boutique active */}
      <div className="card-dark relative overflow-hidden p-5 sm:p-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#f4efe8] to-[#cd9089] text-lg font-semibold text-[#15120f]">
              {activeStore.name.slice(0, 1)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-medium text-ink">{activeStore.name}</h3>
                <StatusPill tone={ss.tone}>{ss.label}</StatusPill>
              </div>
              <p className="mt-1 max-w-md text-sm text-ink-2">{activeStore.niche}</p>
              <p className="mt-0.5 text-xs text-ink-3">{activeStore.subdomain}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href={`/boutique/${activeStore.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost text-sm"
            >
              <IconExternal className="size-4" /> Aperçu
            </a>
            <Link href="/dashboard/boutiques" className="btn btn-light text-sm">
              <IconSparkles className="size-4" /> Finaliser
            </Link>
          </div>
        </div>
      </div>

      {/* métriques */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardMetrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      {/* contenu principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* CA */}
          <Panel
            title="Chiffre d'affaires"
            action={<span className="text-xs text-ink-3">7 derniers jours</span>}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-light tracking-tight text-ink">18 420 €</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-sage">
                  <IconArrowUpRight className="size-3.5" /> +14,2% vs semaine précédente
                </p>
              </div>
              <div className="w-1/2 max-w-[260px]">
                <Sparkline data={revenue7d} />
              </div>
            </div>
          </Panel>

          {/* commandes récentes */}
          <Panel
            title="Commandes récentes"
            action={
              <Link href="/dashboard/commandes" className="text-xs text-ink-2 transition hover:text-ink">
                Tout voir
              </Link>
            }
            bodyClassName="p-0"
          >
            <div className="divide-y divide-line">
              {orders.map((o) => {
                const os = orderStatus[o.status];
                return (
                  <div key={o.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{o.customerName}</p>
                      <p className="text-xs text-ink-3">
                        {o.id} · {o.itemsCount} article{o.itemsCount > 1 ? "s" : ""} · {o.createdAt}
                      </p>
                    </div>
                    <StatusPill tone={os.tone}>{os.label}</StatusPill>
                    <span className="w-20 text-right text-sm font-medium tabular-nums text-ink">
                      {formatCurrency(o.total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* assistant IA */}
          <Panel
            title={
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <IconSparkles className="size-4 text-rose" /> L'assistant recommande
              </span>
            }
          >
            <div className="space-y-3">
              {aiTasks.map((t) => (
                <div key={t.id} className="rounded-xl border border-line bg-white/[0.02] p-3.5">
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-3">{t.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-accent">{t.impact}</span>
                    <button
                      type="button"
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-ink transition hover:bg-white/[0.12]"
                    >
                      {t.status === "ready" ? "Lancer" : "Voir"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* stock */}
          <Panel
            title="Catalogue"
            action={
              <Link href="/dashboard/produits" className="text-xs text-ink-2 transition hover:text-ink">
                Gérer
              </Link>
            }
            bodyClassName="p-0"
          >
            <div className="divide-y divide-line">
              {lowStock.map((p) => {
                const ps = productStatus[p.status];
                return (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{p.name}</p>
                      <p className="text-xs text-ink-3">{p.stock} en stock</p>
                    </div>
                    <StatusPill tone={ps.tone}>{ps.label}</StatusPill>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
