"use server";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import {
  assertEmail,
  assertPhone,
  isValidationError,
  readOptionalString,
  readRequiredString,
} from "@/lib/validation";
import type { ActionResult } from "@/types/actions";

const ALLOWED_LEAD_SOURCES = new Set(["pub-formulaire"]);

export async function submitLeadForm(formData: FormData, source: string): Promise<ActionResult> {
  try {
    // Cette action alimente uniquement la simulation publicitaire locale. Elle
    // restera fermée en production tant qu'un anti-abus n'est pas en place.
    if (process.env.NODE_ENV !== "development") {
      return { ok: false, error: "Le formulaire est temporairement indisponible." };
    }
    if (!hasSupabaseConfig()) {
      return { ok: false, error: "Le formulaire est temporairement indisponible." };
    }
    if (!ALLOWED_LEAD_SOURCES.has(source)) {
      return { ok: false, error: "La source de la demande est invalide." };
    }

    const name = readRequiredString(formData, "name", "Le nom", 120);
    const email = readOptionalString(formData, "email", "L’email", 254).toLowerCase();
    const phone = readOptionalString(formData, "phone", "Le téléphone", 40);
    assertEmail(email);
    assertPhone(phone);
    if (!email && !phone) {
      return { ok: false, error: "Renseigne un email ou un numéro de téléphone." };
    }

    const supabase = await createClient();

    const { error } = await supabase.rpc("submit_lead_form", {
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_company: "",
      p_source: source,
    });

    if (error) {
      console.error("Échec de la collecte du lead", error);
      return { ok: false, error: "La demande n’a pas pu être enregistrée. Réessaie." };
    }
    return { ok: true };
  } catch (error) {
    if (isValidationError(error)) return { ok: false, error: error.message };
    console.error("Échec inattendu de la collecte du lead", error);
    return { ok: false, error: "Une erreur est survenue. Réessaie." };
  }
}
