import { ChatPreview } from "./ChatPreview";
import { Tilt } from "./Tilt";

function MineralScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="dusk-sky absolute inset-0" />
      <div className="absolute -left-16 top-40 size-64 rounded-full border border-black/5 bg-white/10" />
      <div className="absolute -right-28 top-24 size-96 rounded-full border border-black/5 bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-32 sm:pb-40 sm:pt-44">
      <MineralScene />

      <div className="shell relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="pill animate-fade-up mb-6">Le commerce, réinventé par l’IA</span>
          <h1 className="animate-fade-up delay-100 text-[clamp(2.35rem,6vw,4.8rem)] font-normal leading-[1.02] tracking-[-0.055em]">
            <span className="text-dusk">Votre boutique e-commerce,</span>
            <br />
            <span className="text-ink-2">générée par l&apos;IA.</span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-[1rem] leading-relaxed text-ink-2 sm:text-lg">
            Décrivez votre idée. Stora crée le design, les produits, les visuels et les
            textes : une boutique prête à vendre en quelques minutes.
          </p>

          <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="/login?mode=signup" className="btn btn-light">Commencer gratuitement</a>
            <a href="#fonctionnalites" className="btn btn-ghost gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-black/5">▷</span>
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
