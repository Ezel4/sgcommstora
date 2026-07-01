import { CrmBoard } from "@/components/admin/CrmBoard";
import { getCrmData } from "@/lib/crm";

export default async function AdminLostPage() {
  const { contacts, notesByContact } = await getCrmData();

  return (
    <CrmBoard
      contacts={contacts}
      notesByContact={notesByContact}
      statusFilter="lost"
      heading="Contacts perdus ou sans suite."
    />
  );
}
