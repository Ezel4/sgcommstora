import AnimateIn from "./AnimateIn";

const steps = [
  {
    n: "01",
    title: "Décrivez votre idée",
    body: "Un message suffit : niche, style, cible. Stora comprend votre intention et propose une direction de marque.",
  },
  {
    n: "02",
    title: "L'IA construit la boutique",
    body: "Design, structure, palette, premiers produits et fiches optimisées SEO, générés et cohérents en quelques minutes.",
  },
  {
    n: "03",
    title: "Les visuels prennent vie",
    body: "Des images produit photoréalistes sont mises en scène automatiquement, sans studio ni shooting.",
  },
  {
    n: "04",
    title: "Vous lancez et vendez",
    body: "Paiements, domaine et stockage sont déjà branchés. Ajustez par simple message, puis publiez.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment" className="relative py-20 sm:py-32">
      <div className="shell">
        <AnimateIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light tracking-tight sm:text-[2.6rem] sm:leading-[1.08]">
            De l'idée à la première vente, en quatre temps.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-2">
            Aucune compétence technique. Vous parlez, Stora exécute et vous gardez le
            contrôle à chaque étape.
          </p>
        </AnimateIn>

        <div className="relative mt-16">
          {/* ligne de liaison */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent lg:block"
          />

          <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="relative">
                <div className="glass flex size-[68px] items-center justify-center !rounded-2xl text-xl font-normal text-ink">
                  {step.n}
                </div>
                <h3 className="mt-6 text-lg font-normal text-ink">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
