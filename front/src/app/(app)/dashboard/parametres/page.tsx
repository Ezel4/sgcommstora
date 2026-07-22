import { Suspense } from "react";
import { SettingsCenter } from "@/components/settings/SettingsCenter";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          className="h-72 animate-pulse rounded-[28px] bg-surface-2 motion-reduce:animate-none"
          aria-label="Chargement des paramètres"
        />
      }
    >
      <SettingsCenter />
    </Suspense>
  );
}
