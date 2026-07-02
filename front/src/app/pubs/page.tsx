"use client";

import { useState } from "react";
import { InstagramAdCard } from "@/components/marketing/InstagramAdCard";
import { LeadFormModal } from "@/components/marketing/LeadFormModal";
import { GlassFilters } from "@/components/marketing/GlassFilters";

// Source des leads captés par le formulaire de la pub 1.
const PUB_FORM_SOURCE = "pub-formulaire";
// Source propagée à la landing page par la pub 2 (voir ?ref= lu dans /lancement).
const PUB_LANDING_SOURCE = "pub-landing";

// Page de démo : simule un feed façon Instagram avec 2 pubs, pour vérifier que
// chaque CTA propage bien sa source jusqu'au CRM (badge "Provenance").
// Pub 1 : CTA -> formulaire de contact -> push direct d'un lead dans le CRM.
// Pub 2 : CTA -> redirige vers /lancement en conservant l'origine de la pub.
export default function PubsSimulationPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <main className="grain relative min-h-screen bg-base py-16">
      <GlassFilters />

      <div className="shell max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-3">Simulation</p>
          <h1 className="mt-2 text-xl font-light tracking-tight text-ink">
            Feed façon Instagram
          </h1>
          <p className="mt-1.5 text-sm text-ink-3">
            Clique sur le CTA d'une pub pour tester le tracking jusqu'au CRM.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <InstagramAdCard
            likes="1 284"
            caption={
              <>
                <span className="font-medium text-ink">stora.ai</span> Envie de lancer votre
                boutique en ligne mais pas envie de vous y perdre seul·e ? On vous rappelle
                gratuitement. 🚀
              </>
            }
            cta={
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="btn btn-light !px-4 !py-1.5 text-xs"
              >
                Être rappelé·e
              </button>
            }
          />

          <InstagramAdCard
            likes="2 019"
            caption={
              <>
                <span className="font-medium text-ink">stora.ai</span> Décrivez votre idée,
                l'IA construit votre boutique. Gratuit pour commencer, sans carte bancaire.
              </>
            }
            cta={
              <a
                href={`/lancement?ref=${PUB_LANDING_SOURCE}`}
                className="btn btn-light !px-4 !py-1.5 text-xs"
              >
                Essayer gratuitement
              </a>
            }
          />
        </div>
      </div>

      {formOpen && <LeadFormModal source={PUB_FORM_SOURCE} onClose={() => setFormOpen(false)} />}
    </main>
  );
}
