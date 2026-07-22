"use client";

import { useMemo, useState, useTransition } from "react";
import { addNote, createContact, deleteContact, updateContactStatus } from "@/app/admin/actions";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { IconClose, IconMegaphone, IconPlus } from "@/components/dashboard/icons";
import { contactStatus, contactStatusOrder } from "@/lib/crm-status";
import { formatCurrency } from "@/lib/format";
import type { Contact, ContactNote, ContactStatus } from "@/types/crm";

type Filter = "all" | ContactStatus;

export function CrmBoard({
  contacts,
  notesByContact,
  statusFilter,
  heading = "Tes leads et clients Sigmood, au même endroit.",
}: {
  contacts: Contact[];
  notesByContact: Record<string, ContactNote[]>;
  statusFilter?: ContactStatus;
  heading?: string;
}) {
  const [filter, setFilter] = useState<Filter>(statusFilter ?? "all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const metrics = useMemo(() => {
    const total = contacts.length;
    const clients = contacts.filter((c) => c.status === "client");
    const leads = contacts.filter((c) => c.status === "lead").length;
    const mrrTotal = clients.reduce((sum, c) => sum + c.mrr, 0);
    const conversion = total > 0 ? (clients.length / total) * 100 : 0;
    return { total, leads, clientsCount: clients.length, mrrTotal, conversion };
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [contacts, filter, search]);

  const selected = selectedId ? (contacts.find((c) => c.id === selectedId) ?? null) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">CRM interne</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">{heading}</h2>
      </div>

      {!statusFilter && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard metric={{ label: "Contacts", value: String(metrics.total), change: `${metrics.leads} leads`, tone: "neutral" }} />
          <MetricCard metric={{ label: "Clients actifs", value: String(metrics.clientsCount), change: "abonnements en cours", tone: "positive" }} />
          <MetricCard metric={{ label: "MRR total", value: formatCurrency(metrics.mrrTotal), change: "clients uniquement", tone: "positive" }} />
          <MetricCard metric={{ label: "Taux de conversion", value: `${metrics.conversion.toFixed(0)}%`, change: "leads → clients", tone: "neutral" }} />
        </div>
      )}

      <Panel
        title={
          statusFilter ? undefined : (
            <div className="flex flex-wrap items-center gap-2">
              <FilterTab label="Tous" active={filter === "all"} onClick={() => setFilter("all")} />
              {contactStatusOrder.map((status) => (
                <FilterTab
                  key={status}
                  label={contactStatus[status].label}
                  active={filter === status}
                  onClick={() => setFilter(status)}
                />
              ))}
            </div>
          )
        }
        action={
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="hidden w-40 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none sm:block"
            />
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-light !px-3.5 !py-1.5 text-xs"
            >
              <IconPlus className="size-4" /> Nouveau contact
            </button>
          </div>
        }
        bodyClassName="p-0"
      >
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun contact pour l'instant.</p>
        ) : (
          <div className="divide-y divide-line">
            <div className="hidden items-center gap-4 px-5 py-2 text-[0.65rem] font-medium uppercase tracking-wide text-ink-4 sm:flex">
              <span className="flex-1">Contact</span>
              <span className="w-32 shrink-0">Provenance</span>
              <span className="w-20 shrink-0">Statut</span>
              <span className="w-24 shrink-0 text-right">MRR</span>
            </div>
            {filtered.map((c) => {
              const cs = contactStatus[c.status];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                    <p className="truncate text-xs text-ink-3">
                      {[c.company, c.email].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="hidden w-32 shrink-0 sm:block">
                    {isCampaignSource(c.source) ? (
                      <CampaignBadge source={c.source} />
                    ) : (
                      <span className="text-xs text-ink-4">—</span>
                    )}
                  </div>
                  <StatusPill tone={cs.tone}>{cs.label}</StatusPill>
                  <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                    {c.mrr > 0 ? formatCurrency(c.mrr) : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      {showAddModal && (
        <AddContactModal defaultStatus={statusFilter ?? "lead"} onClose={() => setShowAddModal(false)} />
      )}

      {selected && (
        <ContactDrawer
          contact={selected}
          notes={notesByContact[selected.id] ?? []}
          isPending={isPending}
          onClose={() => setSelectedId(null)}
          onStatusChange={(status) => startTransition(() => updateContactStatus(selected.id, status))}
          onDelete={() => {
            startTransition(() => deleteContact(selected.id));
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}

// "signup" est la valeur par défaut posée par l'inscription classique (aucune
// campagne particulière) : on ne badge que les sources identifiables (landing
// page taguée, ou texte saisi manuellement dans le champ "Source").
function isCampaignSource(source: string | null): source is string {
  return !!source && source !== "signup";
}

function CampaignBadge({ source, className = "" }: { source: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[rgba(31,197,190,0.34)] bg-accent-soft px-2.5 py-0.5 text-[0.7rem] font-medium text-accent ${className}`}
    >
      <IconMegaphone className="size-3" />
      {source}
    </span>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-white/[0.09] text-ink" : "text-ink-3 hover:bg-white/[0.04] hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function AddContactModal({
  onClose,
  defaultStatus,
}: {
  onClose: () => void;
  defaultStatus: ContactStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createContact(formData);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-ink">Nouveau contact</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-3 hover:text-ink">
            <IconClose className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Field label="Nom" name="name" required />
          <Field label="Entreprise" name="company" />
          <Field label="Email" name="email" type="email" />
          <Field label="Téléphone" name="phone" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-3">Statut</label>
              <select
                name="status"
                defaultValue={defaultStatus}
                className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
              >
                {contactStatusOrder.map((s) => (
                  <option key={s} value={s}>
                    {contactStatus[s].label}
                  </option>
                ))}
              </select>
            </div>
            <Field label="MRR estimé (€)" name="mrr" type="number" />
          </div>
          <Field label="Source" name="source" placeholder="LinkedIn, bouche à oreille…" />

          <button type="submit" disabled={isPending} className="btn btn-light w-full !py-2.5 text-sm">
            {isPending ? "Ajout…" : "Ajouter le contact"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-3">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
      />
    </div>
  );
}

function ContactDrawer({
  contact,
  notes,
  isPending,
  onClose,
  onStatusChange,
  onDelete,
}: {
  contact: Contact;
  notes: ContactNote[];
  isPending: boolean;
  onClose: () => void;
  onStatusChange: (status: ContactStatus) => void;
  onDelete: () => void;
}) {
  const [noteText, setNoteText] = useState("");
  const [notePending, startNoteTransition] = useTransition();

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    const content = noteText.trim();
    if (!content) return;
    startNoteTransition(async () => {
      await addNote(contact.id, content);
      setNoteText("");
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-medium text-ink">{contact.name}</h3>
              {contact.userId && (
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.65rem] font-medium text-accent">
                  Compte créé
                </span>
              )}
              {isCampaignSource(contact.source) && <CampaignBadge source={contact.source} />}
            </div>
            <p className="mt-0.5 text-sm text-ink-3">
              {[contact.company, contact.email, contact.phone].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-3 hover:text-ink">
            <IconClose className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Statut</label>
            <select
              value={contact.status}
              disabled={isPending}
              onChange={(e) => onStatusChange(e.target.value as ContactStatus)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              {contactStatusOrder.map((s) => (
                <option key={s} value={s}>
                  {contactStatus[s].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">MRR</label>
            <p className="rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 text-sm text-ink">
              {formatCurrency(contact.mrr)}
            </p>
          </div>
        </div>

        {(contact.companySize || contact.sector || contact.referralSource) && (
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5 text-xs">
            {contact.companySize && (
              <div>
                <p className="text-ink-4">Taille entreprise</p>
                <p className="mt-0.5 text-ink-2">{contact.companySize}</p>
              </div>
            )}
            {contact.sector && (
              <div>
                <p className="text-ink-4">Secteur</p>
                <p className="mt-0.5 text-ink-2">{contact.sector}</p>
              </div>
            )}
            {contact.referralSource && (
              <div className="col-span-2">
                <p className="text-ink-4">Nous a connu via</p>
                <p className="mt-0.5 text-ink-2">{contact.referralSource}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-ink">Notes de suivi</h4>
          <form onSubmit={handleAddNote} className="mt-2.5 flex gap-2">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Ajouter une note…"
              className="flex-1 rounded-xl border border-line bg-white/[0.03] px-3.5 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
            <button type="submit" disabled={notePending} className="btn btn-ghost !px-3.5 !py-2 text-xs">
              Ajouter
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {notes.length === 0 && <p className="text-sm text-ink-3">Aucune note pour l'instant.</p>}
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-line bg-white/[0.02] p-3.5">
                <p className="text-sm leading-relaxed text-ink-2">{n.content}</p>
                <p className="mt-1.5 text-xs text-ink-4">
                  {new Date(n.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mt-6 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-rose transition hover:bg-white/[0.04]"
        >
          Supprimer le contact
        </button>
      </div>
    </div>
  );
}
