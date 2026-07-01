"use client";

import { usePathname } from "next/navigation";
import { IconBell, IconMenu, IconSearch, IconSparkles } from "./icons";

const TITLES: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/boutiques": "Boutiques",
  "/dashboard/produits": "Produits",
  "/dashboard/commandes": "Commandes",
  "/dashboard/clients": "Clients",
  "/dashboard/assistant": "Assistant IA",
  "/dashboard/images": "Images IA",
  "/dashboard/parametres": "Paramètres",
};

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

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

        <div className="ml-auto flex items-center gap-2.5">
          <label className="hidden items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-2 text-sm text-ink-3 transition focus-within:border-line-strong md:flex">
            <IconSearch className="size-4" />
            <input
              type="search"
              placeholder="Rechercher…"
              className="w-40 bg-transparent text-ink placeholder:text-ink-4 focus:outline-none lg:w-52"
            />
          </label>

          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-9 place-items-center rounded-full border border-line text-ink-2 transition hover:bg-white/[0.05] hover:text-ink"
          >
            <IconBell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose" />
          </button>

          <button type="button" className="btn btn-light !px-4 !py-2 text-sm">
            <IconSparkles className="size-4" />
            <span className="hidden sm:inline">Créer avec l'IA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
