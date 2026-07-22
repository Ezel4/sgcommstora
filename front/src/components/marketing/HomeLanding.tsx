import { LogoMark } from "./Logo";
import { Navbar } from "./Navbar";

const benefits = [
  {
    eyebrow: "Création guidée",
    title: "Une marque cohérente dès le premier prompt",
    body: "Décrivez votre niche, votre cible et l’univers souhaité. Sigmood IA transforme votre idée en identité, palette et boutique complète.",
    metric: "1 prompt",
    metricLabel: "pour poser les fondations",
  },
  {
    eyebrow: "Catalogue intelligent",
    title: "Des fiches produit pensées pour convertir",
    body: "Titres, descriptions, catégories et balises SEO avancent ensemble, dans le ton exact de votre marque.",
    metric: "SEO inclus",
    metricLabel: "sur chaque fiche générée",
  },
  {
    eyebrow: "Studio visuel IA",
    title: "Des visuels prêts pour votre boutique",
    body: "Créez des images produit cohérentes et photoréalistes, sans organiser de shooting ni multiplier les outils.",
    metric: "24 h / 24",
    metricLabel: "un studio toujours disponible",
  },
];

const steps = [
  {
    n: "01",
    title: "Décrivez votre idée",
    body: "Partagez votre niche, votre cible et quelques références. Un message suffit pour commencer.",
  },
  {
    n: "02",
    title: "Sigmood construit",
    body: "Structure, identité, catalogue et premiers contenus sont générés dans une direction cohérente.",
  },
  {
    n: "03",
    title: "Ajustez en discutant",
    body: "Demandez une nouvelle ambiance, réécrivez une fiche ou modifiez un visuel sans toucher au code.",
  },
  {
    n: "04",
    title: "Publiez et pilotez",
    body: "Connectez vos paiements, mettez la boutique en ligne et suivez les prochaines actions depuis un seul espace.",
  },
];

const plans = [
  {
    name: "Découverte",
    price: "Gratuit",
    tagline: "Pour transformer une première idée en boutique.",
    features: ["1 boutique", "Génération IA complète", "10 visuels IA / mois", "Tableau de bord essentiel"],
    cta: "Commencer gratuitement",
  },
  {
    name: "Pro",
    price: "39,99 €",
    period: "/ mois",
    tagline: "Pour lancer vite et faire grandir votre marque.",
    features: ["5 boutiques", "Clients illimités", "200 visuels IA / mois", "CRM et analytics avancés"],
    cta: "Essayer Pro",
    featured: true,
  },
  {
    name: "Advanced",
    price: "199,99 €",
    period: "/ mois",
    tagline: "Pour piloter plusieurs marques sans limite.",
    features: ["Boutiques illimitées", "Visuels IA illimités", "CRM complet avec export", "Support prioritaire sous 24 h"],
    cta: "Choisir Advanced",
  },
];

