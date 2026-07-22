import AnimateIn from "./AnimateIn";

export function FinalCta() {
  return (
    <section id="cta" className="relative py-12 sm:py-20">
      <div className="shell">
        <AnimateIn>
          <div className="card-dark relative overflow-hidden px-6 py-16 text-center sm:px-10 sm:py-24">
            {/* lueur crepusculaire */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
              style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(31,197,190,0.34), rgba(36,152,200,0.10) 45%, transparent 75%)" }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-light tracking-tight sm:text-5xl sm:leading-[1.06]">
                <span className="text-dusk">Lancez votre boutique</span>
                <br />
                <span className="text-ink-2">aujourd&apos;hui.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-ink-2">
                Décrivez votre idée, obtenez une boutique complète. Gratuit pour commencer,
                sans carte bancaire.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a href="/login?mode=signup" className="btn btn-light">Commencer gratuitement</a>
                <a href="#tarifs" className="btn btn-ghost">Voir les tarifs</a>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
