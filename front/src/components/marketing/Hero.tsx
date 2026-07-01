import { ChatPreview } from "./ChatPreview";
import { Tilt } from "./Tilt";

/**
 * Scène crépusculaire du hero : ciel "dusk" + deux calques d'images réelles
 * (collines au loin + premier plan d'arbres), avec parallaxe douce au scroll.
 * Les images vivent dans /public/image hero :
 *   - image de fond hero.avif       → collines (calque arrière)
 *   - image de superposition.avif   → arbres de premier plan (calque avant)
 * Si un fichier manque, le dégradé .dusk-sky reste visible (dégradation propre).
 */
function DuskScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* ciel crépusculaire (toujours visible, même sans images) */}
      <div className="dusk-sky absolute inset-0" />

      {/* collines : panorama COMPLET en pleine largeur (aucun recadrage — sinon
          object-cover coupe les collines éclairées des côtés et ne garde que la
          vallée sombre du centre). Éclairci pour ressortir sur le thème noir. */}
      <img
        src="/image%20hero/image%20de%20fond%20hero.avif"
        alt=""
        aria-hidden
        draggable={false}
        data-parallax="6"
        className="absolute inset-x-0 bottom-0 w-full select-none"
      />

      {/* premier plan : feuillage, tout en bas, devant les collines */}
      <img
        src="/image%20hero/image%20de%20superposition.avif"
        alt=""
        aria-hidden
        draggable={false}
        data-parallax="14"
        className="absolute inset-x-0 bottom-0 w-full select-none"
      />

      {/* fondu final vers le fond de page pour enchaîner avec la section suivante */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 sm:pt-44 sm:pb-40">
      <DuskScene />

      <div className="shell relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up delay-100 whitespace-nowrap text-[clamp(1.45rem,5.2vw,3.75rem)] font-light leading-[1.08] tracking-tight">
            <span className="text-dusk">Votre boutique e-commerce,</span>
            <br />
            <span className="text-ink-2">générée par l'IA.</span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
            Décrivez votre idée. Stora crée le design, les produits, les visuels et les
            textes, une boutique prête à vendre en quelques minutes.
          </p>

          <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#cta" className="btn btn-light">Commencer gratuitement</a>
            <a href="#fonctionnalites" className="btn btn-ghost gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-white/15">▸</span>
              Voir la démo
            </a>
          </div>
        </div>

        <div className="animate-fade-up delay-500 mt-16 sm:mt-20">
          <Tilt max={6} className="mx-auto w-full max-w-3xl">
            <ChatPreview />
          </Tilt>
        </div>
      </div>
    </section>
  );
}
