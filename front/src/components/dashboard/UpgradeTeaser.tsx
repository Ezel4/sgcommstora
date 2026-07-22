import Link from "next/link";
import { IconLock } from "@/components/dashboard/icons";

export function UpgradeTeaser({
  title = "Analyses clients avancées",
  description = "La segmentation avancée, l’historique complet et l’export ne sont pas encore disponibles dans cette version.",
  ctaLabel,
  ctaHref,
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <aside className="flex flex-col gap-5 rounded-[22px] bg-surface-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-white/60 text-accent-ink">
          <IconLock className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">Fonction en préparation</p>
          <h2 className="mt-1 text-lg font-medium tracking-tight text-ink">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-3">{description}</p>
        </div>
      </div>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-forest-700">
          {ctaLabel}
        </Link>
      )}
    </aside>
  );
}
