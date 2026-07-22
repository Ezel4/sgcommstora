import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconImage } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconImage}
      eyebrow="Intelligence artificielle"
      title="Images IA"
      description="La génération et la retouche d’images ne sont pas encore disponibles dans le dashboard. Aucun visuel ne peut être créé depuis cet écran pour le moment."
      plannedItems={[
        "Importer une image produit et choisir une direction visuelle.",
        "Comparer les propositions avant de conserver un résultat.",
        "Associer un visuel validé à une fiche produit ou à la boutique.",
      ]}
      availableLinks={[
        {
          label: "Ouvrir le catalogue",
          description: "Consulter les produits qui recevront prochainement des visuels générés.",
          href: "/dashboard/produits",
        },
        {
          label: "Voir la boutique",
          description: "Retrouver le style visuel et le positionnement actuellement enregistrés.",
          href: "/dashboard/boutiques",
        },
      ]}
    />
  );
}
