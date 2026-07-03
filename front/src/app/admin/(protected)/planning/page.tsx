import { PlanningCalendar } from "@/components/admin/PlanningCalendar";
import { getAppointments, getCrmData } from "@/lib/crm";

export default async function AdminPlanningPage() {
  const [{ contacts }, appointments] = await Promise.all([getCrmData(), getAppointments()]);

  return <PlanningCalendar appointments={appointments} contacts={contacts} />;
}
