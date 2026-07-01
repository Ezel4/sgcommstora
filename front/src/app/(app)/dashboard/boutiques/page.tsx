import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconStore } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconStore}
      title="Mes boutiques"
      description="Gérez vos boutiques et créez-en de nouvelles à partir d'un simple prompt. Cette section arrive bientôt."
    />
  );
}
