const brands = [
  "Stripe",
  "OpenAI",
  "Replicate",
  "Vercel",
  "Clerk",
  "Cloudflare",
  "Kive",
  "Resend",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {brands.map((b) => (
        <span
          key={b}
          className="text-lg font-medium tracking-tight text-ink-3 transition-colors hover:text-ink"
        >
          {b}
        </span>
      ))}
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="shell">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-ink-4">
          La stack de confiance qui fait tourner Stora
        </p>
      </div>

      <div className="marquee mt-8" aria-hidden>
        <div className="marquee__track">
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}
