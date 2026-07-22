import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { orders } from "@/data/mock-commerce";

export default function Page() {
  return <OrdersTable orders={orders} />;
}
