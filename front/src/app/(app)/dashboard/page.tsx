import Link from "next/link";
import { activeStore, aiTasks, orders, products } from "@/data/mock-commerce";
import { formatCurrency } from "@/lib/format";

const metrics = [
  { label: "Chiffre d’affaires", value: "18 420", unit: "€" },
  { label: "Commandes confirmées", value: "326", unit: "ventes" },
  { label: "Taux de conversion", value: "3,8", unit: "%" },
  { label: "Panier moyen", value: "56,50", unit: "€" },
  { label: "Produits actifs", value: String(products.filter((p) => p.status !== "draft").length), unit: "SKU" },
];

function RevenueWave() {
  return (
    <svg viewBox="0 0 760 86" preserveAspectRatio="none" className="h-[74px] w-full" aria-label="Évolution du chiffre d’affaires">
      <path d="M0 60 C55 52 72 70 125 58 S210 22 270 42 S365 67 425 34 S520 15 575 37 S680 54 760 18" fill="none" stroke="rgba(255,255,255,.82)" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 60 C55 52 72 70 125 58 S210 22 270 42 S365 67 425 34 S520 15 575 37 S680 54 760 18 L760 86 L0 86Z" fill="rgba(255,255,255,.08)" />
      <line x1="0" y1="72" x2="760" y2="72" stroke="rgba(255,255,255,.20)" />
    </svg>
  );
}