const faqs = [
  ["Faut-il savoir coder pour utiliser Sigmood IA ?", "Non. Vous décrivez votre projet en langage naturel et Sigmood IA construit la boutique. Chaque élément reste aussi modifiable manuellement."],
  ["Combien de temps faut-il pour créer une boutique ?", "Quelques minutes suffisent pour générer une première version complète. Vous pouvez ensuite l’affiner autant que nécessaire avant de publier."],
  ["Puis-je gérer plusieurs boutiques ?", "Oui. Les offres Pro et Advanced permettent de centraliser plusieurs boutiques dans un seul tableau de bord."],
  ["Comment les visuels produit sont-ils générés ?", "Sigmood IA utilise des modèles de génération d’images pour créer des visuels photoréalistes adaptés à votre identité de marque."],
  ["Les textes sont-ils optimisés pour le SEO ?", "Oui. Les titres, descriptions et métadonnées sont structurés pour le référencement et restent entièrement éditables."],
  ["Puis-je modifier les propositions de l’IA ?", "Toujours. Vous gardez le contrôle et pouvez demander une modification par conversation ou intervenir directement dans l’interface."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="m4.5 10.5 3.2 3.2 7.8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex h-full flex-col justify-end gap-3 p-5 sm:p-6" aria-hidden>
        <div className="ml-auto max-w-[86%] rounded-[20px] rounded-br-md bg-black px-4 py-3 text-xs leading-relaxed text-white">
          Crée une marque de soins minimaliste, naturelle et premium.
        </div>
        <div className="max-w-[88%] rounded-[20px] rounded-bl-md bg-white/65 p-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.12em] text-ink-3">
            <span className="size-2 rounded-full bg-accent" /> Direction proposée
          </div>
          <div className="flex gap-2">
            <span className="h-8 flex-1 rounded-full bg-[#111]" />
            <span className="h-8 flex-1 rounded-full bg-[#82a99e]" />
            <span className="h-8 flex-1 rounded-full bg-[#1fc5be]" />
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="grid h-full grid-cols-3 items-end gap-2 p-5 sm:p-6" aria-hidden>
        <div className="translate-y-4 rounded-[18px] bg-white/70 p-2">
          <div className="aspect-[4/5] rounded-[13px] bg-gradient-to-br from-[#cfd7d3] to-[#76a297]" />
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-black/20" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-black/10" />
        </div>
        <div className="rounded-[18px] bg-white p-2">
          <div className="aspect-[4/5] rounded-[13px] bg-gradient-to-br from-[#8eddd8] via-[#1fc5be] to-[#2498c8]" />
          <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-black/25" />
          <span className="mt-1.5 block h-1.5 w-2/5 rounded-full bg-black/10" />
        </div>
        <div className="translate-y-7 rounded-[18px] bg-white/70 p-2">
          <div className="aspect-[4/5] rounded-[13px] bg-gradient-to-br from-[#d7d4cb] to-[#91a9a2]" />
          <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-black/20" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-black/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[1.15fr_.85fr] gap-2 p-5 sm:p-6" aria-hidden>
      <div className="relative overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.75),transparent_18%),linear-gradient(135deg,#82a99e,#1fc5be_55%,#2498c8)]">
        <div className="absolute inset-x-[24%] bottom-[12%] top-[20%] rounded-[45%_45%_28%_28%] bg-white/25 backdrop-blur-sm" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-[9px] font-medium text-black">Visuel principal</span>
      </div>
      <div className="grid gap-2">
        <div className="rounded-[18px] bg-gradient-to-br from-[#d9dfdc] to-[#7ba79c]" />
        <div className="rounded-[18px] bg-gradient-to-br from-[#7ca89d] to-[#247fa6]" />
      </div>
    </div>
  );
}

