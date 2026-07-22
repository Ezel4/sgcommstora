import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconSettings } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconSettings}
      title="Paramètres"
      description="Gérez votre compte, votre abonnement et vos clés d'intégration (paiement, IA, stockage). Cette section arrive bientôt."
    />
  );
}
