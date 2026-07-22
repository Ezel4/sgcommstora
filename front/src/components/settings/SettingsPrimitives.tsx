"use client";

import { useId } from "react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function SettingsCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-line bg-surface shadow-[var(--elevation-1)]", className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>}
            {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-3">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function SettingsRow({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0 pr-3">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && <p className="mt-1 max-w-xl text-xs leading-5 text-ink-3">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsToggle({
  checked,
  onCheckedChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none",
        checked ? "border-accent bg-accent" : "border-line-strong bg-surface-2",
      )}
    >
      <span className={cn("block size-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none", checked ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

export function SettingsSelect({
  label,
  hint,
  value,
  defaultValue,
  onChange,
  children,
  disabled,
  className,
}: {
  label: string;
  hint?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-ink-2">{label}</label>
      <select
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={hintId}
        className="min-h-11 w-full appearance-none rounded-xl border border-line-strong bg-elevated px-4 py-2.5 text-sm text-ink shadow-[var(--elevation-1)] transition hover:border-ink/20 focus-visible:border-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3"
      >
        {children}
      </select>
      {hint && <p id={hintId} className="text-xs leading-5 text-ink-3">{hint}</p>}
    </div>
  );
}

export function LocalOnlyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div role="note" className={cn("flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent-soft/70 text-accent-ink", compact ? "px-4 py-3" : "px-5 py-4")}>
      <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
      <div>
        <p className="text-sm font-semibold">Brouillon local uniquement</p>
        {!compact && <p className="mt-1 text-xs leading-5">Ces réglages restent dans cet onglet. Aucun changement n’est envoyé à un serveur ni appliqué à la boutique.</p>}
      </div>
    </div>
  );
}

export function ConnectionNotice({
  title = "Données à connecter",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className="rounded-2xl border border-warning/20 bg-warning-soft px-4 py-3.5 text-warning">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <Badge tone="warning">Interface uniquement</Badge>
      </div>
      <p className="mt-1 text-xs leading-5">{children}</p>
    </div>
  );
}

export function SettingsSaveBar({
  dirty,
  savedLocally,
  onReset,
  onKeepLocal,
}: {
  dirty: boolean;
  savedLocally: boolean;
  onReset: () => void;
  onKeepLocal: () => void;
}) {
  if (!dirty && !savedLocally) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:left-[15.75rem] lg:right-3">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-[20px] border border-white/60 bg-ink px-4 py-3 text-white shadow-[var(--elevation-4)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div aria-live="polite" className="min-w-0">
          <p className="text-sm font-semibold">{dirty ? "Modifications locales en attente" : "Brouillon conservé dans cet onglet"}</p>
          <p className="mt-0.5 text-xs text-white/65">Aucune synchronisation serveur ; ce brouillon sera perdu au rechargement.</p>
        </div>
        {dirty && (
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={onReset} className="border-white/15 text-white hover:bg-white/10 hover:text-white">Réinitialiser</Button>
            <Button type="button" size="sm" variant="secondary" onClick={onKeepLocal}>Garder dans cette vue</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UsageProgress({ label, value, detail }: { label: string; value?: number; detail: string }) {
  const hasValue = typeof value === "number";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-3">{detail}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-2"
        role={hasValue ? "progressbar" : undefined}
        aria-label={hasValue ? label : undefined}
        aria-valuemin={hasValue ? 0 : undefined}
        aria-valuemax={hasValue ? 100 : undefined}
        aria-valuenow={hasValue ? value : undefined}
      >
        <div className={cn("h-full rounded-full", hasValue ? "bg-accent" : "w-0 bg-transparent")} style={hasValue ? { width: `${Math.min(100, Math.max(0, value))}%` } : undefined} />
      </div>
    </div>
  );
}

export function InlineFeedback({ children }: { children: React.ReactNode }) {
  return <p role="status" aria-live="polite" className="rounded-xl bg-surface-2 px-3 py-2 text-xs leading-5 text-ink-2">{children}</p>;
}
