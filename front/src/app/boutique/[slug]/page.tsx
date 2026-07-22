import { notFound } from "next/navigation";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import { toStorefrontProduct, toStorefrontStore } from "@/components/storefront/storefront-data";
import { findPage } from "@/lib/editor/document-schema";
import { loadPublishedDocument } from "@/lib/editor/documents-server";
import { getStoreBySlug } from "@/lib/stores";

// La boutique publique est rendue depuis son document structuré publié
// (voir src/lib/editor) : la version brouillon de l'éditeur n'apparaît
// jamais ici tant qu'elle n'a pas été publiée explicitement.
export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = process.env.NODE_ENV === "development";
  const data = await getStoreBySlug(slug, { preview });
  if (!data) notFound();
  const { store, products } = data;

  const document = await loadPublishedDocument(store);
  const homePage = findPage(document, "home");
  if (!homePage) notFound();

  return (
    <>
      {preview && (
        <p
          role="status"
          className="mx-auto my-4 max-w-5xl rounded-2xl border border-amber-ink/20 bg-[rgba(36,152,200,0.1)] px-4 py-3 text-center text-sm text-amber-ink"
        >
          Aperçu local — cette boutique et ses produits brouillons ne sont pas publiés.
        </p>
      )}
      <StorefrontView
        page={homePage}
        store={toStorefrontStore(store)}
        products={products.map(toStorefrontProduct)}
      />
    </>
  );
}
