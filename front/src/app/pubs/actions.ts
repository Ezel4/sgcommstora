"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitLeadForm(formData: FormData, source: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("submit_lead_form", {
    p_name: String(formData.get("name") ?? "").trim(),
    p_email: String(formData.get("email") ?? "").trim(),
    p_phone: String(formData.get("phone") ?? "").trim(),
    p_company: "",
    p_source: source,
  });

  if (error) {
    throw new Error(error.message);
  }
}
