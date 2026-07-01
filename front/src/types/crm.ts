export type ContactStatus = "lead" | "contacted" | "qualified" | "client" | "lost";

export interface Contact {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: ContactStatus;
  mrr: number;
  source: string | null;
  companySize: string | null;
  sector: string | null;
  referralSource: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactNote {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
}
