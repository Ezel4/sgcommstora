const chips = ["Boutique", "Produits", "Visuels", "Textes SEO"];

function ToolGlyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function ChatPreview() {
  return (
    <div className="card-dark glass-liquid mx-auto w-full max-w-3xl overflow-hidden p-2.5">
      <div className="rounded-[20px] border border-line bg-base/55 p-6 sm:p-9">
        <div className="flex items-center justify-between">
          <span className="size-7 rounded-lg bg-gradient-to-br from-[#f4efe8] to-[#cd9089]" />
          <button className="flex size-8 items-center justify-center rounded-full border border-line text-ink-2" aria-label="Menu">
            <ToolGlyph d="M4 7h16M4 12h16M4 17h16" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-2xl font-light tracking-tight text-ink sm:text-3xl">
            Bonjour, prêt à vendre ?
          </h3>
          <p className="mt-2 text-sm text-accent sm:text-[1rem]">
            Décrivez votre boutique, Stora s'occupe du reste.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-line bg-white/[0.03] p-4">
          <p data-typewriter className="text-sm text-ink-3">
            Une boutique de cosmétiques naturels, style éditorial crème et vert, pour les
            25-40 ans…
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4 text-ink-3">
              <ToolGlyph d="M12 5v14M5 12h14" />
              <ToolGlyph d="M4 7h16M7 12h10M10 17h4" />
              <ToolGlyph d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </div>
            <button className="flex size-9 items-center justify-center rounded-full bg-pill text-pill-ink" aria-label="Envoyer">
              <ToolGlyph d="M12 19V5M5 12l7-7 7 7" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {chips.map((chip, i) => (
            <span
              key={chip}
              className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] ${
                i === 0 ? "border-line-strong bg-white/[0.06] text-ink" : "border-line text-ink-3"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
