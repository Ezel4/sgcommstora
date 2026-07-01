import AnimateIn from "./AnimateIn";
import { Tilt } from "./Tilt";

type Quote = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  tint: string;
};

const quotes: Quote[] = [
  {
    quote:
      "J'ai décrit ma marque de cosmétiques un dimanche soir. Lundi matin, la boutique et les fiches produits étaient en ligne.",
    name: "Camille Ferrand",
    role: "Fondatrice · Maison Brume",
    initials: "CF",
    tint: "from-[#f4efe8] to-[#cd9089]",
  },
  {
    quote:
      "Les visuels générés ont remplacé un shooting à 2 000 €. Le rendu est bluffant et parfaitement raccord avec mon univers.",
    name: "Yanis Berkane",
    role: "E-commerçant · Atelier Nord",
    initials: "YB",
    tint: "from-[#cd9089] to-[#9d6c58]",
  },
  {
    quote:
      "Je gère trois boutiques depuis un seul endroit. Tout passe par un message, l'IA s'occupe du reste, c'est devenu mon studio.",
    name: "Sofia Marchetti",
    role: "Directrice · Tre Studio",
    initials: "SM",
    tint: "from-[#76916f] to-[#54b8a8]",
  },
];

function Quotes() {
  return (
    <svg viewBox="0 0 40 40" className="size-8 text-rose" fill="currentColor" aria-hidden>
      <path d="M16 10c-5 0-9 4-9 9s4 8 8 8c1 0 2 0 2-1s-3-1-3-5 3-5 6-5V10zM34 10c-5 0-9 4-9 9s4 8 8 8c1 0 2 0 2-1s-3-1-3-5 3-5 6-5V10z" opacity="0.85" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section id="temoignages" className="relative py-20 sm:py-32">
      <div className="shell">
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
            Des marques lancées en un week-end, pas en six mois.
          </h2>
        </AnimateIn>

        <div data-stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q) => (
            <Tilt key={q.name} className="h-full" max={7}>
              <article className="card-dark flex h-full flex-col p-7">
                <Quotes />
                <p className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-ink">
                  “{q.quote}”
                </p>
                <div className="mt-7 flex items-center gap-3.5">
                  <span
                    className={`flex size-11 items-center justify-center rounded-full bg-gradient-to-br ${q.tint} text-sm font-medium text-[#15120f]`}
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{q.name}</p>
                    <p className="text-xs text-ink-3">{q.role}</p>
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
