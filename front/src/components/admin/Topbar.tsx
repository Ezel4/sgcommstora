"use client";

import { usePathname } from "next/navigation";
import { IconMenu } from "@/components/dashboard/icons";

const TITLES: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/contacts": "Tous les contacts",
  "/admin/leads": "Leads",
  "/admin/contactes": "Contactés",
  "/admin/qualifies": "Qualifiés",
  "/admin/clients": "Clients",
  "/admin/perdus": "Perdus",
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "CRM";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Ouvrir le menu"
          className="grid size-9 place-items-center rounded-lg text-ink-2 transition hover:bg-white/[0.05] hover:text-ink lg:hidden"
        >
          <IconMenu className="size-5" />
        </button>

        <h1 className="text-lg font-medium tracking-tight text-ink">{title}</h1>

        <span className="pill ml-auto">CRM interne</span>
      </div>
    </header>
  );
}
