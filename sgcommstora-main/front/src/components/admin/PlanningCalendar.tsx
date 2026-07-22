"use client";

import { useMemo, useState, useTransition } from "react";
import { createAppointment, deleteAppointment } from "@/app/admin/actions";
import { Panel } from "@/components/dashboard/Panel";
import { IconClose, IconPlus } from "@/components/dashboard/icons";
import type { Appointment, Contact } from "@/types/crm";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Les rendez-vous sont stockés et affichés en UTC (voir createAppointment) : toutes
// les dates de ce composant utilisent donc les accesseurs UTC, jamais les accesseurs
// locaux, sinon la grille se décale d'un jour selon le fuseau du navigateur.
function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function mondayIndex(d: Date) {
  return (d.getUTCDay() + 6) % 7; // 0 = lundi
}

export function PlanningCalendar({
  appointments,
  contacts,
}: {
  appointments: Appointment[];
  contacts: Contact[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const todayKey = toDateKey(new Date());

  const days = useMemo(() => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const list: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = toDateKey(new Date(a.scheduledAt));
      (map.get(key) ?? map.set(key, []).get(key)!).push(a);
    }
    return map;
  }, [appointments]);

  const leadingBlanks = mondayIndex(days[0]);
  const trailingBlanks = (7 - ((leadingBlanks + days.length) % 7)) % 7;

  const upcoming = appointments.filter((a) => a.scheduledAt >= new Date(days[0]).toISOString());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-ink-3">CRM interne</p>
          <h2 className="text-2xl font-light tracking-tight text-ink">Planning commercial — 30 prochains jours.</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setPrefillDate(undefined);
            setShowModal(true);
          }}
          className="btn btn-light !px-3.5 !py-1.5 text-xs"
        >
          <IconPlus className="size-4" /> Nouveau rendez-vous
        </button>
      </div>

      <Panel bodyClassName="p-3 sm:p-5">
        <div className="grid grid-cols-7 gap-1.5 text-center text-[0.65rem] font-medium uppercase tracking-wide text-ink-4 sm:gap-2">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">{w}</span>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`lead-${i}`} />
          ))}
          {days.map((d) => {
            const key = toDateKey(d);
            const dayAppointments = byDate.get(key) ?? [];
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPrefillDate(key);
                  setShowModal(true);
                }}
                className={`flex min-h-[64px] flex-col items-start gap-1 rounded-xl border p-1.5 text-left transition hover:bg-white/[0.04] sm:min-h-[84px] sm:p-2 ${
                  isToday ? "border-line-strong bg-white/[0.03]" : "border-line"
                }`}
              >
                <span className={`text-xs ${isToday ? "font-medium text-ink" : "text-ink-3"}`}>
                  {d.getUTCDate()}
                </span>
                <div className="flex w-full flex-col gap-0.5">
                  {dayAppointments.slice(0, 2).map((a) => (
                    <span
                      key={a.id}
                      className="truncate rounded-md bg-accent-soft px-1.5 py-0.5 text-[0.62rem] font-medium text-accent"
                    >
                      {a.contactName}
                    </span>
                  ))}
                  {dayAppointments.length > 2 && (
                    <span className="text-[0.6rem] text-ink-4">+{dayAppointments.length - 2}</span>
                  )}
                </div>
              </button>
            );
          })}
          {Array.from({ length: trailingBlanks }).map((_, i) => (
            <div key={`trail-${i}`} />
          ))}
        </div>
      </Panel>

      <Panel title="Rendez-vous à venir" bodyClassName="p-0">
        {upcoming.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun rendez-vous planifié.</p>
        ) : (
          <div className="divide-y divide-line">
            {upcoming.map((a) => {
              const date = new Date(a.scheduledAt);
              return (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-16 shrink-0 text-xs text-ink-3">
                    {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", timeZone: "UTC" })}
                    <br />
                    {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{a.contactName} — {a.title}</p>
                    {a.note && <p className="truncate text-xs text-ink-3">{a.note}</p>}
                  </div>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startTransition(() => deleteAppointment(a.id))}
                    aria-label="Supprimer"
                    className="text-ink-3 hover:text-rose"
                  >
                    <IconClose className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {showModal && (
        <NewAppointmentModal
          contacts={contacts}
          defaultDate={prefillDate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function NewAppointmentModal({
  contacts,
  defaultDate,
  onClose,
}: {
  contacts: Contact[];
  defaultDate?: string;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createAppointment(formData);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-ink">Nouveau rendez-vous</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-3 hover:text-ink">
            <IconClose className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Contact</label>
            <select
              name="contact_id"
              required
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              <option value="">Sélectionner…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Objet</label>
            <input
              name="title"
              required
              placeholder="Appel de qualification…"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-3">Date</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
                className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-3">Heure</label>
              <input
                name="time"
                type="time"
                defaultValue="09:00"
                className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Note (optionnel)</label>
            <textarea
              name="note"
              rows={2}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
          </div>

          <button type="submit" disabled={isPending} className="btn btn-light w-full !py-2.5 text-sm">
            {isPending ? "Enregistrement…" : "Planifier"}
          </button>
        </form>
      </div>
    </div>
  );
}
