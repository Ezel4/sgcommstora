import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EditorShell } from "@/components/store-editor/EditorShell";
import { toStorefrontProduct, toStorefrontStore } from "@/components/storefront/storefront-data";
import { getCommerceOverview } from "@/lib/commerce";
import { loadDraftState } from "@/lib/editor/documents-server";
import { hasSupabaseConfig, isDevelopmentDemoMode } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { EditorInit } from "@/components/store-editor/editor-store";

export const metadata: Metadata = {
  title: "Éditeur — Sigmood IA",
};

// Point d'entrée de l'éditeur visuel (Boutique > Modifier). Volontairement en
// dehors du groupe (app) : l'éditeur a son propre shell plein écran (§3), pas
// la navigation du dashboard.
export default async function EditorPage() {
  let ownerEmail = "demo@stora.ai";

  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    ownerEmail = user.email ?? "";
  } else if (!isDevelopmentDemoMode()) {
    redirect("/login?error=configuration");
  }

  const { store, products } = await getCommerceOverview();
  const draftState = await loadDraftState(store);

  const init: EditorInit = {
    store,
    storefrontStore: toStorefrontStore(store),
    products: products.map(toStorefrontProduct),
    document: draftState.document,
    draftVersion: draftState.draftVersion,
    publishedVersion: draftState.publishedVersion,
    publishedAt: draftState.publishedAt,
    persistence: draftState.persistence,
  };

  return <EditorShell init={init} ownerEmail={ownerEmail} />;
}
