import { ChatPreview } from "./ChatPreview";
import { Tilt } from "./Tilt";

function TrustCheck() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="rgba(84,184,168,0.5)" strokeWidth="1.2" />
      <path d="M6 10.2 8.6 13 14 7.5" stroke="#54b8a8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Hero de conversion : mise en page en deux colonnes (texte + preuve produit côte à
// côte), fond en glow radial plutôt que la scène crépusculaire de la home — layout,
// accroche et visuel propres à cette page, pas une redite du hero de "/".
export function LandingHero({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="dusk-sky absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-120px] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(205,144,137,0.4), transparent 70%)" }}
        />
      </div>

      <div className="shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="animate-fade-up delay-100 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.06] px-3.5 py-1.5 text-xs text-ink-2">
            Nouveau · création de boutique par IA
          </span>

          <h1 className="animate-fade-up delay-200 mt-6 text-[clamp(1.9rem,4.4vw,3.2rem)] font-light leading-[1.1] tracking-tight">
            <span className="text-dusk">De l'idée à la boutique en ligne,</span>
            <br />
            <span className="text-ink-2">sans agence ni code.</span>
          </h1>

          <p className="animate-fade-up delay-300 mt-6 max-w-lg text-[1rem] leading-relaxed text-ink-2 sm:text-lg">
            Un message suffit. Stora écrit vos fiches produits, génère vos visuels et
            branche paiement, domaine et stockage à votre place.
          </p>

          <div className="animate-fade-up delay-400 mt-8 flex flex-wrap items-center gap-3">
            <a href={ctaHref} className="btn btn-light">Commencer gratuitement</a>
            <a href="#comparatif" className="btn btn-ghost">Voir la différence</a>
          </div>

          <div className="animate-fade-up delay-500 mt-6 flex flex-col gap-2 text-sm text-ink-3">
            <span className="flex items-center gap-1.5">
              <TrustCheck /> Gratuit pour commencer, sans carte bancaire
            </span>
            <span className="flex items-center gap-1.5">
              <TrustCheck /> Boutique en ligne en 2 minutes
            </span>
          </div>
        </div>

        <div className="animate-fade-up delay-400">
          <Tilt max={6}>
            <ChatPreview />
          </Tilt>
        </div>
      </div>
    </section>
  );
}
