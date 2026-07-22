import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { getProducts } from "@/lib/commerce";

export default async function Page() {
  const { products } = await getProducts();
  return <ProductsTable products={products} />;
}
