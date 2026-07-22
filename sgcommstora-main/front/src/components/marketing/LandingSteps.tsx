import AnimateIn from "./AnimateIn";

const steps = [
  { n: "01", title: "Décrivez votre idée", body: "Niche, style, cible : un message suffit." },
  { n: "02", title: "L'IA construit tout", body: "Design, catalogue et visuels générés en quelques minutes." },
  { n: "03", title: "Vous publiez et vendez", body: "Paiement et hébergement déjà branchés." },
];

// Flux compact en 3 étapes (contre 4 sur la home), pensé pour tenir sur un seul
// écran et ne pas ralentir la descente vers le CTA.
export function LandingSteps() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="shell">
        <AnimateIn className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
            Trois étapes, pas plus.
          </h2>
        </AnimateIn>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          />
          <div data-stagger className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="relative text-center md:text-left">
                <span className="relative z-10 mx-auto flex size-11 items-center justify-center rounded-full border border-line-strong bg-base text-sm text-ink md:mx-0">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-normal text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
