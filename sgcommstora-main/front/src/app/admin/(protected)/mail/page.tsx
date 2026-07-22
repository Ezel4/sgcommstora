import { MailCenter } from "@/components/admin/MailCenter";
import { emailTemplates, emailWorkflows, sentEmails } from "@/data/mock-mail";
import { getCrmData } from "@/lib/crm";

export default async function AdminMailPage() {
  const { contacts } = await getCrmData();

  return (
    <MailCenter
      contacts={contacts}
      templates={emailTemplates}
      initialSentEmails={sentEmails}
      initialWorkflows={emailWorkflows}
    />
  );
}
