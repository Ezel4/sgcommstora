import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { IconExternal } from "@/components/dashboard/icons";
import { PageHeader } from "@/components/ui";
import { activeStore, products } from "@/data/mock-commerce";
import { storeStatus } from "@/lib/commerce-status";
import { formatPercent } from "@/lib/format";

export default function Page() {
  const status = storeStatus[activeStore.status];
  const canViewStore = process.env.NODE_ENV === "development" || activeStore.status === "published";
  const generatedDate = new Date(activeStore.generatedAt).toLocaleDateString("fr-FR", {
    dateStyle: "long",
  });
  const activeProducts = products.filter((product) => product.status !== "draft").length;

  const statusMessage = {
    published: "Votre boutique est publiée et accessible depuis son adresse publique.",
    "needs-review": "Votre boutique a été générée. Son contenu doit encore être vérifié avant publication.",
    draft: "Votre boutique est encore en préparation et n’est pas accessible publiquement.",
  }[activeStore.status];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Boutique"
        title="Votre boutique"
        description="Vérifiez son positionnement, son statut et les informations déjà configurées."
        aside={<StatusPill tone={status.tone}>{status.label}</StatusPill>}
        actions={
          canViewStore ? (
            <a
              href={`/boutique/${activeStore.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-light min-h-11 text-sm"
            >
              <IconExternal className="size-4" /> Voir l’aperçu
            </a>
          ) : undefined
        }
      />

      <section aria-labelledby="store-name" className="overflow-hidden rounded-[22px] bg-surface-2">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-center">
          <div className="flex min-w-0 items-start gap-4 sm:gap-5">
            <span aria-hidden className="brand-gradient grid size-14 shrink-0 place-items-center rounded-2xl text-xl font-semibold text-ink sm:size-16">
              {activeStore.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 id="store-name" className="font-[Urbanist] text-3xl font-light tracking-[-.045em] text-ink">{activeStore.name}</h2>
                <StatusPill tone={status.tone}>{status.label}</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-2">{activeStore.niche}</p>
              <p className="mt-1 truncate text-xs text-ink-3">{activeStore.subdomain}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink">Statut actuel</p>
            <p className="mt-2 text-sm leading-6 text-ink-2">{statusMessage}</p>
            {!canViewStore && (
              <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-ink-3">
                La publication n’est pas encore disponible depuis cet écran.
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="positioning-title">
        <div className="mb-4">
          <h2 id="positioning-title" className="text-xl font-medium tracking-tight text-ink">Positionnement généré</h2>
          <p className="mt-1 text-sm text-ink-3">Les fondations utilisées pour construire l’expérience de marque.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Audience cible" className="rounded-3xl" bodyClassName="p-6">
            <p className="text-sm leading-6 text-ink-2">{activeStore.audience}</p>
          </Panel>
          <Panel title="Style visuel" className="rounded-3xl" bodyClassName="p-6">
            <p className="text-sm leading-6 text-ink-2">{activeStore.visualStyle}</p>
          </Panel>
        </div>
      </section>

      <section aria-labelledby="store-details-title">
        <h2 id="store-details-title" className="mb-4 text-xl font-medium tracking-tight text-ink">Informations de la boutique</h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-surface p-5">
            <dt className="text-xs text-ink-3">Catalogue actif</dt>
            <dd className="mt-2 text-2xl font-medium text-ink">{activeProducts} produit{activeProducts > 1 ? "s" : ""}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-5">
            <dt className="text-xs text-ink-3">Taux de conversion</dt>
            <dd className="mt-2 text-2xl font-medium text-ink">{formatPercent(activeStore.conversionRate)}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-5">
            <dt className="text-xs text-ink-3">Sous-domaine</dt>
            <dd className="mt-2 truncate text-sm font-medium text-ink">{activeStore.subdomain}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-5">
            <dt className="text-xs text-ink-3">Générée le</dt>
            <dd className="mt-2 text-sm font-medium text-ink">{generatedDate}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
