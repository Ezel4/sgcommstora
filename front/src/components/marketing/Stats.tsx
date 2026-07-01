import AnimateIn from "./AnimateIn";

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { value: 12, suffix: " min", label: "pour une boutique complète, prête à vendre" },
  { value: 50, suffix: "k+", label: "visuels produit générés par l'IA" },
  { value: 98, suffix: " %", label: "des fondateurs lancent sans aucun code" },
  { value: 3, suffix: "×", label: "plus vite qu'une création de boutique classique" },
];

export function Stats() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="shell">
        <AnimateIn>
          <div className="card-dark grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-8 sm:p-10">
                <div className="flex items-baseline text-4xl font-light tracking-tight text-ink sm:text-5xl">
                  {stat.prefix}
                  <span data-counter={stat.value} data-counter-decimals={stat.decimals || 0}>
                    0
                  </span>
                  <span className="text-rose">{stat.suffix}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
