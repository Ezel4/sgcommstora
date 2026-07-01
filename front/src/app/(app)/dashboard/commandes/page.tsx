import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconReceipt } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconReceipt}
      title="Commandes"
      description="Suivez vos commandes, leurs statuts et leur historique en temps réel. Cette section arrive bientôt."
    />
  );
}
