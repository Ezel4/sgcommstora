import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { IconExternal } from "@/components/dashboard/icons";
import { activeStore } from "@/data/mock-commerce";
import { storeStatus } from "@/lib/commerce-status";
import { formatPercent } from "@/lib/format";

export default function Page() {
  const ss = storeStatus[activeStore.status];
  const generatedDate = new Date(activeStore.generatedAt).toLocaleDateString("fr-FR", {
    dateStyle: "long",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">Boutiques</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Ta boutique générée par l'IA.</h2>
      </div>

      <div className="card-dark relative overflow-hidden p-5 sm:p-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#82a99e] via-[#1fc5be] to-[#2498c8] text-lg font-semibold text-white">
              {activeStore.name.slice(0, 1)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-medium text-ink">{activeStore.name}</h3>
                <StatusPill tone={ss.tone}>{ss.label}</StatusPill>
              </div>
              <p className="mt-1 max-w-md text-sm text-ink-2">{activeStore.niche}</p>
              <p className="mt-0.5 text-xs text-ink-3">{activeStore.subdomain}</p>
            </div>
          </div>
          <a
            href={`/boutique/${activeStore.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost shrink-0 text-sm"
          >
            <IconExternal className="size-4" /> Voir la boutique
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Audience cible">
          <p className="text-sm leading-relaxed text-ink-2">{activeStore.audience}</p>
        </Panel>
        <Panel title="Style visuel">
          <p className="text-sm leading-relaxed text-ink-2">{activeStore.visualStyle}</p>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Panel title="Taux de conversion" bodyClassName="p-5">
          <p className="text-2xl font-light tracking-tight text-ink">
            {formatPercent(activeStore.conversionRate)}
          </p>
        </Panel>
        <Panel title="Sous-domaine" bodyClassName="p-5">
          <p className="truncate text-sm text-ink-2">{activeStore.subdomain}</p>
        </Panel>
        <Panel title="Générée le" bodyClassName="p-5">
          <p className="text-sm text-ink-2">{generatedDate}</p>
        </Panel>
      </div>
    </div>
  );
}
