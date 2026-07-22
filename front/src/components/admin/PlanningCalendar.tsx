"use client";

import { useMemo, useState, useTransition } from "react";
import { createAppointment, deleteAppointment } from "@/app/admin/actions";
import { Panel } from "@/components/dashboard/Panel";
import { IconClose, IconPlus } from "@/components/dashboard/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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

function formatFullDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function formatCompactDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
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
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
          <h1 className="text-xl font-normal tracking-tight text-ink sm:text-2xl">Planning commercial — 30 prochains jours.</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setPrefillDate(undefined);
            setShowModal(true);
          }}
          className="btn btn-light w-full !px-4 !py-2 text-sm sm:w-auto"
        >
          <IconPlus className="size-4" /> Nouveau rendez-vous
        </button>
      </div>

      {actionError && (
        <p role="alert" className="rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger">
          {actionError}
        </p>
      )}

      <Panel bodyClassName="p-3 sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {days.map((d) => {
            const key = toDateKey(d);
            const dayAppointments = byDate.get(key) ?? [];
            const isToday = key === todayKey;
            const dateLabel = formatFullDate(d);
            return (
              <button
                key={key}
                type="button"
                aria-label={`Planifier un rendez-vous le ${dateLabel}`}
                aria-current={isToday ? "date" : undefined}
                onClick={() => {
                  setPrefillDate(key);
                  setShowModal(true);
                }}
                className={`flex min-h-20 flex-col items-start justify-between rounded-2xl border p-3 text-left transition hover:bg-white/55 ${
                  isToday ? "border-accent/40 bg-accent-soft" : "border-line bg-white/25"
                }`}
              >
                <span className="text-sm font-medium capitalize text-ink">{formatCompactDate(d)}</span>
                <span className="text-xs text-ink-3">
                  {dayAppointments.length === 0
                    ? "Aucun rendez-vous"
                    : `${dayAppointments.length} rendez-vous`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-wide text-ink-4">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">{w}</span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-2">
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
                  aria-label={`Planifier un rendez-vous le ${formatFullDate(d)}`}
                  aria-current={isToday ? "date" : undefined}
                  onClick={() => {
                    setPrefillDate(key);
                    setShowModal(true);
                  }}
                  className={`flex min-h-[84px] flex-col items-start gap-1 rounded-xl border p-2 text-left transition hover:bg-white/55 ${
                    isToday ? "border-accent/40 bg-accent-soft" : "border-line"
                  }`}
                >
                  <span className={`text-xs ${isToday ? "font-medium text-ink" : "text-ink-3"}`}>
                    {d.getUTCDate()}
                  </span>
                  <div className="flex w-full flex-col gap-0.5">
                    {dayAppointments.slice(0, 2).map((a) => (
                      <span
                        key={a.id}
                        className="truncate rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent-ink"
                      >
                        {a.contactName}
                      </span>
                    ))}
                    {dayAppointments.length > 2 && (
                      <span className="text-xs text-ink-4">+{dayAppointments.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
            {Array.from({ length: trailingBlanks }).map((_, i) => (
              <div key={`trail-${i}`} />
            ))}
          </div>
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
                    onClick={() => setAppointmentToDelete(a)}
                    aria-label={`Supprimer le rendez-vous ${a.title}`}
                    className="grid size-11 place-items-center rounded-full text-ink-3 hover:bg-danger-soft hover:text-danger"
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

      {appointmentToDelete && (
        <ConfirmDialog
          title="Supprimer ce rendez-vous ?"
          description={`Le rendez-vous « ${appointmentToDelete.title} » avec ${appointmentToDelete.contactName} sera définitivement supprimé.`}
          confirmLabel="Supprimer le rendez-vous"
          pending={isPending}
          onCancel={() => setAppointmentToDelete(null)}
          onConfirm={() => {
            setActionError(null);
            startTransition(async () => {
              const result = await deleteAppointment(appointmentToDelete.id);
              if (result.ok) setAppointmentToDelete(null);
              else setActionError(result.error);
            });
          }}
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
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createAppointment(formData);
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="new-appointment-title" className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h3 id="new-appointment-title" className="text-lg font-medium text-ink">Nouveau rendez-vous</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-10 place-items-center rounded-full text-ink-3 hover:bg-white/55 hover:text-ink">
            <IconClose className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="appointment-contact" className="mb-1.5 block text-xs font-medium text-ink-3">Contact</label>
            <select
              id="appointment-contact"
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
            <label htmlFor="appointment-title" className="mb-1.5 block text-xs font-medium text-ink-3">Objet</label>
            <input
              id="appointment-title"
              name="title"
              required
              placeholder="Appel de qualification…"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="appointment-date" className="mb-1.5 block text-xs font-medium text-ink-3">Date</label>
              <input
                id="appointment-date"
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
                className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="appointment-time" className="mb-1.5 block text-xs font-medium text-ink-3">Heure</label>
              <input
                id="appointment-time"
                name="time"
                type="time"
                defaultValue="09:00"
                className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="appointment-note" className="mb-1.5 block text-xs font-medium text-ink-3">Note (optionnel)</label>
            <textarea
              id="appointment-note"
              name="note"
              rows={2}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
          </div>

          {error && <p role="alert" className="text-sm text-danger">{error}</p>}

          <button type="submit" disabled={isPending} aria-busy={isPending} className="btn btn-light w-full !py-2.5 text-sm">
            {isPending ? "Enregistrement…" : "Planifier"}
          </button>
        </form>
      </div>
    </div>
  );
}
