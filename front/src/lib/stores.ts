import { activeStore, products } from "@/data/mock-commerce";

export function getStoreBySlug(slug: string) {
  if (slug !== activeStore.slug) return null;
  return { store: activeStore, products };
}
