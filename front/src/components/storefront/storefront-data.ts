// Sous-ensembles sérialisables passés au renderer de boutique (public + canvas).
// Les données métier (produits, prix, stocks) restent gérées par le module
// Produits : le renderer les affiche, l'éditeur ne les modifie jamais.

import type { Product, Store } from "@/types/commerce";

export type StorefrontStore = Pick<Store, "name" | "slug" | "niche" | "audience">;

export type StorefrontProduct = Pick<Product, "id" | "name" | "category" | "price" | "status">;

export function toStorefrontStore(store: Store): StorefrontStore {
  return { name: store.name, slug: store.slug, niche: store.niche, audience: store.audience };
}

export function toStorefrontProduct(product: Product): StorefrontProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    status: product.status,
  };
}