function DashboardShowcase() {
  const metrics = [
    ["Chiffre d’affaires", "18 420 €"],
    ["Commandes", "326"],
    ["Conversion", "3,8 %"],
    ["Panier moyen", "56,50 €"],
    ["Produits", "24"],
  ];

  return (
    <figure role="img" aria-label="Aperçu du tableau de bord de la boutique Atelier Nival" className="relative mx-auto mt-16 max-w-[1240px] px-4 sm:px-7">
      <div className="absolute -inset-x-8 top-20 h-4/5 rounded-full bg-[radial-gradient(circle,rgba(31,197,190,.2),transparent_68%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[24px] bg-surface-2 p-1.5 sm:rounded-[32px] sm:p-3">
        <div className="grid overflow-hidden rounded-[19px] bg-base sm:rounded-[23px] lg:grid-cols-[58px_1fr]">
          <aside className="hidden flex-col items-center gap-3 border-r border-black/5 bg-surface-2 py-5 lg:flex" aria-hidden>
            <LogoMark className="mb-7 size-6" />
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <span key={item} className={`grid size-8 place-items-center rounded-full ${item === 0 ? "bg-black" : "bg-white/45"}`}>
                <i className={`size-2 rounded-full ${item === 0 ? "bg-white" : "bg-black/25"}`} />
              </span>
            ))}
          </aside>

          <div className="min-w-0">
            <div className="flex h-14 items-center justify-between border-b border-black/5 px-4 sm:px-6">
              <div className="flex items-center gap-3 text-xs"><strong>Sigmood IA</strong><span className="text-ink-3">Commerce Hub</span></div>
              <div className="hidden rounded-full bg-black p-1 text-[10px] text-white/65 md:flex">
                <span className="rounded-full bg-white px-4 py-2 font-medium text-black">Créer</span>
                <span className="px-4 py-2">Produits</span>
                <span className="px-4 py-2">Commandes</span>
                <span className="px-4 py-2">Clients</span>
              </div>
              <span className="brand-gradient size-8 rounded-full" aria-hidden />
            </div>

            <div className="px-3 pb-4 sm:px-6 sm:pb-6 lg:px-10">
              <div className="flex flex-col justify-between gap-5 border-b border-black/10 py-6 md:flex-row md:items-end md:py-7">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[.14em] text-ink-3">Vue d’ensemble</p>
                  <h3 className="mt-2 font-[Urbanist] text-3xl font-light tracking-[-.05em] sm:text-4xl">Atelier Nival</h3>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] text-ink-3">
                  <span>Conversion<strong className="mt-1 block text-xs text-ink">3,8 %</strong></span>
                  <span>Progression<strong className="mt-1 block text-xs text-ink">+14,2 %</strong></span>
                  <span>Statut<strong className="mt-1 block text-xs text-ink">En ligne</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 py-4 sm:grid-cols-3 lg:grid-cols-5">
                {metrics.map(([label, value], index) => (
                  <div key={label} className={`rounded-[17px] bg-cream-muted p-3.5 sm:rounded-[20px] sm:p-4 ${index === 4 ? "hidden sm:block" : ""}`}>
                    <p className="min-h-7 text-[11px] leading-tight text-ink-3">{label}</p>
                    <strong className="font-[Urbanist] text-xl font-light tracking-tight sm:text-2xl">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="grid gap-2.5 lg:grid-cols-[290px_1fr]">
                <div className="rounded-[20px] bg-cream-muted p-5 sm:rounded-[22px]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-[Urbanist] text-xl">Actions IA</h4>
                    <span className="rounded-full bg-black px-2.5 py-1 text-[9px] text-white">3 nouvelles</span>
                  </div>
                  <div className="mt-5 space-y-2">
                    {["Optimiser la fiche Sérum", "Créer 3 visuels publicitaires", "Anticiper le stock faible"].map((item) => (
                      <div key={item} className="flex items-center justify-between gap-3 rounded-full border border-black/10 px-3 py-2.5 text-[11px]">
                        <span>{item}</span><span aria-hidden>→</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_10%_20%,#4f8278,transparent_38%),radial-gradient(circle_at_85%_25%,#087f82,transparent_42%),linear-gradient(135deg,#3f716a,#155f7a)] p-5 text-white sm:rounded-[22px]">
                  <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                    <h4 className="font-[Urbanist] text-lg text-white sm:text-xl">Performance de la boutique</h4>
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[9px]">7 jours</span>
                  </div>
                  <svg viewBox="0 0 600 95" preserveAspectRatio="none" className="mt-4 h-24 w-full" aria-hidden>
                    <path d="M0 72 C60 50 85 82 145 58 S230 21 300 45 S390 69 448 35 S535 46 600 16" fill="none" stroke="rgba(255,255,255,.88)" strokeWidth="2" />
                    <path d="M0 72 C60 50 85 82 145 58 S230 21 300 45 S390 69 448 35 S535 46 600 16 L600 95 L0 95Z" fill="rgba(255,255,255,.08)" />
                  </svg>
                  <div className="grid grid-cols-3 gap-2 text-[9px] text-white/70">
                    <span>CA<br /><strong className="text-sm font-medium text-white">18 420 €</strong></span>
                    <span>Progression<br /><strong className="text-sm font-medium text-white">+14,2 %</strong></span>
                    <span>Commandes<br /><strong className="text-sm font-medium text-white">326</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function HomeLanding() {
  return (
    <>
      <a href="#contenu-principal" className="sr-only left-4 top-4 z-[60] rounded-full bg-black px-4 py-3 text-sm font-medium text-white focus:fixed focus:not-sr-only">Aller au contenu</a>
      <div className="grain min-h-screen overflow-hidden bg-base text-ink">
      <Navbar />
      <main id="contenu-principal">

      <section id="top" className="relative pb-20 pt-32 sm:pt-40 lg:pt-44">
        <div className="pointer-events-none absolute left-1/2 top-12 size-[min(780px,95vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(31,197,190,.17),transparent_66%)] blur-2xl" />
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-white/35 px-3.5 py-2 text-xs font-medium uppercase tracking-[.16em] text-ink-3 sm:mb-10">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Le commerce, réinventé par l’IA
          </div>

          <h1 className="mx-auto max-w-[1380px] text-center font-[Urbanist] text-[clamp(1.45rem,6.6vw,7.35rem)] font-light leading-[.9] tracking-[-.075em]">
            <span className="inline-block whitespace-nowrap">Votre boutique e‑commerce,</span>
            <span className="mt-2 block bg-gradient-to-r from-[#486f65] via-[#147976] to-[#176b8b] bg-clip-text text-transparent sm:mt-3">générée par l’IA.</span>
          </h1>

          <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center gap-7 text-center sm:mt-11">
            <p className="text-base leading-relaxed text-ink-2 sm:text-xl">
              Décrivez votre idée. Sigmood IA crée le design, le catalogue, les visuels et les textes pour lancer une boutique prête à vendre.
            </p>
            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <a href="/login?mode=signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black/80">
                Commencer gratuitement <ArrowIcon />
              </a>
              <a href="#produit" className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 bg-white/30 px-6 py-3 text-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/65">
                Découvrir Sigmood IA
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-3">
              {["Sans carte bancaire", "Aucun code", "Modifiable à tout moment"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5"><CheckIcon />{item}</span>
              ))}
            </div>
          </div>
        </div>

        <DashboardShowcase />
      </section>

      <section aria-label="Les avantages de Sigmood IA" className="border-y border-black/[0.08] bg-white/15">
        <div className="mx-auto grid max-w-[1200px] divide-y divide-black/[0.08] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            ["Quelques minutes", "pour obtenir une première boutique"],
            ["Une seule interface", "du prompt jusqu’aux commandes"],
            ["Contrôle total", "sur chaque texte et chaque visuel"],
          ].map(([title, body]) => (
            <div key={title} className="px-3 py-7 text-center sm:px-6 sm:py-9">
              <strong className="font-[Urbanist] text-xl font-medium tracking-[-.03em]">{title}</strong>
              <p className="mt-1 text-xs text-ink-3">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="produit" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="max-w-5xl text-left">
            <p className="mb-8 text-xs font-medium uppercase tracking-[.18em] text-ink-3">Tout ce qu’il faut pour lancer</p>
            <div>
              <h2 className="max-w-4xl font-[Urbanist] text-[clamp(2.7rem,5.6vw,5.9rem)] font-light leading-[.94] tracking-[-.065em]">
                Une seule IA pour concevoir, remplir et lancer votre boutique.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
                Votre identité, votre catalogue et vos visuels sont conçus ensemble. Le résultat est plus rapide, plus cohérent et plus simple à faire évoluer.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-3 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <article key={benefit.title} className="group overflow-hidden rounded-[26px] bg-cream-muted p-2 transition duration-500 hover:-translate-y-1">
                <div className="h-[245px] overflow-hidden rounded-[20px] bg-surface-2 sm:h-[280px]">
                  <ProductVisual index={index} />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-[.16em] text-ink-3">{benefit.eyebrow}</p>
                  <h3 className="mt-4 text-2xl font-normal leading-tight tracking-[-.04em]">{benefit.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-2">{benefit.body}</p>
                  <div className="mt-8 border-t border-black/[0.08] pt-4">
                    <strong className="font-[Urbanist] text-2xl font-medium tracking-[-.04em]">{benefit.metric}</strong>
                    <span className="ml-2 text-xs text-ink-3">{benefit.metricLabel}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="methode" className="scroll-mt-24 border-y border-black/[0.08] bg-white/15 py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[.18em] text-ink-3">Comment ça marche</p>
            <h2 className="mt-6 font-[Urbanist] text-[clamp(2.8rem,5.8vw,6rem)] font-light leading-[.94] tracking-[-.065em]">De l’idée à la première vente, sans détour.</h2>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ink-2">Vous donnez la direction. Sigmood IA exécute et vous gardez le contrôle à chaque étape.</p>
          </div>

          <div className="mt-16 grid overflow-hidden rounded-[28px] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.n} className={`flex min-h-[330px] flex-col border-black/[0.08] p-7 sm:p-8 ${index === 2 ? "bg-gradient-to-br from-[#3f716a] via-[#087f82] to-[#155f7a] text-white" : "bg-cream-muted"} [&:not(:last-child)]:border-b sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-b-0`}>
                <span className={`grid size-10 place-items-center rounded-full text-xs ${index === 2 ? "bg-white text-black" : "bg-black text-white"}`}>{step.n}</span>
                <div className="mt-auto pt-16">
                  <h3 className={`text-2xl font-normal leading-tight ${index === 2 ? "text-white" : "text-ink"}`}>{step.title}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${index === 2 ? "text-white/80" : "text-ink-2"}`}>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[.18em] text-ink-3">Des offres qui grandissent avec vous</p>
            <h2 className="mt-6 font-[Urbanist] text-[clamp(2.8rem,5.8vw,6rem)] font-light leading-[.94] tracking-[-.065em]">Commencez simplement. Évoluez librement.</h2>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ink-2">Testez sans carte bancaire, puis choisissez l’offre adaptée à votre activité.</p>
          </div>

          <div className="mt-16 grid gap-3 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`relative flex min-h-[470px] flex-col overflow-hidden rounded-[28px] p-7 sm:p-9 ${plan.featured ? "bg-gradient-to-br from-[#3f716a] via-[#087f82] to-[#155f7a] text-white" : "bg-surface-2"}`}>
                {plan.featured && <span className="absolute right-6 top-6 rounded-full bg-white/18 px-3 py-1 text-xs font-medium text-white">Le plus choisi</span>}
                <p className={`text-xs font-medium uppercase tracking-[.16em] ${plan.featured ? "text-white/70" : "text-ink-3"}`}>{plan.name}</p>
                <p className={`mt-7 font-[Urbanist] text-[clamp(2.8rem,4.4vw,4.6rem)] font-light leading-none tracking-[-.065em] ${plan.featured ? "text-white" : "text-ink"}`}>
                  {plan.price}{plan.period && <span className={`ml-2 text-sm tracking-normal ${plan.featured ? "text-white/70" : "text-ink-3"}`}>{plan.period}</span>}
                </p>
                <p className={`mt-5 min-h-12 max-w-sm text-sm leading-relaxed ${plan.featured ? "text-white/80" : "text-ink-2"}`}>{plan.tagline}</p>
                <ul className={`mt-8 space-y-3 border-t pt-7 text-sm ${plan.featured ? "border-white/20 text-white/85" : "border-black/[0.08] text-ink-2"}`}>
                  {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2.5"><CheckIcon />{feature}</li>)}
                </ul>
                <a href="/login?mode=signup" className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${plan.featured ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/80"}`}>
                  {plan.cta} <ArrowIcon />
                </a>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink-3">Tarifs mensuels · Sans engagement · Vous pouvez changer d’offre à tout moment</p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-black/[0.08] bg-white/15 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.18em] text-ink-3">Questions fréquentes</p>
            <h2 className="mt-5 font-[Urbanist] text-[clamp(2.8rem,5vw,5.4rem)] font-light leading-[.94] tracking-[-.06em]">Tout ce qu’il faut savoir avant de vous lancer.</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-2">Une question reste sans réponse ? Commencez gratuitement et découvrez Sigmood IA directement dans l’interface.</p>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg leading-snug marker:hidden sm:text-xl [&::-webkit-details-marker]:hidden">
                  <span>{question}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 transition duration-300 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="max-w-2xl pr-12 pt-4 text-sm leading-relaxed text-ink-2">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-3">
        <div className="relative overflow-hidden rounded-[28px] bg-black px-6 py-20 text-center text-white sm:rounded-[36px] sm:px-12 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(31,197,190,.4),transparent_42%)]" aria-hidden />
          <div className="relative mx-auto max-w-[1100px]">
            <p className="text-xs uppercase tracking-[.18em] text-white/50">Votre prochaine boutique commence ici</p>
            <h2 className="mt-8 font-[Urbanist] text-[clamp(3.1rem,7.2vw,7.2rem)] font-light leading-[.9] tracking-[-.07em] text-white">Transformez votre idée en activité.</h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">Créez une première version gratuitement, ajustez-la à votre façon et publiez quand vous êtes prêt.</p>
            <a href="/login?mode=signup" className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white/90">
              Créer ma boutique <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      </main>
      <footer className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-10 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LogoMark className="size-5" />
          <span className="font-medium text-ink">Sigmood IA</span>
          <span>© 2026</span>
        </div>
        <nav aria-label="Navigation de pied de page" className="flex flex-wrap gap-x-6 gap-y-3">
          <a href="#produit" className="transition hover:text-ink">Produit</a>
          <a href="#tarifs" className="transition hover:text-ink">Tarifs</a>
          <a href="#faq" className="transition hover:text-ink">FAQ</a>
          <a href="/login" className="transition hover:text-ink">Connexion</a>
        </nav>
      </footer>
      </div>
    </>
  );
}
