import Link from "next/link";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { PageHeader } from "@/components/ui";
import { activeStore, aiTasks, dashboardMetrics, orders, products } from "@/data/mock-commerce";
import { orderStatus, storeStatus } from "@/lib/commerce-status";
import { formatCurrency, formatPercent } from "@/lib/format";

const taskStatus = {
  ready: "Prête à examiner",
  queued: "À planifier",
  draft: "Brouillon",
} as const;

export default function DashboardOverviewPage() {
  const storeState = storeStatus[activeStore.status];
  const canViewStore = process.env.NODE_ENV === "development" || activeStore.status === "published";
  const activeProducts = products.filter((product) => product.status !== "draft");
  const draftProducts = products.filter((product) => product.status === "draft");
  const lowStockProducts = products.filter(
    (product) => product.status === "low-stock" || (product.status !== "draft" && product.stock <= 15),
  );
  const aiSuggestions = aiTasks
    .filter((task) => !task.title.toLocaleLowerCase("fr-FR").includes("stock"))
    .slice(0, 2);

  const kpis = [
    { ...dashboardMetrics[0], period: "30 derniers jours" },
    { ...dashboardMetrics[1], period: "30 derniers jours" },
    { ...dashboardMetrics[2], period: "30 derniers jours" },
    {
      label: "Stock à surveiller",
      value: `${lowStockProducts.length} SKU`,
      change: lowStockProducts.length > 0 ? "À vérifier maintenant" : "Stock maîtrisé",
      tone: lowStockProducts.length > 0 ? "warning" as const : "neutral" as const,
      period: "État actuel",
    },
  ];

  const storeMessage = {
    published: "La boutique est en ligne et accessible à vos clients.",
    "needs-review": "La structure est prête. Vérifiez le contenu et les produits avant la publication.",
    draft: "La boutique est encore en préparation et n’est pas visible publiquement.",
  }[activeStore.status];

  return (
    <div className="space-y-8 pb-4">
      <PageHeader
        eyebrow="Vue d’ensemble"
        title={`Pilotez ${activeStore.name}`}
        description="Retrouvez les indicateurs essentiels, l’état de votre boutique et les prochaines priorités à traiter."
        aside={<StatusPill tone={storeState.tone}>{storeState.label}</StatusPill>}
        actions={
          <>
            <Link href="/dashboard/boutiques" className="btn btn-light min-h-11 text-sm">
              Vérifier la boutique
            </Link>
            {canViewStore && (
              <a
                href={`/boutique/${activeStore.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost min-h-11 text-sm"
              >
                Voir l’aperçu
              </a>
            )}
          </>
        }
      />

      <section aria-labelledby="dashboard-kpis-title">
        <div className="mb-4">
          <h2 id="dashboard-kpis-title" className="text-xl font-medium tracking-tight text-ink">
            Les chiffres à retenir
          </h2>
          <p className="mt-1 text-sm text-ink-3">Une lecture rapide de la période et de son évolution.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((metric) => (
            <article key={metric.label} className="rounded-[23px] bg-surface-2 px-5 py-4">
              <p className="text-sm font-medium text-ink-2">{metric.label}</p>
              <p className="mt-3 font-[Urbanist] text-[2.25rem] font-light leading-none tracking-[-.055em] text-ink">
                {metric.value.replace("EUR", "€")}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs">
                <span className="text-ink-3">{metric.period}</span>
                <span className={metric.tone === "positive" ? "font-semibold text-success" : metric.tone === "warning" ? "font-semibold text-warning" : "font-semibold text-ink-3"}>
                  {metric.change.replace("EUR", "€")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <section aria-labelledby="store-state-title" className="rounded-[22px] bg-surface-2 p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">État de la boutique</p>
                <h2 id="store-state-title" className="mt-2 font-[Urbanist] text-3xl font-light tracking-[-.045em] text-ink">{activeStore.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-3">{storeMessage}</p>
              </div>
              <StatusPill tone={storeState.tone}>{storeState.label}</StatusPill>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-white/45 p-4">
                <dt className="text-xs text-ink-3">Produits actifs</dt>
                <dd className="mt-1 text-xl font-medium text-ink">{activeProducts.length}</dd>
              </div>
              <div className="rounded-2xl bg-white/45 p-4">
                <dt className="text-xs text-ink-3">Brouillons</dt>
                <dd className="mt-1 text-xl font-medium text-ink">{draftProducts.length}</dd>
              </div>
              <div className="rounded-2xl bg-white/45 p-4">
                <dt className="text-xs text-ink-3">Conversion</dt>
                <dd className="mt-1 text-xl font-medium text-ink">{formatPercent(activeStore.conversionRate)}</dd>
              </div>
              <div className="rounded-2xl bg-white/45 p-4">
                <dt className="text-xs text-ink-3">Sous-domaine</dt>
                <dd className="mt-1 truncate text-sm font-medium text-ink">{activeStore.subdomain}</dd>
              </div>
            </dl>

            <Link href="/dashboard/boutiques" className="mt-5 inline-flex min-h-11 items-center rounded-full px-1 text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Consulter les détails de la boutique
            </Link>
          </section>

          <section aria-labelledby="priorities-title" className="rounded-[22px] bg-surface-2 p-6 sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">À traiter ensuite</p>
              <h2 id="priorities-title" className="mt-2 font-[Urbanist] text-3xl font-light tracking-[-.045em] text-ink">Priorités recommandées</h2>
              <p className="mt-2 text-sm leading-6 text-ink-3">Le stock est actionnable maintenant. Les suggestions IA restent informatives tant que l’assistant n’est pas actif.</p>
            </div>

            <div className="mt-5 space-y-3">
              {lowStockProducts.map((product) => (
                <Link key={product.id} href="/dashboard/produits" className="group flex flex-col gap-3 rounded-2xl bg-warning-soft p-4 transition sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-warning">Stock</span>
                    <h3 className="mt-1 text-base font-medium text-ink">{product.name}</h3>
                    <p className="mt-1 text-sm text-ink-3">{product.stock} unités disponibles · vérifier le réassort.</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink">Voir les produits <span aria-hidden>→</span></span>
                </Link>
              ))}

              {aiSuggestions.map((task) => (
                <article key={task.id} className="rounded-2xl bg-white/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent-ink">Suggestion IA</span>
                    <span className="rounded-full border border-line bg-white/60 px-2.5 py-1 text-xs font-medium text-ink-3">{taskStatus[task.status]}</span>
                  </div>
                  <h3 className="mt-2 text-base font-medium text-ink">{task.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-3">{task.description}</p>
                  <p className="mt-3 text-xs font-semibold text-ink-2">Impact estimé : {task.impact}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="recent-orders-title" className="self-start overflow-hidden rounded-[22px] bg-surface-2">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">Activité</p>
              <h2 id="recent-orders-title" className="mt-1 font-[Urbanist] text-2xl font-medium tracking-[-.04em] text-ink">Commandes récentes</h2>
            </div>
            <Link href="/dashboard/commandes" className="rounded-full px-3 py-2 text-sm font-semibold text-ink-2 transition hover:bg-white/55 hover:text-ink">Tout voir</Link>
          </div>
          <div className="divide-y divide-line">
            {orders.map((order) => {
              const status = orderStatus[order.status];
              return (
                <Link key={order.id} href="/dashboard/commandes" className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 transition hover:bg-white/35 sm:px-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink">{order.customerName}</p>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </div>
                    <p className="mt-1 text-xs text-ink-3">{order.id} · {order.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-ink">{formatCurrency(order.total)}</p>
                    <p className="mt-1 text-xs text-ink-3">{order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
