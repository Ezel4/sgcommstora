"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
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

// Délai minimum de remplissage (anti-bot) et durée de validité du formulaire.
const MIN_FILL_MS = 1_500;
const MAX_FILL_MS = 2 * 60 * 60 * 1_000;

// Dérive une empreinte stable et non réversible de l'IP cliente. On ne stocke
// jamais l'IP en clair : seul ce hash sert au rate-limit côté base.
async function clientIpHash(): Promise<string | null> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || store.get("x-real-ip")?.trim();
  if (!ip) return null;
  const salt = process.env.LEAD_HASH_SALT ?? "stora-lead-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function submitLeadForm(formData: FormData, source: string): Promise<ActionResult> {
  try {
    if (!hasSupabaseConfig()) {
      return { ok: false, error: "Le formulaire est temporairement indisponible." };
    }
    if (!ALLOWED_LEAD_SOURCES.has(source)) {
      return { ok: false, error: "La source de la demande est invalide." };
    }

    // Honeypot : champ caché qui doit rester vide. Rempli => bot. On répond OK
    // pour ne pas signaler au bot que sa soumission a été rejetée.
    const honeypot = formData.get("company_website");
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      return { ok: true };
    }

    // Contrôle de timing : soumission trop rapide (bot) ou formulaire périmé.
    const startedAt = Number(formData.get("form_ts"));
    if (Number.isFinite(startedAt) && startedAt > 0) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
        return { ok: false, error: "Formulaire expiré, recharge la page et réessaie." };
      }
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
    const ipHash = await clientIpHash();

    const { error } = await supabase.rpc("submit_lead_form", {
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_company: "",
      p_source: source,
      p_ip_hash: ipHash ?? undefined,
    });

    if (error) {
      // Le quota anti-abus lève une erreur applicative dédiée (code P0001).
      if (error.code === "P0001") {
        return { ok: false, error: "Trop de demandes. Réessaie dans un moment." };
      }
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
