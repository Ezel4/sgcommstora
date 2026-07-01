import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { products } from "@/data/mock-commerce";

export default function Page() {
  return <ProductsTable products={products} />;
}
