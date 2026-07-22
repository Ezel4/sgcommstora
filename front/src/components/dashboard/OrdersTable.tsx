"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { IconReceipt, IconSearch } from "@/components/dashboard/icons";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { UpgradeTeaser } from "@/components/dashboard/UpgradeTeaser";
import { PageHeader } from "@/components/ui";
import { activeStore } from "@/data/mock-commerce";
import { orderStatus } from "@/lib/commerce-status";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/types/commerce";

type Filter = "all" | Order["status"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "paid", label: "Payées" },
  { value: "processing", label: "En traitement" },
  { value: "shipped", label: "Expédiées" },
  { value: "returned", label: "Retours" },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const metrics = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const avgBasket = total / (orders.length || 1);
    const paid = orders.filter((order) => order.status === "paid").length;
    const processing = orders.filter((order) => order.status === "processing").length;
    const shipped = orders.filter((order) => order.status === "shipped").length;
    const returned = orders.filter((order) => order.status === "returned").length;
    return { count: orders.length, total, avgBasket, paid, processing, shipped, returned };
  }, [orders]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const matchesSearch = !query || `${order.id} ${order.customerName} ${order.createdAt}`.toLocaleLowerCase("fr-FR").includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, orders, search]);

  const counts: Record<Filter, number> = {
    all: metrics.count,
    paid: metrics.paid,
    processing: metrics.processing,
    shipped: metrics.shipped,
    returned: metrics.returned,
  };
  const hasActiveFilters = filter !== "all" || search.trim().length > 0;

  function resetFilters() {
    setFilter("all");
    setSearch("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={activeStore.name}
        title="Commandes"
        description="Consultez rapidement le montant, le statut et les informations essentielles de chaque commande."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs des commandes">
        <MetricCard metric={{ label: "Commandes", value: String(metrics.count), change: `${metrics.processing} en traitement`, tone: "neutral" }} period="Historique" />
        <MetricCard metric={{ label: "Chiffre d’affaires", value: formatCurrency(metrics.total), change: "Sur ces commandes", tone: "positive" }} period="Historique" />
        <MetricCard metric={{ label: "Panier moyen", value: formatCurrency(metrics.avgBasket), change: "Par commande", tone: "positive" }} period="Historique" />
        <MetricCard metric={{ label: "À traiter", value: String(metrics.processing), change: metrics.processing > 0 ? "À préparer" : "File à jour", tone: metrics.processing > 0 ? "warning" : "neutral" }} period="Maintenant" />
      </section>

      <Panel
        title="Historique des commandes"
        description={`${filtered.length} commande${filtered.length > 1 ? "s" : ""} affichée${filtered.length > 1 ? "s" : ""} sur ${orders.length}`}
        bodyClassName="p-0 sm:p-0"
      >
        <div className="grid gap-4 border-b border-line p-5 sm:p-6 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-end">
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-ink-2">Rechercher une commande</span>
            <span className="relative block">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-4" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Numéro, client ou date"
                className="h-11 w-full rounded-2xl border border-line bg-white/55 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-4 focus:border-line-strong focus:bg-white/80"
              />
            </span>
          </label>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink-2">Filtrer par statut</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les commandes par statut">
              {FILTERS.map((item) => (
                <FilterTab key={item.value} label={item.label} count={counts[item.value]} active={filter === item.value} onClick={() => setFilter(item.value)} />
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/60 text-accent-ink"><IconReceipt className="size-5" /></span>
            <h3 className="mt-4 text-lg font-medium text-ink">{orders.length === 0 ? "Aucune commande pour le moment" : "Aucune commande ne correspond"}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-3">
              {orders.length === 0
                ? "Les nouvelles commandes apparaîtront ici dès qu’elles seront enregistrées."
                : "Modifiez la recherche ou réinitialisez les filtres pour retrouver l’historique complet."}
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={resetFilters} className="mt-5 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-forest-700">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] text-left">
                <caption className="sr-only">Liste des commandes de {activeStore.name}</caption>
                <thead className="bg-white/35 text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Commande</th>
                    <th scope="col" className="px-4 py-3.5">Client</th>
                    <th scope="col" className="px-4 py-3.5">Date</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Articles</th>
                    <th scope="col" className="px-4 py-3.5">Statut</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((order) => {
                    const status = orderStatus[order.status];
                    return (
                      <tr key={order.id} className="transition-colors hover:bg-white/35">
                        <th scope="row" className="px-6 py-4 text-sm font-semibold text-ink">{order.id}</th>
                        <td className="px-4 py-4 text-sm font-medium text-ink-2">{order.customerName}</td>
                        <td className="px-4 py-4 text-sm text-ink-3">{order.createdAt}</td>
                        <td className="px-4 py-4 text-right text-sm tabular-nums text-ink-2">{order.itemsCount}</td>
                        <td className="px-4 py-4"><StatusPill tone={status.tone}>{status.label}</StatusPill></td>
                        <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-ink">{formatCurrency(order.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line lg:hidden" aria-label="Liste des commandes">
              {filtered.map((order) => {
                const status = orderStatus[order.status];
                return (
                  <li key={order.id} className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-ink">{order.id}</p>
                        <p className="mt-1 truncate text-sm text-ink-3">{order.customerName}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{formatCurrency(order.total)}</p>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/40 p-4 text-sm">
                      <div><dt className="text-ink-3">Date</dt><dd className="mt-1 font-medium text-ink">{order.createdAt}</dd></div>
                      <div><dt className="text-ink-3">Articles</dt><dd className="mt-1 font-medium tabular-nums text-ink">{order.itemsCount}</dd></div>
                    </dl>
                    <div className="mt-4"><StatusPill tone={status.tone}>{status.label}</StatusPill></div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>

      <UpgradeTeaser
        title="Analyse des commandes avancée"
        description="Les prévisions de réassort, l’historique étendu et l’export des commandes ne sont pas encore activés dans cette version."
      />
    </div>
  );
}
