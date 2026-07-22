import { CrmBoard } from "@/components/admin/CrmBoard";
import { getCrmData } from "@/lib/crm";

export default async function AdminContactedPage() {
  const { contacts, notesByContact } = await getCrmData();

  return (
    <CrmBoard
      contacts={contacts}
      notesByContact={notesByContact}
      statusFilter="contacted"
      heading="Contacts déjà en discussion."
    />
  );
}
