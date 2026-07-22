import { Overview } from "@/components/admin/Overview";
import { getCrmData } from "@/lib/crm";
import { requireAdminPage } from "@/lib/supabase/auth";

export default async function AdminOverviewPage() {
  const { contacts, notes } = await getCrmData();
  const { supabase } = await requireAdminPage();
  const { data: userStats, error } = await supabase.rpc("get_user_stats").single();
  if (error) {
    throw new Error("Impossible de charger les statistiques utilisateurs.");
  }

  return <Overview contacts={contacts} notes={notes} userStats={userStats} />;
}
