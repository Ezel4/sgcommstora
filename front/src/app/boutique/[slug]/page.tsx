import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/commerce";

const CARD_GRADIENTS = [
  "from-[#b8ccc6] to-[#e9eeee]",
  "from-[#a7d7d3] to-[#e9eeee]",
  "from-[#a9cfdf] to-[#edf1f2]",
  "from-[#c4d0cd] to-[#f2f2f2]",
];

const STOCK_BADGE: Record<Product["status"], { label: string; className: string }> = {
  active: { label: "En stock", className: "bg-ink text-white" },
  "low-stock": { label: "Stock limité", className: "bg-accent-soft text-ink" },
  draft: { label: "Bientôt disponible", className: "bg-black/10 text-ink" },
};

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getStoreBySlug(slug);
  if (!data) notFound();
  const { store, products } = data;

  return (
    <div className="min-h-screen bg-base text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-ink text-xs font-medium text-white">
            {store.name.slice(0, 1)}
          </span>
          <span className="text-[1.05rem] font-medium tracking-tight">{store.name}</span>
        </div>
        <a href="#collection" className="rounded-full border border-line-strong bg-white/25 px-4 py-2 text-sm transition hover:bg-white/55">
          Voir la collection
        </a>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:px-8 sm:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-3">{store.niche}</p>
        <h1 className="mt-4 text-4xl font-normal tracking-tight sm:text-5xl">{store.name}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-2 sm:text-[1rem]">{store.audience}</p>
        <p className="mx-auto mt-2 max-w-xl text-xs italic text-ink-3">{store.visualStyle}</p>
      </section>

      <section id="collection" className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-ink-3">La collection</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const badge = STOCK_BADGE[product.status];
            const showPrice = product.status !== "draft" && product.price > 0;
            return (
              <div key={product.id} className="group flex flex-col overflow-hidden rounded-[23px] border border-line bg-surface transition hover:-translate-y-1 hover:shadow-[var(--elevation-3)]">
                <div className={`aspect-square bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`} />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium ${badge.className}`}>{badge.label}</span>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-ink-3">{product.category}</p>
                  <p className="mt-auto text-sm font-medium tabular-nums">{showPrice ? formatCurrency(product.price) : "Bientôt disponible"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8 text-center sm:px-8">
        <p className="text-xs text-ink-3">
          Boutique générée avec{" "}<Link href="/" className="underline underline-offset-2 hover:text-ink">Stora AI</Link>
        </p>
      </footer>
    </div>
  );
}
