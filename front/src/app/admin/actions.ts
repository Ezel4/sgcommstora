"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContactStatus } from "@/types/crm";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("crm_contacts").insert({
    name,
    company: String(formData.get("company") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    source: String(formData.get("source") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "lead") as ContactStatus) || "lead",
    mrr: Number(formData.get("mrr")) || 0,
  });

  revalidatePath("/admin");
}

export async function updateContactStatus(contactId: string, status: ContactStatus) {
  const supabase = await createClient();
  await supabase
    .from("crm_contacts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", contactId);

  revalidatePath("/admin");
}

export async function deleteContact(contactId: string) {
  const supabase = await createClient();
  await supabase.from("crm_contacts").delete().eq("id", contactId);

  revalidatePath("/admin");
}

export async function addNote(contactId: string, content: string) {
  const trimmed = content.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  await supabase.from("crm_notes").insert({ contact_id: contactId, content: trimmed });
  await supabase
    .from("crm_contacts")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", contactId);

  revalidatePath("/admin");
}

export async function createAppointment(formData: FormData) {
  const contactId = String(formData.get("contact_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim() || "09:00";
  if (!contactId || !title || !date) return;

  const supabase = await createClient();
  await supabase.from("crm_appointments").insert({
    contact_id: contactId,
    title,
    note: String(formData.get("note") ?? "").trim() || null,
    // Le formulaire n'exprime pas de fuseau horaire ("9h" = 9h telle quelle) : on
    // fixe ça en UTC pour que l'heure stockée et affichée ne bouge jamais selon le
    // fuseau du serveur ou du navigateur.
    scheduled_at: `${date}T${time}:00.000Z`,
  });

  revalidatePath("/admin/planning");
}

export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient();
  await supabase.from("crm_appointments").delete().eq("id", appointmentId);

  revalidatePath("/admin/planning");
}
