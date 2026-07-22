import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig, SUPABASE_CONFIGURATION_MESSAGE } from "@/lib/supabase/config";

export async function requireUser() {
  if (!hasSupabaseConfig()) {
    throw new Error(SUPABASE_CONFIGURATION_MESSAGE);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentification requise.");
  }

  return { supabase, user };
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || !isAdmin) {
    throw new Error("Accès administrateur requis.");
  }

  return { supabase, user };
}

export async function requireAdminPage() {
  if (!hasSupabaseConfig()) {
    redirect("/admin/login?error=configuration");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || !isAdmin) {
    redirect("/dashboard");
  }

  return { supabase, user };
}
