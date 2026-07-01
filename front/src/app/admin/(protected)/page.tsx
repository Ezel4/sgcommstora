import { CrmBoard } from "@/components/admin/CrmBoard";
import { mapContact, mapNote } from "@/lib/crm";
import { createClient } from "@/lib/supabase/server";
import type { ContactNote } from "@/types/crm";

export default async function AdminCrmPage() {
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

  return <CrmBoard contacts={contacts} notesByContact={notesByContact} />;
}
