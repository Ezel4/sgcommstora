"use client";

import { useState } from "react";
import { FilterTab } from "@/components/dashboard/FilterTab";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { IconClose, IconMail, IconPlus } from "@/components/dashboard/icons";
import { workflowTriggerOptions } from "@/data/mock-mail";
import type { Contact } from "@/types/crm";
import type { EmailTemplate, EmailWorkflow, SentEmail, WorkflowTrigger } from "@/types/mail";

type Tab = "envoyer" | "workflows";

export function MailCenter({
  contacts,
  templates,
  initialSentEmails,
  initialWorkflows,
}: {
  contacts: Contact[];
  templates: EmailTemplate[];
  initialSentEmails: SentEmail[];
  initialWorkflows: EmailWorkflow[];
}) {
  const [tab, setTab] = useState<Tab>("envoyer");
  const [sentEmails, setSentEmails] = useState(initialSentEmails);
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);

  const activeWorkflows = workflows.filter((w) => w.enabled).length;
  const contactsWithEmail = contacts.filter((c) => c.email).length;

  function toggleWorkflow(id: string) {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)));
  }

  function addWorkflow(workflow: EmailWorkflow) {
    setWorkflows((prev) => [workflow, ...prev]);
    setShowNewWorkflow(false);
  }

  function addSentEmail(email: SentEmail) {
    setSentEmails((prev) => [email, ...prev]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-ink-3">CRM interne</p>
        <h2 className="text-2xl font-light tracking-tight text-ink">Mail.</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard metric={{ label: "Emails envoyés", value: String(sentEmails.length), change: "30 derniers jours", tone: "neutral" }} />
        <MetricCard metric={{ label: "Taux d'ouverture", value: "42%", change: "estimation", tone: "positive" }} />
        <MetricCard metric={{ label: "Workflows actifs", value: String(activeWorkflows), change: `${workflows.length} au total`, tone: activeWorkflows > 0 ? "positive" : "neutral" }} />
        <MetricCard metric={{ label: "Contacts joignables", value: String(contactsWithEmail), change: "avec email", tone: "neutral" }} />
      </div>

      <Panel
        title={
          <div className="flex flex-wrap items-center gap-2">
            <FilterTab label="Envoyer" active={tab === "envoyer"} onClick={() => setTab("envoyer")} />
            <FilterTab label="Workflows" active={tab === "workflows"} onClick={() => setTab("workflows")} />
          </div>
        }
        action={
          tab === "workflows" ? (
            <button
              type="button"
              onClick={() => setShowNewWorkflow(true)}
              className="btn btn-light !px-3.5 !py-1.5 text-xs"
            >
              <IconPlus className="size-4" /> Nouveau workflow
            </button>
          ) : undefined
        }
        bodyClassName="p-0"
      >
        {tab === "envoyer" ? (
          <ComposeTab contacts={contacts} templates={templates} sentEmails={sentEmails} onSend={addSentEmail} />
        ) : (
          <WorkflowsTab workflows={workflows} onToggle={toggleWorkflow} />
        )}
      </Panel>

      {showNewWorkflow && (
        <NewWorkflowModal templates={templates} onClose={() => setShowNewWorkflow(false)} onCreate={addWorkflow} />
      )}
    </div>
  );
}

