import { Overview } from "@/components/admin/Overview";
import { getCrmData } from "@/lib/crm";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const { contacts, notes } = await getCrmData();
  const supabase = await createClient();
  const { data: userStats } = await supabase.rpc("get_user_stats").single();

  return <Overview contacts={contacts} notes={notes} userStats={userStats} />;
}
