import type { Tables } from "@/lib/supabase/database.types";
import type { Contact, ContactNote, ContactStatus } from "@/types/crm";

export function mapContact(row: Tables<"crm_contacts">): Contact {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    status: row.status as ContactStatus,
    mrr: Number(row.mrr),
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapNote(row: Tables<"crm_notes">): ContactNote {
  return {
    id: row.id,
    contactId: row.contact_id,
    content: row.content,
    createdAt: row.created_at,
  };
}
