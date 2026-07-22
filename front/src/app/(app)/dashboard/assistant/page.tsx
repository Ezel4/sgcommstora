import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconSparkles } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconSparkles}
      eyebrow="Intelligence artificielle"
      title="Assistant IA"
      description="L’assistant conversationnel n’est pas encore actif. Cet écran présente son périmètre prévu sans simuler d’actions indisponibles."
      plannedItems={[
        "Analyser le catalogue et suggérer des optimisations prioritaires.",
        "Préparer des textes produit et des campagnes à valider avant application.",
        "Conserver un historique clair des recommandations et des décisions.",
      ]}
      availableLinks={[
        {
          label: "Consulter les produits",
          description: "Vérifier dès maintenant les fiches, prix, statuts et niveaux de stock.",
          href: "/dashboard/produits",
        },
        {
          label: "Vérifier la boutique",
          description: "Relire le positionnement et les informations déjà générées.",
          href: "/dashboard/boutiques",
        },
      ]}
    />
  );
}
