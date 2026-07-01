import { Overview } from "@/components/admin/Overview";
import { getCrmData } from "@/lib/crm";

export default async function AdminOverviewPage() {
  const { contacts, notes } = await getCrmData();

  return <Overview contacts={contacts} notes={notes} />;
}
