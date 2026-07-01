import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { IconUsers } from "@/components/dashboard/icons";

export default function Page() {
  return (
    <ComingSoon
      Icon={IconUsers}
      title="Clients"
      description="Visualisez vos clients, leurs segments et leur valeur dans le temps. Cette section arrive bientôt."
    />
  );
}
