import type { EmailTemplate, EmailWorkflow, SentEmail, WorkflowTrigger } from "@/types/mail";

export const emailTemplates: EmailTemplate[] = [
  {
    id: "tpl_welcome",
    name: "Bienvenue nouveau lead",
    subject: "Bienvenue chez Sigmood !",
    bodyPreview: "Merci pour votre intérêt pour Sigmood IA. Voici comment démarrer votre boutique en quelques minutes…",
  },
  {
    id: "tpl_followup",
    name: "Relance devis",
    subject: "Où en êtes-vous avec votre projet ?",
    bodyPreview: "On voulait prendre des nouvelles de votre projet de boutique — avez-vous des questions ?",
  },
  {
    id: "tpl_client_onboarding",
    name: "Onboarding client",
    subject: "Bienvenue parmi nos clients",
    bodyPreview: "Votre abonnement est actif. Voici les prochaines étapes pour finaliser votre boutique.",
  },
  {
    id: "tpl_winback",
    name: "Relance perdu",
    subject: "On aimerait vous revoir",
    bodyPreview: "Votre projet a changé depuis notre dernier échange ? On serait ravis d'en reparler.",
  },
];

export const sentEmails: SentEmail[] = [
  { id: "mail_001", recipientName: "Nora Lambert", recipientEmail: "nora@example.fr", subject: "Bienvenue chez Sigmood !", sentAtLabel: "Aujourd'hui, 09:14" },
  { id: "mail_002", recipientName: "Karim Belhadj", recipientEmail: "karim@example.fr", subject: "Où en êtes-vous avec votre projet ?", sentAtLabel: "Hier, 17:42" },
  { id: "mail_003", recipientName: "Laura Martin", recipientEmail: "laura@example.fr", subject: "Bienvenue parmi nos clients", sentAtLabel: "Hier, 11:05" },
  { id: "mail_004", recipientName: "Yanis Ferrand", recipientEmail: "yanis@example.fr", subject: "On aimerait vous revoir", sentAtLabel: "Lundi, 15:20" },
];

const triggerLabels: Record<WorkflowTrigger, string> = {
  new_lead: "Nouveau lead créé",
  status_qualified: "Contact passé à Qualifié",
  status_client: "Contact devenu client",
  status_lost: "Contact marqué Perdu",
};

export const workflowTriggerOptions: { value: WorkflowTrigger; label: string }[] = (
  Object.keys(triggerLabels) as WorkflowTrigger[]
).map((value) => ({ value, label: triggerLabels[value] }));

export const emailWorkflows: EmailWorkflow[] = [
  {
    id: "wf_1",
    name: "Bienvenue nouveau lead",
    trigger: "new_lead",
    triggerLabel: triggerLabels.new_lead,
    templateId: "tpl_welcome",
    templateName: "Bienvenue nouveau lead",
    enabled: true,
  },
  {
    id: "wf_2",
    name: "Relance après qualification",
    trigger: "status_qualified",
    triggerLabel: triggerLabels.status_qualified,
    templateId: "tpl_followup",
    templateName: "Relance devis",
    enabled: true,
  },
  {
    id: "wf_3",
    name: "Onboarding nouveaux clients",
    trigger: "status_client",
    triggerLabel: triggerLabels.status_client,
    templateId: "tpl_client_onboarding",
    templateName: "Onboarding client",
    enabled: false,
  },
];
