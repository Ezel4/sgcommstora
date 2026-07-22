"use client";

import { useEffect, useRef, useState } from "react";
import { SETTINGS_SECTIONS } from "./settings-data";
import { SettingsIcon } from "./SettingsIcon";
import type { SettingsSectionId } from "./types";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .trim();
}

export function SettingsSearch({
  query,
  onQueryChange,
  onSelect,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: SettingsSectionId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedQuery = normalize(query);
  const results = normalizedQuery
    ? SETTINGS_SECTIONS.filter((section) =>
        normalize([section.title, section.description, section.group, ...section.keywords].join(" ")).includes(normalizedQuery),
      ).slice(0, 8)
    : [];
  const showResults = Boolean(normalizedQuery && open);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative z-20 w-full" role="search">
      <label htmlFor="settings-search" className="sr-only">Rechercher dans les paramètres</label>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input
        id="settings-search"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        value={query}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(event) => { onQueryChange(event.target.value); setOpen(true); setActiveIndex(0); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          } else if (event.key === "ArrowDown" && results.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => (current + 1) % results.length);
          } else if (event.key === "ArrowUp" && results.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => (current - 1 + results.length) % results.length);
          } else if (event.key === "Enter" && showResults && results.length > 0) {
            event.preventDefault();
            const section = results[activeIndex] ?? results[0];
            onSelect(section.id);
            onQueryChange("");
            setOpen(false);
          }
        }}
        placeholder="Rechercher : mot de passe, domaine, TVA…"
        aria-expanded={showResults}
        aria-controls={showResults ? "settings-search-results" : undefined}
        aria-activedescendant={showResults && results.length > 0 ? `settings-result-${results[activeIndex]?.id ?? results[0].id}` : undefined}
        className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/80 py-3 pl-12 pr-11 text-sm text-ink shadow-[var(--elevation-2)] outline-none backdrop-blur-xl placeholder:text-ink-4 focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
      />
      {query && (
        <button type="button" onClick={() => { onQueryChange(""); setOpen(false); }} aria-label="Effacer la recherche" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition hover:bg-surface-2 hover:text-ink">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="m7 7 10 10M17 7 7 17" /></svg>
        </button>
      )}

      <span className="sr-only" role="status" aria-live="polite">{showResults ? `${results.length} résultat${results.length > 1 ? "s" : ""}` : ""}</span>

      {showResults && (
        <div id="settings-search-results" role="listbox" aria-label="Résultats des paramètres" className="absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-[20px] border border-line bg-elevated shadow-[var(--elevation-4)]">
          {results.length > 0 ? (
            <div className="max-h-[min(28rem,65vh)] overflow-y-auto p-2">
              {results.map((section, index) => (
                <button
                  key={section.id}
                  id={`settings-result-${section.id}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  tabIndex={-1}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onSelect(section.id);
                    onQueryChange("");
                    setOpen(false);
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-accent-ink ${activeIndex === index ? "bg-surface-2" : "hover:bg-surface-2"}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-2"><SettingsIcon name={section.icon} className="size-[18px]" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{section.title}</span>
                      <span className="text-xs font-medium text-ink-4">{section.group}</span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-ink-3">{section.description}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="mt-2 size-4 shrink-0 text-ink-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-7 text-center">
              <p className="text-sm font-semibold text-ink">Aucun réglage trouvé</p>
              <p className="mt-1 text-xs leading-5 text-ink-3">Essayez « domaine », « TVA », « facture » ou « livraison ».</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
