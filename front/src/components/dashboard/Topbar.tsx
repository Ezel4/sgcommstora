"use client";

import type { Ref } from "react";
import { usePathname } from "next/navigation";
import type { StoreSummary } from "@/types/commerce";
import { AccountMenu } from "./AccountMenu";
import { IconExternal, IconMenu } from "./icons";

const ROUTE_CONTEXT = [
  { href: "/dashboard/statistiques", label: "Statistiques" },
  { href: "/dashboard/boutiques", label: "Boutiques" },
  { href: "/dashboard/produits", label: "Produits" },
  { href: "/dashboard/commandes", label: "Commandes" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/assistant", label: "Assistant IA" },
  { href: "/dashboard/images", label: "Images IA" },
  { href: "/dashboard/parametres", label: "Paramètres" },
] as const;

function getRouteLabel(pathname: string) {
  if (pathname === "/dashboard") return "Vue d’ensemble";
  return ROUTE_CONTEXT.find((item) => pathname.startsWith(item.href))?.label ?? "Dashboard";
}

export function Topbar({
  onMenu,
  menuOpen = false,
  menuId = "dashboard-navigation-drawer",
  menuButtonRef,
  email,
  store,
}: {
  onMenu: () => void;
  menuOpen?: boolean;
  menuId?: string;
  menuButtonRef?: Ref<HTMLButtonElement>;
  email: string;
  store: StoreSummary;
}) {
  const pathname = usePathname();
  const routeLabel = getRouteLabel(pathname);
  const canViewStore =
    process.env.NODE_ENV === "development" || store.status === "published";

  return (
    <header className="sticky top-0 z-30 h-16 bg-base/95 backdrop-blur-xl">
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 lg:grid-cols-[1fr_auto] lg:px-[18px]">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onMenu}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-2 transition hover:bg-surface hover:text-ink lg:hidden"
        >
          <IconMenu className="size-5" />
        </button>

        <div className="flex min-w-0 items-center gap-4 text-xs text-ink-2">
          <strong className="truncate text-[13px] font-semibold text-ink">Sigmood</strong>
          <span className="hidden truncate sm:inline">Commerce Hub</span>
          <span className="truncate text-ink-4 lg:hidden">· {routeLabel}</span>
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
          {canViewStore && (
            <a
              href={`/boutique/${store.slug}`}
              target="_blank"
              rel="noreferrer"
              className="grid size-9 place-items-center rounded-full bg-surface-2 text-ink-2 transition hover:bg-surface hover:text-ink"
            >
              <IconExternal className="size-4" />
              <span className="sr-only">Ouvrir l’aperçu de la boutique</span>
            </a>
          )}
          <AccountMenu
            email={email}
            storeName={store.name}
            avatarSrc="/avatar-sigmood.png"
            needsAttention={store.status === "needs-review"}
          />
        </div>
      </div>
    </header>
  );
}
