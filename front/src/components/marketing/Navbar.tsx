"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { label: "Produit", href: "#produit" },
  { label: "Méthode", href: "#methode" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-7">
        <div className="relative mt-3 flex h-14 items-center justify-between rounded-full bg-surface-2/90 px-2.5 pl-4 backdrop-blur-2xl sm:mt-4 sm:pl-5">
          <Logo />

          <nav aria-label="Navigation principale" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-[13px] text-ink-2 transition hover:bg-white/55 hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a href="/login" className="hidden rounded-full px-4 py-2 text-[13px] text-ink-2 transition hover:text-ink md:block">Connexion</a>
            <a href="/login?mode=signup" className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-[12px] font-medium text-white transition hover:bg-black/80 sm:px-5 sm:text-[13px]"><span className="sm:hidden">Créer</span><span className="hidden sm:inline">Créer ma boutique</span></a>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-controls="mobile-navigation" aria-expanded={open} className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-white/55 lg:hidden">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d={open ? "M6 6l12 12M18 6 6 18" : "M4 8h16M4 16h16"} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-navigation" aria-label="Navigation mobile" className="animate-fade-in mt-2 flex flex-col rounded-[24px] bg-cream-muted/95 p-2 backdrop-blur-xl lg:hidden">
            {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-ink-2 hover:bg-white/55">{link.label}</a>)}
            <a href="/login" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-ink-2 hover:bg-white/55 md:hidden">Connexion</a>
          </nav>
        )}
      </div>
    </header>
  );
}
