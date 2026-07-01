import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { contactStatus } from "@/lib/crm-status";
import { formatCurrency } from "@/lib/format";
import type { Contact, ContactNote } from "@/types/crm";

export function Overview({
  contacts,
  notes,
}: {
  contacts: Contact[];
  notes: ContactNote[];
}) {
  const clients = contacts.filter((c) => c.status === "client");
  const leads = contacts.filter((c) => c.status === "lead").length;
  const mrrTotal = clients.reduce((sum, c) => sum + c.mrr, 0);
  const conversion = contacts.length > 0 ? (clients.length / contacts.length) * 100 : 0;

  const recentContacts = contacts.slice(0, 5);
  const recentNotes = notes.slice(0, 5);
  const contactById = new Map(contacts.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">CRM interne</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">
          Tes leads et clients Sigmood, au même endroit.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard metric={{ label: "Contacts", value: String(contacts.length), change: `${leads} leads`, tone: "neutral" }} />
        <MetricCard metric={{ label: "Clients actifs", value: String(clients.length), change: "abonnements en cours", tone: "positive" }} />
        <MetricCard metric={{ label: "MRR total", value: formatCurrency(mrrTotal), change: "clients uniquement", tone: "positive" }} />
        <MetricCard metric={{ label: "Taux de conversion", value: `${conversion.toFixed(0)}%`, change: "leads → clients", tone: "neutral" }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Derniers contacts"
          action={
            <Link href="/admin/contacts" className="text-xs text-ink-2 transition hover:text-ink">
              Tout voir
            </Link>
          }
          bodyClassName="p-0"
        >
          {recentContacts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun contact pour l'instant.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentContacts.map((c) => {
                const cs = contactStatus[c.status];
                return (
                  <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                      <p className="truncate text-xs text-ink-3">{c.company ?? "—"}</p>
                    </div>
                    <StatusPill tone={cs.tone}>{cs.label}</StatusPill>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Notes récentes" bodyClassName="p-0">
          {recentNotes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-3">Aucune note pour l'instant.</p>
          ) : (
            <div className="divide-y divide-line">
              {recentNotes.map((n) => (
                <div key={n.id} className="px-5 py-3.5">
                  <p className="truncate text-xs font-medium text-ink-2">
                    {contactById.get(n.contactId)?.name ?? "Contact supprimé"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink">{n.content}</p>
                  <p className="mt-1 text-xs text-ink-4">{new Date(n.createdAt).toLocaleString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
