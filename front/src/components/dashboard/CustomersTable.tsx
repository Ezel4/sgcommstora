"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { IconSearch, IconUsers } from "@/components/dashboard/icons";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { UpgradeTeaser } from "@/components/dashboard/UpgradeTeaser";
import { PageHeader } from "@/components/ui";
import { activeStore } from "@/data/mock-commerce";
import { customerSegment } from "@/lib/commerce-status";
import { formatCurrency } from "@/lib/format";
import type { Customer } from "@/types/commerce";

type Filter = "all" | Customer["segment"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "new", label: "Nouveaux" },
  { value: "loyal", label: "Fidèles" },
  { value: "at-risk", label: "À risque" },
];

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const metrics = useMemo(() => {
    const loyal = customers.filter((customer) => customer.segment === "loyal").length;
    const atRisk = customers.filter((customer) => customer.segment === "at-risk").length;
    const newCustomers = customers.filter((customer) => customer.segment === "new").length;
    const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    return { total: customers.length, loyal, atRisk, newCustomers, totalSpent };
  }, [customers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");
    return customers.filter((customer) => {
      const matchesFilter = filter === "all" || customer.segment === filter;
      const matchesSearch = !query || `${customer.name} ${customer.email}`.toLocaleLowerCase("fr-FR").includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [customers, filter, search]);

  const counts: Record<Filter, number> = {
    all: metrics.total,
    new: metrics.newCustomers,
    loyal: metrics.loyal,
    "at-risk": metrics.atRisk,
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
        title="Clients"
        description="Repérez vos clients fidèles, les nouveaux profils et les relations qui méritent votre attention."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs clients">
        <MetricCard metric={{ label: "Clients", value: String(metrics.total), change: `${metrics.newCustomers} nouveau${metrics.newCustomers > 1 ? "x" : ""}`, tone: "neutral" }} period="Base actuelle" />
        <MetricCard metric={{ label: "Fidèles", value: String(metrics.loyal), change: "Achats répétés", tone: "positive" }} period="Base actuelle" />
        <MetricCard metric={{ label: "À risque", value: String(metrics.atRisk), change: metrics.atRisk > 0 ? "À surveiller" : "Aucune alerte", tone: metrics.atRisk > 0 ? "warning" : "neutral" }} period="Maintenant" />
        <MetricCard metric={{ label: "Valeur totale", value: formatCurrency(metrics.totalSpent), change: "Cumul des achats", tone: "positive" }} period="Historique" />
      </section>

      <Panel
        title="Répertoire clients"
        description={`${filtered.length} client${filtered.length > 1 ? "s" : ""} affiché${filtered.length > 1 ? "s" : ""} sur ${customers.length}`}
        bodyClassName="p-0 sm:p-0"
      >
        <div className="grid gap-4 border-b border-line p-5 sm:p-6 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-end">
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-ink-2">Rechercher un client</span>
            <span className="relative block">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-4" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom ou adresse email"
                className="h-11 w-full rounded-2xl border border-line bg-white/55 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-4 focus:border-line-strong focus:bg-white/80"
              />
            </span>
          </label>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink-2">Filtrer par segment</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les clients par segment">
              {FILTERS.map((item) => (
                <FilterTab key={item.value} label={item.label} count={counts[item.value]} active={filter === item.value} onClick={() => setFilter(item.value)} />
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/60 text-accent-ink"><IconUsers className="size-5" /></span>
            <h3 className="mt-4 text-lg font-medium text-ink">{customers.length === 0 ? "Aucun client pour le moment" : "Aucun client ne correspond"}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-3">
              {customers.length === 0
                ? "Les profils clients apparaîtront ici après leurs premières commandes."
                : "Modifiez la recherche ou réinitialisez les filtres pour retrouver l’ensemble des clients."}
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
              <table className="w-full min-w-[700px] text-left">
                <caption className="sr-only">Liste des clients de {activeStore.name}</caption>
                <thead className="bg-white/35 text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Client</th>
                    <th scope="col" className="px-4 py-3.5">Segment</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Commandes</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Montant dépensé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((customer) => {
                    const segment = customerSegment[customer.segment];
                    return (
                      <tr key={customer.id} className="transition-colors hover:bg-white/35">
                        <th scope="row" className="px-6 py-4 font-normal">
                          <div className="flex items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/65 text-sm font-semibold text-accent-ink" aria-hidden>
                              {customer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-ink">{customer.name}</span>
                              <span className="mt-0.5 block truncate text-xs text-ink-3">{customer.email}</span>
                            </span>
                          </div>
                        </th>
                        <td className="px-4 py-4"><StatusPill tone={segment.tone}>{segment.label}</StatusPill></td>
                        <td className="px-4 py-4 text-right text-sm font-medium tabular-nums text-ink-2">{customer.ordersCount}</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-ink">{formatCurrency(customer.totalSpent)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line lg:hidden" aria-label="Liste des clients">
              {filtered.map((customer) => {
                const segment = customerSegment[customer.segment];
                return (
                  <li key={customer.id} className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/65 text-sm font-semibold text-accent-ink" aria-hidden>
                        {customer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-ink">{customer.name}</p>
                        <p className="mt-1 truncate text-sm text-ink-3">{customer.email}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                    <dl className="mt-4 rounded-2xl bg-white/40 p-4 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-ink-3">Commandes</dt>
                        <dd className="font-medium tabular-nums text-ink">{customer.ordersCount}</dd>
                      </div>
                    </dl>
                    <div className="mt-4"><StatusPill tone={segment.tone}>{segment.label}</StatusPill></div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>

      <UpgradeTeaser
        title="Segmentation clients avancée"
        description="Les segments personnalisés, l’historique étendu et l’export clients ne sont pas encore activés dans cette version."
      />
    </div>
  );
}
