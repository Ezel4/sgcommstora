"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("submit_onboarding", {
    p_company_name: String(formData.get("company_name") ?? "").trim(),
    p_company_size: String(formData.get("company_size") ?? "").trim(),
    p_sector: String(formData.get("sector") ?? "").trim(),
    p_referral_source: String(formData.get("referral_source") ?? "").trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
