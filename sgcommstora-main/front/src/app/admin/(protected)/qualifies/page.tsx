import { CrmBoard } from "@/components/admin/CrmBoard";
import { getCrmData } from "@/lib/crm";

export default async function AdminQualifiedPage() {
  const { contacts, notesByContact } = await getCrmData();

  return (
    <CrmBoard
      contacts={contacts}
      notesByContact={notesByContact}
      statusFilter="qualified"
      heading="Prospects qualifiés, prêts à signer."
    />
  );
}
