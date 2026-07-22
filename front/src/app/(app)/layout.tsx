import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getActiveStore } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig, isDevelopmentDemoMode } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Dashboard — Sigmood IA",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseConfig()) {
    if (isDevelopmentDemoMode()) {
      const { store, isDemo } = await getActiveStore();
      return (
        <DashboardShell
          email="demo@stora.ai"
          store={{ name: store.name, slug: store.slug, status: store.status }}
          demoMode={isDemo}
        >
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

  // Données réelles si l'utilisateur possède une boutique, sinon jeu de démo :
  // le bandeau « mode démonstration » ne s'affiche que dans ce dernier cas.
  const { store, isDemo } = await getActiveStore();
  return (
    <DashboardShell
      email={user.email ?? ""}
      store={{ name: store.name, slug: store.slug, status: store.status }}
      demoMode={isDemo}
    >
      {children}
    </DashboardShell>
  );
}
