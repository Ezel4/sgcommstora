"use server";

import { redirect } from "next/navigation";
import { COMPANY_SIZES, REFERRAL_SOURCES, SECTORS } from "@/lib/onboarding-options";
import { requireUser } from "@/lib/supabase/auth";
import { isValidationError, readRequiredString } from "@/lib/validation";
import type { ActionResult } from "@/types/actions";

export async function submitOnboarding(formData: FormData): Promise<ActionResult> {
  try {
    const companyName = readRequiredString(formData, "company_name", "Le nom de l’entreprise", 120);
    const companySize = readRequiredString(formData, "company_size", "La taille de l’entreprise", 20);
    const sector = readRequiredString(formData, "sector", "Le secteur", 80);
    const referralSource = readRequiredString(formData, "referral_source", "La provenance", 80);

    if (!COMPANY_SIZES.includes(companySize as (typeof COMPANY_SIZES)[number])) {
      return { ok: false, error: "La taille d’entreprise sélectionnée est invalide." };
    }
    if (!SECTORS.includes(sector as (typeof SECTORS)[number])) {
      return { ok: false, error: "Le secteur sélectionné est invalide." };
    }
    if (!REFERRAL_SOURCES.includes(referralSource as (typeof REFERRAL_SOURCES)[number])) {
      return { ok: false, error: "La provenance sélectionnée est invalide." };
    }

    const { supabase } = await requireUser();

    const { error } = await supabase.rpc("submit_onboarding", {
      p_company_name: companyName,
      p_company_size: companySize,
      p_sector: sector,
      p_referral_source: referralSource,
    });

    if (error) {
      console.error("Échec de l’onboarding Supabase", error);
      return { ok: false, error: "Impossible d’enregistrer ces informations pour le moment." };
    }
  } catch (error) {
    if (isValidationError(error)) return { ok: false, error: error.message };
    console.error("Échec de l’onboarding", error);
    return { ok: false, error: "Ta session a expiré ou le service est indisponible." };
  }

  redirect("/dashboard");
}
