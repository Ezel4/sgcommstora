import Link from "next/link";
import { IconLock } from "@/components/dashboard/icons";
import { Panel } from "@/components/dashboard/Panel";

const FAKE_ROWS = ["•••••• ••••••", "•••••• ••••••", "•••••• ••••••"];

export function UpgradeTeaser({
  title = "Débloquez plus d'insights clients",
  description = "Passe à un plan supérieur pour accéder aux segments avancés, à l'historique complet et à l'export de tes clients.",
  ctaLabel = "Voir les plans",
  ctaHref = "/dashboard/parametres",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none blur-sm">
        <Panel bodyClassName="p-0">
          <div className="divide-y divide-line">
            {FAKE_ROWS.map((name, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{name}</p>
                  <p className="truncate text-xs text-ink-3">•••••@••••••.•• · {i + 2} commandes</p>
                </div>
                <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                  {(i + 1) * 120}€
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="card-dark max-w-sm p-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-2xl border border-line bg-white/[0.04] text-rose">
            <IconLock className="size-5" />
          </span>
          <h3 className="mt-4 text-[1rem] font-medium text-ink">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{description}</p>
          <Link href={ctaHref} className="btn btn-light mt-5 text-sm">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
