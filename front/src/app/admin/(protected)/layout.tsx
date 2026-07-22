import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "CRM — Sigmood IA · Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdminPage();

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
