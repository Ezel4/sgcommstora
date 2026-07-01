"use client";

import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { label: "Fonctionnalites", href: "#fonctionnalites" },
  { label: "Integrations", href: "#integrations" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="shell">
        <div className="glass-bar mt-4 flex items-center justify-between rounded-full px-4 py-2.5">
          <Logo />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-ink-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="hidden text-sm text-ink-2 transition-colors hover:text-ink sm:inline-flex sm:px-3">
              Connexion
            </a>
            <a href="/login?mode=signup" className="btn btn-light !px-5 !py-2 text-sm">
              S'inscrire
            </a>

            {/* hamburger (mobile) */}
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* panneau de navigation mobile */}
        {open && (
          <nav className="glass-bar mt-2 flex flex-col rounded-3xl p-2 lg:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-ink-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-ink-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink sm:hidden"
            >
              Connexion
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
