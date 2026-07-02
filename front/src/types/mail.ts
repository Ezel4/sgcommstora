export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyPreview: string;
}

export interface SentEmail {
  id: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  sentAtLabel: string;
}

export type WorkflowTrigger = "new_lead" | "status_qualified" | "status_client" | "status_lost";

export interface EmailWorkflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  triggerLabel: string;
  templateId: string;
  templateName: string;
  enabled: boolean;
}
