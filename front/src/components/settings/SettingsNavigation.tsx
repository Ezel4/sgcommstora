"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { SETTINGS_GROUPS, SETTINGS_SECTION_BY_ID } from "./settings-data";
import { SettingsIcon } from "./SettingsIcon";
import type { SettingsSectionId } from "./types";

function NavigationGroups({
  activeId,
  onSelect,
  mobile = false,
}: {
  activeId: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
  mobile?: boolean;
}) {
  return (
    <nav aria-label="Sections des paramètres" className={cn("space-y-6", mobile && "pb-2")}>
      {SETTINGS_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-4">{group.label}</p>
          <ul className="space-y-1">
            {group.sections.map((section) => {
              const active = section.id === activeId;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelect(section.id)}
                    className={cn(
                      "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink motion-reduce:transition-none",
                      active ? "bg-ink text-white shadow-[var(--elevation-2)]" : "text-ink-2 hover:bg-surface hover:text-ink",
                    )}
                  >
                    <SettingsIcon name={section.icon} className={cn("size-[17px] shrink-0", active ? "text-accent" : "text-ink-3 group-hover:text-ink")} />
                    <span className="min-w-0 flex-1 truncate font-medium">{section.title}</span>
                    {section.status === "soon" && !active && <span className="size-1.5 shrink-0 rounded-full bg-warning" aria-label="Bientôt disponible" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function SettingsNavigation({
  activeId,
  onSelect,
}: {
  activeId: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
}) {
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const active = SETTINGS_SECTION_BY_ID[activeId];

  const handleMobileSelect = (id: SettingsSectionId) => {
    onSelect(id);
    if (mobileDetailsRef.current) mobileDetailsRef.current.open = false;
  };

  return (
    <>
      <aside className="hidden xl:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[24px] border border-line bg-white/65 p-3 shadow-[var(--elevation-1)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-2 px-2 pt-1">
            <p className="text-xs font-semibold text-ink">Navigation</p>
            <Badge tone="neutral">Rôle à connecter</Badge>
          </div>
          <NavigationGroups activeId={activeId} onSelect={onSelect} />
        </div>
      </aside>

      <details ref={mobileDetailsRef} className="group rounded-2xl border border-line bg-surface shadow-[var(--elevation-1)] xl:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink [&::-webkit-details-marker]:hidden">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink">
            <SettingsIcon name={active.icon} className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-ink-3">Section actuelle</span>
            <span className="block truncate text-sm font-semibold text-ink">{active.title}</span>
          </span>
          <svg viewBox="0 0 24 24" className="size-5 text-ink-3 transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="m7 10 5 5 5-5" /></svg>
        </summary>
        <div className="max-h-[65vh] overflow-y-auto border-t border-line px-3 py-4">
          <NavigationGroups activeId={activeId} onSelect={handleMobileSelect} mobile />
        </div>
      </details>
    </>
  );
}
