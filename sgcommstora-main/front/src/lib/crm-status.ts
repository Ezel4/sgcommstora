import type { Tone } from "@/components/dashboard/StatusPill";
import type { ContactStatus } from "@/types/crm";

type Entry = { tone: Tone; label: string };

export const contactStatus: Record<ContactStatus, Entry> = {
  lead: { tone: "neutral", label: "Lead" },
  contacted: { tone: "info", label: "Contacté" },
  qualified: { tone: "warning", label: "Qualifié" },
  client: { tone: "positive", label: "Client" },
  lost: { tone: "danger", label: "Perdu" },
};

export const contactStatusOrder: ContactStatus[] = [
  "lead",
  "contacted",
  "qualified",
  "client",
  "lost",
];
