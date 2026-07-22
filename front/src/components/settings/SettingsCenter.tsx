"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDashboardAccount } from "@/components/dashboard/DashboardAccountContext";
import { Badge, ConfirmDialog } from "@/components/ui";
import { SECTION_URL_SLUGS, SETTINGS_SECTIONS, SETTINGS_SECTION_BY_ID, resolveSettingsSection } from "./settings-data";
import { SettingsIcon } from "./SettingsIcon";
import { SettingsNavigation } from "./SettingsNavigation";
import { SettingsSaveBar } from "./SettingsPrimitives";
import { SettingsSearch } from "./SettingsSearch";
import type { SettingsSectionId } from "./types";
import { SettingsView } from "./SettingsView";

export function SettingsCenter() {
  const { email } = useDashboardAccount();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = resolveSettingsSection(searchParams.get("section"), searchParams.get("action"));
  const activeSection = SETTINGS_SECTION_BY_ID[activeId];
  const contactRequested = activeId === "support" && searchParams.get("action") === "contact";
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<Set<SettingsSectionId>>(
    () => new Set(),
  );
  const [pendingSection, setPendingSection] = useState<SettingsSectionId | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<Partial<Record<SettingsSectionId, number>>>({});
  const [visitedSections, setVisitedSections] = useState<Set<SettingsSectionId>>(
    () => new Set([activeId]),
  );

  useEffect(() => {
    if (!dirty && savedDrafts.size === 0) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const guardInternalLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      setPendingHref(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    document.addEventListener("click", guardInternalLink, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeLeaving);
      document.removeEventListener("click", guardInternalLink, true);
    };
  }, [dirty, savedDrafts]);

  const navigateTo = (id: SettingsSectionId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", SECTION_URL_SLUGS[id]);
    params.delete("action");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const requestSection = (id: SettingsSectionId) => {
    if (id === activeId) return;
    if (dirty) {
      setPendingSection(id);
      return;
    }
    navigateTo(id);
  };

  const markDirty = () => {
    setVisitedSections((current) => {
      if (current.has(activeId)) return current;
      const next = new Set(current);
      next.add(activeId);
      return next;
    });
    setDirty(true);
    setSavedDrafts((current) => {
      if (!current.has(activeId)) return current;
      const next = new Set(current);
      next.delete(activeId);
      return next;
    });
  };

  const resetActiveView = () => {
    setRevisions((current) => ({ ...current, [activeId]: (current[activeId] ?? 0) + 1 }));
    setDirty(false);
    setSavedDrafts((current) => {
      if (!current.has(activeId)) return current;
      const next = new Set(current);
      next.delete(activeId);
      return next;
    });
  };

  const abandonAndNavigate = () => {
    if (!pendingSection) return;
    setRevisions((current) => ({ ...current, [activeId]: (current[activeId] ?? 0) + 1 }));
    const next = pendingSection;
    setPendingSection(null);
    setDirty(false);
    setSavedDrafts((current) => {
      if (!current.has(activeId)) return current;
      const remaining = new Set(current);
      remaining.delete(activeId);
      return remaining;
    });
    navigateTo(next);
  };

  const abandonAllAndLeave = () => {
    if (!pendingHref) return;
    const destination = pendingHref;
    setPendingHref(null);
    setDirty(false);
    setSavedDrafts(new Set());
    router.push(destination);
  };

  return (
    <div className="mx-auto max-w-[1500px] pb-40 sm:pb-28">
      <header className="relative overflow-visible rounded-[28px] border border-white/50 bg-white/55 px-5 py-6 shadow-[var(--elevation-2)] backdrop-blur-xl sm:px-7 sm:py-7">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-[radial-gradient(circle,rgba(31,197,190,.25),rgba(114,168,216,.10)_48%,transparent_72%)] blur-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,34rem)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-accent-ink">Centre de contrôle</p><Badge tone="neutral">Données locales / à connecter</Badge></div>
            <h1 className="mt-3 font-[Manrope] text-[clamp(2.1rem,4vw,3.25rem)] font-normal leading-none tracking-[-0.055em] text-ink">Paramètres</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-3">Gérez votre compte, votre boutique et vos préférences Sigmood IA depuis un espace unique.</p>
          </div>
          <SettingsSearch query={query} onQueryChange={setQuery} onSelect={requestSection} />
        </div>
      </header>

      <div className="mt-4 xl:grid xl:grid-cols-[17rem_minmax(0,1fr)] xl:items-start xl:gap-5">
        <SettingsNavigation activeId={activeId} onSelect={requestSection} />
        <section className="mt-4 min-w-0 xl:mt-0" aria-labelledby="settings-section-title">
          <header className="mb-4 rounded-[22px] border border-line bg-surface/80 px-5 py-5 shadow-[var(--elevation-1)] sm:px-6">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-ink"><SettingsIcon name={activeSection.icon} className="size-5" /></span>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 id="settings-section-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{activeSection.title}</h2>{activeSection.status === "soon" && <Badge tone="neutral">Bientôt disponible</Badge>}</div><p className="mt-1 text-sm leading-6 text-ink-3">{activeSection.description}</p></div>
            </div>
          </header>

          {SETTINGS_SECTIONS.filter(
            (section) => section.id === activeId || visitedSections.has(section.id),
          ).map((section) => (
            <div key={section.id} hidden={section.id !== activeId}>
              <SettingsView key={`${section.id}:${revisions[section.id] ?? 0}`} id={section.id} onChange={markDirty} contactRequested={section.id === "support" && contactRequested} profileEmail={email} />
            </div>
          ))}
        </section>
      </div>

      <SettingsSaveBar
        dirty={dirty}
        savedLocally={savedDrafts.has(activeId)}
        onReset={resetActiveView}
        onKeepLocal={() => {
          setDirty(false);
          setSavedDrafts((current) => {
            const next = new Set(current);
            next.add(activeId);
            return next;
          });
        }}
      />

      {pendingSection && (
        <ConfirmDialog title="Abandonner le brouillon local ?" description={`Les modifications locales de « ${activeSection.title} » seront réinitialisées avant d’ouvrir « ${SETTINGS_SECTION_BY_ID[pendingSection].title} ». Aucune donnée serveur n’est concernée.`} confirmLabel="Abandonner le brouillon" onCancel={() => setPendingSection(null)} onConfirm={abandonAndNavigate} />
      )}

      {pendingHref && (
        <ConfirmDialog
          title="Quitter les paramètres ?"
          description="Les brouillons locaux de cet onglet ne sont pas synchronisés. En quittant cette page, vous risquez de perdre ces modifications."
          confirmLabel="Quitter et abandonner"
          onCancel={() => setPendingHref(null)}
          onConfirm={abandonAllAndLeave}
        />
      )}
    </div>
  );
}
