"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(app)/actions";
import { LogoMark } from "@/components/marketing/Logo";
import { activeStore } from "@/data/mock-commerce";
import { cn } from "@/lib/utils";
import {
  IconBox,
  IconChartBar,
  IconClose,
  IconExternal,
  IconImage,
  IconLogout,
  IconOverview,
  IconReceipt,
  IconSettings,
  IconSparkles,
  IconStore,
  IconUsers,
} from "./icons";

type NavItem = {
  label: string;
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Piloter",
    items: [
      { label: "Vue d’ensemble", href: "/dashboard", Icon: IconOverview },
      { label: "Statistiques", href: "/dashboard/statistiques", Icon: IconChartBar },
    ],
  },
  {
    label: "Vendre",
    items: [
      { label: "Boutiques", href: "/dashboard/boutiques", Icon: IconStore },
      { label: "Produits", href: "/dashboard/produits", Icon: IconBox },
      { label: "Commandes", href: "/dashboard/commandes", Icon: IconReceipt },
      { label: "Clients", href: "/dashboard/clients", Icon: IconUsers },
    ],
  },
  {
    label: "Créer avec l’IA",
    items: [
      { label: "Assistant IA", href: "/dashboard/assistant", Icon: IconSparkles },
      { label: "Images IA", href: "/dashboard/images", Icon: IconImage },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function Sidebar({
  email,
  onNavigate,
  onClose,
}: {
  email: string;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const canViewStore =
    process.env.NODE_ENV === "development" || activeStore.status === "published";
  const accountLabel = email.trim() || "Compte Sigmood";
  const initials = email.trim() ? email.slice(0, 2).toUpperCase() : "SI";
  return (
    <div className="flex h-full min-h-0 flex-col bg-transparent px-3 py-4">
      <div className="flex min-h-11 items-center gap-2 px-1">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-label="Sigmood IA — Vue d’ensemble"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/45"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/45">
            <LogoMark className="size-6" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">Sigmood IA</span>
            <span className="block truncate text-xs text-ink-3">Commerce Hub</span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            data-drawer-close
            onClick={onClose}
            aria-label="Fermer le menu"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink-2 transition hover:bg-white/55 hover:text-ink"
          >
            <IconClose className="size-5" />
          </button>
        )}
      </div>

      <nav
        aria-label="Navigation principale"
        className="no-scrollbar mt-6 min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-4">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                      active ? "bg-ink text-white" : "text-ink-2 hover:bg-white/50 hover:text-ink",
                    )}
                  >
                    <item.Icon className={cn("size-[17px] shrink-0", active ? "text-white" : "text-ink-3")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-black/[0.06] pt-3">
        <Link
          href="/dashboard/parametres"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/dashboard/parametres") ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
            pathname.startsWith("/dashboard/parametres") ? "bg-ink text-white" : "text-ink-2 hover:bg-white/50 hover:text-ink",
          )}
        >
          <IconSettings className="size-[17px] shrink-0" />
          Paramètres
        </Link>
        {canViewStore && (
          <a href={`/boutique/${activeStore.slug}`} target="_blank" rel="noreferrer" className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-2 transition hover:bg-white/50 hover:text-ink">
            <IconExternal className="size-[17px] shrink-0" />
            Voir la boutique
          </a>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-black/[0.06] px-1 pt-3">
        <span className="brand-gradient grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-ink">{initials}</span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink-2">{accountLabel}</span>
        <form action={signOut}>
          <button type="submit" title="Se déconnecter" aria-label="Se déconnecter" className="grid size-9 place-items-center rounded-full text-ink-3 transition hover:bg-white/60 hover:text-ink">
            <IconLogout className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
