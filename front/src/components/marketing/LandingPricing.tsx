import AnimateIn from "./AnimateIn";

const features = [
  "Génération d'une boutique complète par l'IA",
  "50 clients maximum",
  "10 visuels produit IA / mois",
  "Fiches produits optimisées SEO",
  "Accès CRM restreint",
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(31,197,190,0.55)" strokeWidth="1.2" />
      <path d="M6 10.2 8.6 13 14 7.5" stroke="#1fc5be" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Pricing de conversion : une seule offre visible (le plan gratuit), pas de
// comparatif à 3 colonnes qui fait hésiter — l'objectif ici est l'inscription, pas l'upsell.
export function LandingPricing({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="tarifs" className="relative py-20 sm:py-32">
      <div className="shell">
        <AnimateIn className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
            Commencez gratuitement, sans engagement.
          </h2>
          <p className="mt-5 text-ink-2">
            Le plan Découverte suffit pour lancer une première boutique complète et tester
            Stora sans sortir la carte bancaire.
          </p>
        </AnimateIn>

        <AnimateIn className="mx-auto mt-12 max-w-md">
          <article className="card-dark flex flex-col p-8 ring-1 ring-[rgba(31,197,190,0.38)] shadow-[0_44px_100px_-34px_rgba(31,197,190,0.30)]">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-3">Découverte</span>
            <div className="mt-4 flex items-end gap-1.5">
              <span className="text-5xl font-light tracking-tight text-ink">Gratuit</span>
            </div>
            <p className="mt-3 text-sm text-ink-2">Pour tester et lancer une première boutique.</p>

            <a href={ctaHref} className="btn btn-light mt-7">Commencer gratuitement</a>
            <p className="mt-2.5 text-center text-xs text-ink-3">Sans carte bancaire</p>

            <div className="hairline my-7" />

            <ul className="flex flex-col gap-3.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-ink-2">
                  <Check />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        </AnimateIn>
      </div>
    </section>
  );
}
