import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig, isDevelopmentDemoMode } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Dashboard — Sigmood IA",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseConfig()) {
    if (isDevelopmentDemoMode()) {
      return (
        <DashboardShell email="demo@stora.ai" demoMode>
          {children}
        </DashboardShell>
      );
    }
    redirect("/login?error=configuration");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Les vues métier utilisent encore des jeux de données locaux. Le bandeau reste
  // donc visible même lorsque l'authentification Supabase est configurée.
  return (
    <DashboardShell email={user.email ?? ""} demoMode>
      {children}
    </DashboardShell>
  );
}
