import AnimateIn from "./AnimateIn";

const without = [
  "Des semaines à choisir un thème et tout configurer",
  "Un shooting photo à plusieurs milliers d'euros",
  "Des fiches produits à rédiger une par une",
  "Un développeur pour brancher paiement et hébergement",
];

const withStora = [
  "Boutique complète générée en quelques minutes",
  "Visuels produit photoréalistes générés par l'IA",
  "Titres et descriptions optimisés SEO, écrits pour vous",
  "Paiement, domaine et stockage déjà branchés",
];

function Cross() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(238,234,228,0.2)" strokeWidth="1.2" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="rgba(238,234,228,0.45)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(31,197,190,0.55)" strokeWidth="1.2" />
      <path d="M6 10.2 8.6 13 14 7.5" stroke="#1fc5be" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Bloc "avant / après" : remplace le carrousel de features de la home par un
// comparatif direct, plus efficace pour convaincre un visiteur venu d'une pub.
export function LandingValueProps() {
  return (
    <section id="comparatif" className="relative py-20 sm:py-28">
      <div className="shell">
        <AnimateIn className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
            Ce qui change quand l'IA construit votre boutique.
          </h2>
        </AnimateIn>

        <div data-stagger className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="card-dark p-7 sm:p-8">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-3">Sans Stora</span>
            <ul className="mt-6 flex flex-col gap-4">
              {without.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-3">
                  <Cross /> {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-dark p-7 ring-1 ring-[rgba(31,197,190,0.38)] sm:p-8">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Avec Stora</span>
            <ul className="mt-6 flex flex-col gap-4">
              {withStora.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <Check /> {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