function ComposeTab({
  contacts,
  templates,
  sentEmails,
  onSend,
}: {
  contacts: Contact[];
  templates: EmailTemplate[];
  sentEmails: SentEmail[];
  onSend: (email: SentEmail) => void;
}) {
  const [recipientId, setRecipientId] = useState<string>(contacts.find((c) => c.email)?.id ?? "custom");
  const [customEmail, setCustomEmail] = useState("");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [subject, setSubject] = useState(templates[0]?.subject ?? "");
  const [message, setMessage] = useState(templates[0]?.bodyPreview ?? "");

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      setSubject(tpl.subject);
      setMessage(tpl.bodyPreview);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contact = contacts.find((c) => c.id === recipientId);
    const recipientName = contact?.name ?? "Destinataire personnalisé";
    const recipientEmail = contact?.email ?? customEmail;
    if (!recipientEmail || !subject.trim()) return;

    onSend({
      id: `mail_${Date.now()}`,
      recipientName,
      recipientEmail,
      subject: subject.trim(),
      sentAtLabel: "À l'instant",
    });
    setCustomEmail("");
  }

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Destinataire</label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id} disabled={!c.email}>
                  {c.name} {c.email ? `(${c.email})` : "— pas d'email"}
                </option>
              ))}
              <option value="custom">Autre…</option>
            </select>
            {recipientId === "custom" && (
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="destinataire@exemple.com"
                className="mt-2 w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Modèle</label>
            <select
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">Objet</label>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-3">Message</label>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
          />
        </div>

        <button type="submit" className="btn btn-light text-sm">
          <IconMail className="size-4" /> Envoyer (démo)
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-5">
        <h4 className="mb-1 text-sm font-medium text-ink">Historique</h4>
        {sentEmails.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-3">Aucun email envoyé pour l'instant.</p>
        ) : (
          <div className="divide-y divide-line">
            {sentEmails.map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{e.subject}</p>
                  <p className="truncate text-xs text-ink-3">
                    À {e.recipientName} · {e.recipientEmail}
                  </p>
                </div>
                <StatusPill tone="positive">Envoyé</StatusPill>
                <span className="shrink-0 text-xs text-ink-3">{e.sentAtLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowsTab({
  workflows,
  onToggle,
}: {
  workflows: EmailWorkflow[];
  onToggle: (id: string) => void;
}) {
  if (workflows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-ink-3">Aucun workflow pour l'instant.</p>;
  }

  return (
    <div className="divide-y divide-line">
      {workflows.map((w) => (
        <div key={w.id} className="flex items-center gap-4 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{w.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink-3">
              Déclencheur : <span className="text-ink-2">{w.triggerLabel}</span> → Modèle :{" "}
              <span className="text-ink-2">{w.templateName}</span>
            </p>
          </div>
          <StatusPill tone={w.enabled ? "positive" : "neutral"}>{w.enabled ? "Actif" : "Inactif"}</StatusPill>
          <button
            type="button"
            onClick={() => onToggle(w.id)}
            className="btn btn-ghost shrink-0 !px-3.5 !py-1.5 text-xs"
          >
            {w.enabled ? "Désactiver" : "Activer"}
          </button>
        </div>
      ))}
    </div>
  );
}

function NewWorkflowModal({
  templates,
  onClose,
  onCreate,
}: {
  templates: EmailTemplate[];
  onClose: () => void;
  onCreate: (workflow: EmailWorkflow) => void;
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const trigger = formData.get("trigger") as WorkflowTrigger;
    const templateId = String(formData.get("templateId") ?? "");
    const template = templates.find((t) => t.id === templateId);
    const triggerOption = workflowTriggerOptions.find((t) => t.value === trigger);
    if (!name || !template || !triggerOption) return;

    onCreate({
      id: `wf_${Date.now()}`,
      name,
      trigger,
      triggerLabel: triggerOption.label,
      templateId: template.id,
      templateName: template.name,
      enabled: true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-ink">Nouveau workflow</h3>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-3 hover:text-ink">
            <IconClose className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Nom du workflow</label>
            <input
              name="name"
              required
              placeholder="Ex : Relance après devis"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Déclencheur</label>
            <select
              name="trigger"
              defaultValue={workflowTriggerOptions[0]?.value}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              {workflowTriggerOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Modèle</label>
            <select
              name="templateId"
              defaultValue={templates[0]?.id}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink focus:border-line-strong focus:outline-none"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-light w-full !py-2.5 text-sm">
            Créer le workflow
          </button>
        </form>
      </div>
    </div>
  );
}
