"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { contactStatusOrder } from "@/lib/crm-status";
import {
  assertEmail,
  assertIdentifier,
  assertPhone,
  isValidationError,
  readNonNegativeNumber,
  readOptionalString,
  readRequiredString,
} from "@/lib/validation";
import type { ActionResult } from "@/types/actions";
import type { ContactStatus } from "@/types/crm";

function failedAction(error: unknown, fallback: string): ActionResult {
  if (isValidationError(error)) return { ok: false, error: error.message };
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createContact(formData: FormData): Promise<ActionResult> {
  try {
    const name = readRequiredString(formData, "name", "Le nom", 120);
    const company = readOptionalString(formData, "company", "L’entreprise", 160);
    const email = readOptionalString(formData, "email", "L’email", 254).toLowerCase();
    const phone = readOptionalString(formData, "phone", "Le téléphone", 40);
    const source = readOptionalString(formData, "source", "La source", 80);
    const statusValue = readOptionalString(formData, "status", "Le statut", 20) || "lead";
    const mrr = readNonNegativeNumber(formData, "mrr", "Le MRR");
    assertEmail(email);
    assertPhone(phone);
    if (!contactStatusOrder.includes(statusValue as ContactStatus)) {
      return { ok: false, error: "Le statut sélectionné est invalide." };
    }

    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("crm_contacts").insert({
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      source: source || null,
      status: statusValue,
      mrr,
    });
    if (error) throw error;

    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible de créer ce contact.");
  }
}

export async function updateContactStatus(contactId: string, status: ContactStatus): Promise<ActionResult> {
  try {
    assertIdentifier(contactId, "Le contact");
    if (!contactStatusOrder.includes(status)) {
      return { ok: false, error: "Le statut sélectionné est invalide." };
    }
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("crm_contacts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", contactId);
    if (error) throw error;

    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible de modifier ce contact.");
  }
}

export async function deleteContact(contactId: string): Promise<ActionResult> {
  try {
    assertIdentifier(contactId, "Le contact");
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("crm_contacts").delete().eq("id", contactId);
    if (error) throw error;

    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible de supprimer ce contact.");
  }
}

export async function addNote(contactId: string, content: string): Promise<ActionResult> {
  try {
    assertIdentifier(contactId, "Le contact");
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 2_000) {
      return { ok: false, error: "La note doit contenir entre 1 et 2 000 caractères." };
    }

    const { supabase } = await requireAdmin();
    const { error: noteError } = await supabase
      .from("crm_notes")
      .insert({ contact_id: contactId, content: trimmed });
    if (noteError) throw noteError;
    const { error: contactError } = await supabase
      .from("crm_contacts")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", contactId);
    if (contactError) throw contactError;

    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible d’ajouter cette note.");
  }
}

export async function createAppointment(formData: FormData): Promise<ActionResult> {
  try {
    const contactId = assertIdentifier(
      readRequiredString(formData, "contact_id", "Le contact", 128),
      "Le contact",
    );
    const title = readRequiredString(formData, "title", "L’objet", 160);
    const date = readRequiredString(formData, "date", "La date", 10);
    const time = readOptionalString(formData, "time", "L’heure", 5) || "09:00";
    const note = readOptionalString(formData, "note", "La note", 2_000);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return { ok: false, error: "La date ou l’heure est invalide." };
    }
    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day
    ) {
      return { ok: false, error: "La date du rendez-vous est invalide." };
    }
    const scheduledAt = `${date}T${time}:00.000Z`;

    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("crm_appointments").insert({
      contact_id: contactId,
      title,
      note: note || null,
      scheduled_at: scheduledAt,
    });
    if (error) throw error;

    revalidatePath("/admin/planning");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible de planifier ce rendez-vous.");
  }
}

export async function deleteAppointment(appointmentId: string): Promise<ActionResult> {
  try {
    assertIdentifier(appointmentId, "Le rendez-vous");
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("crm_appointments").delete().eq("id", appointmentId);
    if (error) throw error;

    revalidatePath("/admin/planning");
    return { ok: true };
  } catch (error) {
    return failedAction(error, "Impossible de supprimer ce rendez-vous.");
  }
}
