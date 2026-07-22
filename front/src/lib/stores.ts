import { activeStore, products as mockProducts } from "@/data/mock-commerce";
import { mapProduct, mapStore } from "@/lib/commerce";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Product, Store } from "@/types/commerce";

// Résout une boutique publique par slug.
// - En production (Supabase configuré) : lecture réelle. La RLS n'expose que les
//   boutiques `published` aux visiteurs anonymes.
// - En développement sans Supabase : jeu de démonstration local, avec aperçu des
//   brouillons quand `preview` est vrai.
export async function getStoreBySlug(
  slug: string,
  { preview = false }: { preview?: boolean } = {},
): Promise<{ store: Store; products: Product[] } | null> {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const { data: storeRow } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (storeRow) {
      if (!preview && storeRow.status !== "published") return null;
      const { data: productRows } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeRow.id)
        .order("created_at", { ascending: true });
      const products = (productRows ?? [])
        .map(mapProduct)
        .filter((product) => preview || product.status !== "draft");
      return { store: mapStore(storeRow), products };
    }

    // Introuvable côté base : en production on renvoie 404. En dev on autorise
    // le repli sur la boutique de démonstration (preview).
    if (!preview) return null;
  }

  if (slug !== activeStore.slug) return null;
  if (!preview && activeStore.status !== "published") return null;
  return {
    store: activeStore,
    products: preview ? mockProducts : mockProducts.filter((product) => product.status !== "draft"),
  };
}
