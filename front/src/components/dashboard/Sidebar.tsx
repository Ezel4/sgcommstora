"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(app)/actions";
import { LogoMark } from "@/components/marketing/Logo";
import { activeStore } from "@/data/mock-commerce";
import { cn } from "@/lib/utils";
import {
  IconBox, IconChartBar, IconExternal, IconImage, IconLogout, IconOverview,
  IconReceipt, IconSettings, IconSparkles, IconStore, IconUsers,
} from "./icons";

const NAV = [
  { label: "Vue d’ensemble", href: "/dashboard", Icon: IconOverview },
  { label: "Statistiques", href: "/dashboard/statistiques", Icon: IconChartBar },
  { label: "Boutiques", href: "/dashboard/boutiques", Icon: IconStore },
  { label: "Produits", href: "/dashboard/produits", Icon: IconBox },
  { label: "Commandes", href: "/dashboard/commandes", Icon: IconReceipt },
  { label: "Clients", href: "/dashboard/clients", Icon: IconUsers },
  { label: "Assistant IA", href: "/dashboard/assistant", Icon: IconSparkles },
  { label: "Images IA", href: "/dashboard/images", Icon: IconImage },
];

export function Sidebar({ email, onNavigate }: { email: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col items-center gap-3 px-2 pb-4 pt-4">
      <Link href="/dashboard" onClick={onNavigate} aria-label="Stora" className="mb-7 grid size-9 place-items-center rounded-full bg-white/35">
        <LogoMark className="size-6" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto no-scrollbar">
        {NAV.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group grid size-9 shrink-0 place-items-center rounded-full transition",
                active ? "bg-ink text-white shadow-[0_8px_20px_rgba(0,0,0,.16)]" : "bg-white/35 text-ink-3 hover:bg-white/75 hover:text-ink",
              )}
            >
              <item.Icon className="size-[17px]" />
            </Link>
          );
        })}
      </nav>

      <Link href="/dashboard/parametres" onClick={onNavigate} title="Paramètres" aria-label="Paramètres" className="grid size-9 place-items-center rounded-full bg-white/35 text-ink-3 transition hover:bg-white/75 hover:text-ink">
        <IconSettings className="size-[17px]" />
      </Link>
      <a href={`/boutique/${activeStore.slug}`} target="_blank" rel="noreferrer" title="Voir la boutique" aria-label="Voir la boutique" className="grid size-9 place-items-center rounded-full bg-white/35 text-ink-3 transition hover:bg-white/75 hover:text-ink">
        <IconExternal className="size-[17px]" />
      </a>
      <div title={email} className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#82a99e] to-[#2498c8] text-[10px] font-semibold text-white">
        {email.slice(0, 2).toUpperCase()}
      </div>
      <form action={signOut}>
        <button type="submit" title="Se déconnecter" aria-label="Se déconnecter" className="grid size-8 place-items-center rounded-full text-ink-3 transition hover:bg-white/60 hover:text-ink">
          <IconLogout className="size-4" />
        </button>
      </form>
    </div>
  );
}
