import Link from "next/link";
import { PageHeader } from "@/components/ui";

export function ComingSoon({
  eyebrow = "Espace de travail",
  title,
  description,
  Icon,
  plannedItems = [],
  availableLinks = [],
}: {
  eyebrow?: string;
  title: string;
  description: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  plannedItems?: string[];
  availableLinks?: Array<{ label: string; description: string; href: string }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <section className="overflow-hidden rounded-[22px] bg-surface-2">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)] lg:items-center lg:p-10">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl border border-accent/20 bg-accent-soft text-accent-ink">
              <Icon className="size-6" />
            </span>
            <span className="mt-6 inline-flex rounded-full border border-line bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
              En préparation
            </span>
            <h2 className="mt-4 max-w-xl font-[Urbanist] text-3xl font-light tracking-[-.045em] text-ink">Un espace pensé pour rester sous votre contrôle.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-3">
              Cette interface n’est pas encore active. Aucun réglage ni contenu ne peut être créé depuis cet écran pour le moment.
            </p>
          </div>

          {plannedItems.length > 0 && (
            <div className="rounded-2xl bg-white/45 p-5 sm:p-6">
              <h3 className="text-base font-medium text-ink">Périmètre prévu</h3>
              <ul className="mt-4 space-y-3">
                {plannedItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-ink-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {availableLinks.length > 0 && (
        <section aria-labelledby="available-now-title">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">Disponible maintenant</p>
              <h2 id="available-now-title" className="mt-1 text-xl font-medium tracking-tight text-ink">Continuer dans les espaces actifs</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {availableLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-2xl bg-surface p-5 transition hover:bg-elevated">
                <span className="flex items-center justify-between gap-4 text-sm font-semibold text-ink">
                  {item.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1 block text-sm leading-6 text-ink-3">{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
