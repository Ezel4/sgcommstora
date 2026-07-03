import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { Appointment, Contact, ContactNote, ContactStatus } from "@/types/crm";

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
    companySize: row.company_size,
    sector: row.sector,
    referralSource: row.referral_source,
    userId: row.user_id,
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

export async function getCrmData() {
  const supabase = await createClient();

  const [{ data: contactRows }, { data: noteRows }] = await Promise.all([
    supabase.from("crm_contacts").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_notes").select("*").order("created_at", { ascending: false }),
  ]);

  const contacts = (contactRows ?? []).map(mapContact);
  const notes = (noteRows ?? []).map(mapNote);

  const notesByContact = notes.reduce<Record<string, ContactNote[]>>((acc, note) => {
    (acc[note.contactId] ??= []).push(note);
    return acc;
  }, {});

  return { contacts, notes, notesByContact };
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("crm_appointments")
    .select("*, crm_contacts(name)")
    .order("scheduled_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    contactId: row.contact_id,
    contactName: (row.crm_contacts as { name: string } | null)?.name ?? "Contact supprimé",
    title: row.title,
    note: row.note,
    scheduledAt: row.scheduled_at,
    createdAt: row.created_at,
  }));
}
