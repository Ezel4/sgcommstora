import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { customers } from "@/data/mock-commerce";

export default function Page() {
  return <CustomersTable customers={customers} />;
}
