"use client";

import { useMemo, useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { IconBox, IconSearch } from "@/components/dashboard/icons";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { UpgradeTeaser } from "@/components/dashboard/UpgradeTeaser";
import { PageHeader } from "@/components/ui";
import { activeStore } from "@/data/mock-commerce";
import { productStatus } from "@/lib/commerce-status";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Product } from "@/types/commerce";

type Filter = "all" | Product["status"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "active", label: "Actifs" },
  { value: "low-stock", label: "Stock faible" },
  { value: "draft", label: "Brouillons" },
];

export function ProductsTable({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const metrics = useMemo(() => {
    const active = products.filter((product) => product.status === "active").length;
    const lowStock = products.filter((product) => product.status === "low-stock").length;
    const draft = products.filter((product) => product.status === "draft").length;
    const avgMargin = products.reduce((sum, product) => sum + product.marginRate, 0) / (products.length || 1);
    return { total: products.length, active, lowStock, draft, avgMargin };
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");
    return products.filter((product) => {
      const matchesFilter = filter === "all" || product.status === filter;
      const matchesSearch = !query || `${product.name} ${product.category}`.toLocaleLowerCase("fr-FR").includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, products, search]);

  const counts: Record<Filter, number> = {
    all: metrics.total,
    active: metrics.active,
    "low-stock": metrics.lowStock,
    draft: metrics.draft,
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
        title="Produits"
        description="Suivez le statut, le stock, la marge et le prix de chaque référence depuis une vue unique."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs du catalogue">
        <MetricCard metric={{ label: "Produits", value: String(metrics.total), change: `${metrics.active} actifs`, tone: "neutral" }} period="Catalogue" />
        <MetricCard metric={{ label: "Stock faible", value: String(metrics.lowStock), change: metrics.lowStock > 0 ? "À surveiller" : "Aucune alerte", tone: metrics.lowStock > 0 ? "warning" : "neutral" }} period="Maintenant" />
        <MetricCard metric={{ label: "Marge moyenne", value: formatPercent(metrics.avgMargin), change: "Toutes catégories", tone: "positive" }} period="Catalogue" />
        <MetricCard metric={{ label: "Catégories", value: String(new Set(products.map((product) => product.category)).size), change: `${metrics.draft} brouillon${metrics.draft > 1 ? "s" : ""}`, tone: "neutral" }} period="Catalogue" />
      </section>

      <Panel
        title="Catalogue"
        description={`${filtered.length} produit${filtered.length > 1 ? "s" : ""} affiché${filtered.length > 1 ? "s" : ""} sur ${products.length}`}
        bodyClassName="p-0 sm:p-0"
      >
        <div className="grid gap-4 border-b border-line p-5 sm:p-6 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-end">
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-medium text-ink-2">Rechercher un produit</span>
            <span className="relative block">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-4" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom ou catégorie"
                className="h-11 w-full rounded-2xl border border-line bg-white/55 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-4 focus:border-line-strong focus:bg-white/80"
              />
            </span>
          </label>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink-2">Filtrer par statut</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les produits par statut">
              {FILTERS.map((item) => (
                <FilterTab key={item.value} label={item.label} count={counts[item.value]} active={filter === item.value} onClick={() => setFilter(item.value)} />
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/60 text-accent-ink"><IconBox className="size-5" /></span>
            <h3 className="mt-4 text-lg font-medium text-ink">{products.length === 0 ? "Le catalogue est vide" : "Aucun produit ne correspond"}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-3">
              {products.length === 0
                ? "Les produits apparaîtront ici dès qu’ils seront disponibles dans la boutique."
                : "Modifiez la recherche ou réinitialisez les filtres pour retrouver l’ensemble du catalogue."}
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
                <caption className="sr-only">Liste des produits de {activeStore.name}</caption>
                <thead className="bg-white/35 text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Produit</th>
                    <th scope="col" className="px-4 py-3.5">Catégorie</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Stock</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Marge</th>
                    <th scope="col" className="px-4 py-3.5">Statut</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Prix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((product) => {
                    const status = productStatus[product.status];
                    return (
                      <tr key={product.id} className="transition-colors hover:bg-white/35">
                        <th scope="row" className="px-6 py-4 font-normal">
                          <div className="flex items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/65 text-sm font-semibold text-accent-ink" aria-hidden>{product.name.slice(0, 1)}</span>
                            <span className="min-w-0">
                              <span className="block max-w-64 truncate text-sm font-semibold text-ink">{product.name}</span>
                              <span className="mt-0.5 block text-xs text-ink-3">{product.id}</span>
                            </span>
                          </div>
                        </th>
                        <td className="px-4 py-4 text-sm text-ink-2">{product.category}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium tabular-nums text-ink">{product.stock}</td>
                        <td className="px-4 py-4 text-right text-sm tabular-nums text-ink-2">{formatPercent(product.marginRate)}</td>
                        <td className="px-4 py-4"><StatusPill tone={status.tone}>{status.label}</StatusPill></td>
                        <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-ink">{product.price > 0 ? formatCurrency(product.price) : "Non défini"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line lg:hidden" aria-label="Liste des produits">
              {filtered.map((product) => {
                const status = productStatus[product.status];
                return (
                  <li key={product.id} className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-ink">{product.name}</p>
                        <p className="mt-1 text-sm text-ink-3">{product.category} · {product.id}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{product.price > 0 ? formatCurrency(product.price) : "Non défini"}</p>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/40 p-4 text-sm">
                      <div><dt className="text-ink-3">Stock</dt><dd className="mt-1 font-medium tabular-nums text-ink">{product.stock}</dd></div>
                      <div><dt className="text-ink-3">Marge</dt><dd className="mt-1 font-medium tabular-nums text-ink">{formatPercent(product.marginRate)}</dd></div>
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
        title="Analyse produit avancée"
        description="Les recommandations de prix, les tendances détaillées et l’export du catalogue ne sont pas encore activés dans cette version."
      />
    </div>
  );
}
