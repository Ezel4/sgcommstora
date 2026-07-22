import { CrmBoard } from "@/components/admin/CrmBoard";
import { getCrmData } from "@/lib/crm";

export default async function AdminClientsPage() {
  const { contacts, notesByContact } = await getCrmData();

  return (
    <CrmBoard
      contacts={contacts}
      notesByContact={notesByContact}
      statusFilter="client"
      heading="Clients actifs Sigmood IA."
    />
  );
}
