import { CrmBoard } from "@/components/admin/CrmBoard";
import { getCrmData } from "@/lib/crm";

export default async function AdminContactsPage() {
  const { contacts, notesByContact } = await getCrmData();

  return (
    <CrmBoard
      contacts={contacts}
      notesByContact={notesByContact}
      heading="Tous les contacts, tous statuts confondus."
    />
  );
}
