"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function signOut() {
  if (!hasSupabaseConfig()) redirect("/");
  const supabase = await createClient();
  // Le menu du compte ferme uniquement la session de cet appareil. Une
  // déconnexion globale doit rester une action de sécurité distincte et
  // confirmée explicitement par l'utilisateur.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}

export async function signOutEverywhere() {
  if (!hasSupabaseConfig()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/");
}