export default function DashboardOverviewPage() {
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="pb-2">
      <div className="grid gap-7 px-1 pb-4 pt-3 sm:px-5 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14">
        <div>
          <p className="mb-2 text-xs text-ink-3">Performance</p>
          <h1 className="max-w-3xl text-[clamp(2rem,4vw,3rem)] font-normal tracking-[-0.055em] text-ink">
            Pilotez {activeStore.name}
          </h1>
        </div>
        <dl className="grid grid-cols-2 gap-x-7 gap-y-3 text-[10px] text-ink-3 sm:grid-cols-4 sm:gap-x-9">
          <div><dt>Boutique</dt><dd className="mt-0.5 text-xs font-medium text-ink">{activeStore.name}</dd></div>
          <div><dt>Conversion</dt><dd className="mt-0.5 text-xs font-medium text-ink">{activeStore.conversionRate}%</dd></div>
          <div><dt>Statut</dt><dd className="mt-0.5 text-xs font-medium text-ink">À finaliser</dd></div>
          <div><dt>Domaine</dt><dd className="mt-0.5 max-w-32 truncate text-xs font-medium text-ink">{activeStore.subdomain}</dd></div>
        </dl>
      </div>

      <nav className="flex gap-8 overflow-x-auto border-b border-line px-1 sm:gap-12 sm:px-5 lg:px-14">
        <Link href="/dashboard" className="whitespace-nowrap border-b-2 border-ink pb-3 text-base text-ink sm:text-xl">Vue d’ensemble</Link>
        <Link href="/dashboard/statistiques" className="whitespace-nowrap pb-3 text-base text-ink-3 transition hover:text-ink sm:text-xl">Statistiques</Link>
        <Link href="/dashboard/assistant" className="whitespace-nowrap pb-3 text-base text-ink-3 transition hover:text-ink sm:text-xl">Insights IA</Link>
      </nav>

      <section className="grid grid-cols-2 gap-[3px] py-4 sm:grid-cols-3 lg:grid-cols-5 lg:pl-14" aria-label="Indicateurs clés">
        {metrics.map((metric) => (
          <article key={metric.label} className="min-h-[106px] rounded-[23px] bg-surface px-5 py-4 sm:px-6">
            <p className="min-h-8 max-w-36 text-[11px] leading-snug text-ink-3">{metric.label}</p>
            <p className="mt-1 whitespace-nowrap font-[Manrope] text-[clamp(1.55rem,2.4vw,2rem)] font-normal tracking-[-0.05em] text-ink">
              {metric.value}<span className="ml-1.5 text-xs tracking-normal text-ink-3">{metric.unit}</span>
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[345px_minmax(0,1fr)] lg:pl-14">
        <div className="flex flex-col gap-3">
          <article className="flex min-h-[76px] items-center gap-2 rounded-[22px] bg-[#efefef] p-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f8f8f8] px-3 py-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#82a99e] to-[#1fc5be] text-xs font-semibold text-white">AN</span>
              <span className="min-w-0"><strong className="block truncate text-xs font-medium">{activeStore.name}</strong><small className="block truncate text-[10px] text-ink-3">Boutique active</small></span>
            </div>
            <span className="text-xs text-ink-3">→</span>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f8f8f8] px-3 py-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#1fc5be] to-[#2498c8] text-xs font-semibold text-white">IA</span>
              <span className="min-w-0"><strong className="block truncate text-xs font-medium">Stora AI</strong><small className="block truncate text-[10px] text-ink-3">Copilote commerce</small></span>
            </div>
          </article>

          <article className="rounded-[22px] bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-normal tracking-tight">Collections <span className="text-ink-3">({categories.length})</span></h2>
              <Link href="/dashboard/produits" aria-label="Filtrer les collections" className="grid size-7 place-items-center rounded-full bg-white/65 text-xs text-ink-3">⌁</Link>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => <span key={category} className="rounded-full border border-line-strong px-3.5 py-2 text-[11px] text-ink-2">{category}</span>)}
            </div>

            <h3 className="mb-3 text-xl font-normal tracking-tight">Actions IA <span className="text-ink-3">({aiTasks.length})</span></h3>
            <div className="space-y-2">
              {aiTasks.slice(0, 3).map((task) => (
                <Link key={task.id} href="/dashboard/assistant" className="flex items-center justify-between gap-3 rounded-full border border-line-strong px-3.5 py-2.5 text-[11px] transition hover:bg-white/45">
                  <span className="truncate">{task.title}</span><span className="shrink-0 text-ink-3">•••</span>
                </Link>
              ))}
            </div>
          </article>
        </div>

        <article className="relative min-h-[430px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_12%_18%,rgba(145,177,153,.9),transparent_38%),radial-gradient(circle_at_88%_22%,rgba(29,207,193,.95),transparent_42%),radial-gradient(circle_at_88%_88%,rgba(26,151,205,.92),transparent_46%),linear-gradient(135deg,#8aa398,#1bbfbd_58%,#238fc7)] p-5 text-white sm:p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
              <h2 className="font-[Manrope] text-xl font-normal tracking-tight text-white sm:text-2xl">Performance de la boutique</h2>
              <Link href="/dashboard/statistiques" className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-sm">Voir le rapport</Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 text-xs text-white/85">
              <span>Chiffre d’affaires</span><span>● <strong className="font-medium text-white">18 420 €</strong></span><span>● +14,2%</span><span>● 7 derniers jours</span>
            </div>
            <div className="mt-2"><RevenueWave /></div>

            <h3 className="mb-3 mt-1 font-[Manrope] text-xl font-normal tracking-tight text-white sm:text-2xl">Commandes récentes</h3>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
              {orders.slice(0, 4).map((order, index) => (
                <Link href="/dashboard/commandes" key={order.id} className="grid min-h-[58px] grid-cols-[38px_1fr_auto] items-center gap-3 border-b border-white/10 px-3 last:border-0 hover:bg-white/[0.07] sm:grid-cols-[40px_140px_1fr_auto]">
                  <span className="grid size-8 place-items-center rounded-full bg-white/15 text-[10px] font-medium">{order.customerName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                  <span><strong className="block text-xs font-medium text-white">{order.customerName}</strong><small className="block text-[9px] text-white/60">{order.createdAt}</small></span>
                  <span className="hidden truncate text-[11px] text-white/80 sm:block">{order.id} · {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}</span>
                  <strong className="text-xs font-medium text-white">{formatCurrency(order.total)}</strong>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
