import { activeStore, products } from "@/data/mock-commerce";

export function getStoreBySlug(slug: string, { preview = false }: { preview?: boolean } = {}) {
  if (slug !== activeStore.slug) return null;
  if (!preview && activeStore.status !== "published") return null;

  return {
    store: activeStore,
    products: preview ? products : products.filter((product) => product.status !== "draft"),
  };
}
