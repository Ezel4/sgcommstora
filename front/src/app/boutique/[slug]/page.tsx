import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/commerce";

const CARD_GRADIENTS = [
  "from-[#e7cfc4] to-[#f4e9de]",
  "from-[#d9c9bd] to-[#efe4d8]",
  "from-[#e3d3c2] to-[#f6efe6]",
  "from-[#ddd0c6] to-[#f2e9df]",
];

const STOCK_BADGE: Record<Product["status"], { label: string; className: string }> = {
  active: { label: "En stock", className: "bg-[#2f2a24] text-[#f4efe8]" },
  "low-stock": { label: "Stock limité", className: "bg-[#cd9089] text-[#2f2a24]" },
  draft: { label: "Bientôt disponible", className: "bg-[#2f2a24]/10 text-[#2f2a24]" },
};

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getStoreBySlug(slug);
  if (!data) notFound();

  const { store, products } = data;

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-[#231f1b]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-[#231f1b] text-xs font-medium text-[#f6f1ea]">
            {store.name.slice(0, 1)}
          </span>
          <span className="text-[1.05rem] font-medium tracking-tight">{store.name}</span>
        </div>
        <a
          href="#collection"
          className="rounded-full border border-[#231f1b]/15 px-4 py-2 text-sm transition hover:bg-[#231f1b]/5"
        >
          Voir la collection
        </a>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:px-8 sm:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#231f1b]/50">
          {store.niche}
        </p>
        <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">{store.name}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#231f1b]/65 sm:text-base">
          {store.audience}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs italic text-[#231f1b]/45">{store.visualStyle}</p>
      </section>

      <section id="collection" className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-[#231f1b]/50">
          La collection
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => {
            const badge = STOCK_BADGE[p.status];
            const showPrice = p.status !== "draft" && p.price > 0;
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#231f1b]/10 bg-white/60"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
                />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-[#231f1b]/50">{p.category}</p>
                  <p className="mt-auto text-sm font-medium tabular-nums">
                    {showPrice ? formatCurrency(p.price) : "Bientôt disponible"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[#231f1b]/10 px-6 py-8 text-center sm:px-8">
        <p className="text-xs text-[#231f1b]/45">
          Boutique générée avec{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-[#231f1b]/70">
            Stora AI
          </Link>
        </p>
      </footer>
    </div>
  );
}
