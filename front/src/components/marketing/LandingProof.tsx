import AnimateIn from "./AnimateIn";

const stats = [
  { value: "12 min", label: "pour une boutique complète" },
  { value: "50k+", label: "visuels générés par l'IA" },
  { value: "98 %", label: "lancent sans écrire une ligne de code" },
];

// Une seule citation en avant (au lieu de la grille de 3 témoignages de la home) +
// une bande de chiffres en ligne : format "spotlight", plus rapide à lire qu'une grille.
export function LandingProof() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="shell">
        <AnimateIn>
          <article className="card-dark mx-auto max-w-2xl p-8 text-center sm:p-12">
            <svg viewBox="0 0 40 40" className="mx-auto size-8 text-rose" fill="currentColor" aria-hidden>
              <path d="M16 10c-5 0-9 4-9 9s4 8 8 8c1 0 2 0 2-1s-3-1-3-5 3-5 6-5V10zM34 10c-5 0-9 4-9 9s4 8 8 8c1 0 2 0 2-1s-3-1-3-5 3-5 6-5V10z" opacity="0.85" />
            </svg>
            <p className="mt-6 text-xl leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">
              “J'ai décrit ma marque de cosmétiques un dimanche soir. Lundi matin, la
              boutique et les fiches produits étaient en ligne.”
            </p>
            <div className="mt-6 flex items-center justify-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f4efe8] to-[#cd9089] text-sm font-medium text-[#15120f]">
                CF
              </span>
              <div className="text-left">
                <p className="text-sm font-medium text-ink">Camille Ferrand</p>
                <p className="text-xs text-ink-3">Fondatrice · Maison Brume</p>
              </div>
            </div>
          </article>
        </AnimateIn>

        <div data-stagger className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-light tracking-tight text-ink sm:text-4xl">{stat.value}</div>
              <p className="mt-1 text-xs text-ink-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
