"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconMenu, IconSearch, IconSettings, IconSparkles } from "./icons";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  return (
    <header className="relative z-30 h-16 bg-base">
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-3 px-3 sm:grid-cols-[230px_1fr_180px] sm:px-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <button type="button" onClick={onMenu} aria-label="Ouvrir le menu" className="grid size-9 place-items-center rounded-full bg-surface text-ink-2 lg:hidden">
            <IconMenu className="size-4" />
          </button>
          <strong className="text-sm font-semibold text-ink">Stora</strong>
          <span className="hidden text-sm text-ink-3 sm:inline">Commerce Hub</span>
        </div>

        <div className="hidden justify-self-center rounded-full bg-ink p-[3px] text-[11px] lg:flex">
          <Link href="/dashboard/boutiques" className="flex h-[34px] items-center gap-2 rounded-full bg-white px-4 font-medium text-ink">
            <IconSparkles className="size-3.5" /> Créer
          </Link>
          <button type="button" onClick={() => router.refresh()} className="flex h-[34px] items-center gap-2 border-r border-white/10 px-4 text-white/75 hover:text-white">
            ↻ Actualiser
          </button>
          <Link href="/dashboard/produits" className="flex h-[34px] items-center border-r border-white/10 px-4 text-white/75 hover:text-white">Produits</Link>
          <Link href="/dashboard/commandes" className="flex h-[34px] items-center border-r border-white/10 px-4 text-white/75 hover:text-white">Commandes</Link>
          <Link href="/dashboard/assistant" className="flex h-[34px] items-center px-4 text-white/75 hover:text-white">Assistant IA</Link>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" aria-label="Rechercher" className="grid size-9 place-items-center rounded-full bg-surface text-ink-3 hover:text-ink"><IconSearch className="size-4" /></button>
          <button type="button" aria-label="Notifications" className="relative hidden size-9 place-items-center rounded-full bg-surface text-ink-3 hover:text-ink sm:grid"><IconBell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" /></button>
          <Link href="/dashboard/parametres" aria-label="Paramètres" className="hidden size-9 place-items-center rounded-full bg-surface text-ink-3 hover:text-ink sm:grid"><IconSettings className="size-4" /></Link>
        </div>
      </div>
    </header>
  );
}
