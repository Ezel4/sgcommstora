"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContactStatus } from "@/types/crm";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
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
