import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { getCustomers } from "@/lib/commerce";

export default async function Page() {
  const { customers } = await getCustomers();
  return <CustomersTable customers={customers} />;
}
