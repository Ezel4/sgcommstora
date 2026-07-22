import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { getOrders } from "@/lib/commerce";

export default async function Page() {
  const { orders } = await getOrders();
  return <OrdersTable orders={orders} />;
}
