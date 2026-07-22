import AnimateIn from "./AnimateIn";

// Copy propre à cette page (pas la même accroche que le FinalCta de la home).
export function LandingFinalCta({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative py-12 sm:py-20">
      <div className="shell">
        <AnimateIn>
          <div className="card-dark relative overflow-hidden px-6 py-16 text-center sm:px-10 sm:py-24">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
              style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(31,197,190,0.34), rgba(36,152,200,0.10) 45%, transparent 75%)" }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-xl text-3xl font-light tracking-tight sm:text-5xl sm:leading-[1.06]">
                <span className="text-dusk">Votre boutique peut être</span>
                <br />
                <span className="text-ink-2">en ligne aujourd'hui.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-ink-2">
                Gratuit pour commencer, sans carte bancaire. Aucune compétence technique
                requise.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a href={ctaHref} className="btn btn-light">Commencer gratuitement</a>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
