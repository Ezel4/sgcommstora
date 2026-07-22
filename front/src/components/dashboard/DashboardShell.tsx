"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardAccountProvider } from "./DashboardAccountContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const DRAWER_ID = "dashboard-navigation-drawer";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function DashboardShell({
  children,
  email,
  demoMode = false,
}: {
  children: React.ReactNode;
  email: string;
  demoMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    let shouldRestoreFocus = true;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const initialFocus =
        drawerRef.current?.querySelector<HTMLElement>("[data-drawer-close]") ??
        drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (initialFocus ?? drawerRef.current)?.focus();
    });

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        shouldRestoreFocus = false;
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        drawer.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || !drawer.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeElement === last || !drawer.contains(activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopMedia.addEventListener("change", closeOnDesktop);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      desktopMedia.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      if (shouldRestoreFocus && previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  return (
    <DashboardAccountProvider demoMode={demoMode} email={email}>
      <div className="dashboard-reference min-h-screen bg-base">
      <a
        href="#dashboard-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:not-sr-only focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-pill-ink"
      >
        Aller au contenu
      </a>

      <aside
        aria-label="Navigation du dashboard"
        className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-black/[0.05] bg-[#e6e6e6] lg:block"
      >
        <Sidebar email={email} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Fermer le menu"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />
          <aside
            ref={drawerRef}
            id={DRAWER_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation du dashboard"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-72 max-w-[calc(100%-1.5rem)] overflow-hidden border-r border-black/[0.05] bg-[#e6e6e6] outline-none"
          >
            <Sidebar email={email} onNavigate={closeDrawer} onClose={closeDrawer} />
          </aside>
        </div>
      )}

      <div
        aria-hidden={open || undefined}
        inert={open || undefined}
        className="lg:pl-60"
      >
        <Topbar
          onMenu={() => setOpen(true)}
          menuOpen={open}
          menuId={DRAWER_ID}
          menuButtonRef={menuButtonRef}
          email={email}
        />
        {demoMode && (
          <div
            role="status"
            className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink sm:mx-6"
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-ink" />
            <p>
              <strong className="font-semibold">Mode démonstration.</strong>{" "}
              Les boutiques, ventes et clients affichés sont des données fictives locales.
            </p>
          </div>
        )}
        <main id="dashboard-content" className="w-full px-4 pb-8 pt-3 sm:px-5 lg:pl-2.5 lg:pr-[18px]">
          {children}
        </main>
      </div>
      </div>
    </DashboardAccountProvider>
  );
}
