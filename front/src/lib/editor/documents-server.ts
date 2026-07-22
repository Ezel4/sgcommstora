// -----------------------------------------------------------------------------
// Accès serveur aux documents de boutique (brouillon et publication).
//
// Deux tables distinctes pour ne jamais exposer un brouillon au public :
//   • store_drafts       → propriétaire uniquement (RLS) ;
//   • store_publications → lisible publiquement quand la boutique est publiée.
//
// Tout JSON relu depuis la base repasse par mergeSubmittedDocument : même si
// la donnée stockée était corrompue ou ancienne, le rendu part toujours d'un
// document canonique et sûr.
// -----------------------------------------------------------------------------

import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/types/commerce";
import type { StoreDocument } from "./document-schema";
import { buildDefaultDocument, type StoreSeed } from "./default-document";
import { mergeSubmittedDocument } from "./validate-document";

export function toStoreSeed(store: Store): StoreSeed {
  return { id: store.id, name: store.name, slug: store.slug, niche: store.niche, audience: store.audience };
}

export interface DraftState {
  document: StoreDocument;
  /** Version du brouillon persisté (0 si aucun brouillon en base). */
  draftVersion: number;
  publishedVersion: number | null;
  publishedAt: string | null;
  /** "supabase" si la sauvegarde serveur est disponible, sinon "local". */
  persistence: "supabase" | "local";
}

/** Document publié d'une boutique, ou document par défaut à défaut. */
export async function loadPublishedDocument(store: Store): Promise<StoreDocument> {
  const seed = toStoreSeed(store);
  if (!hasSupabaseConfig()) return buildDefaultDocument(seed);

  const supabase = await createClient();
  const { data } = await supabase
    .from("store_publications")
    .select("document, version")
    .eq("store_id", store.id)
    .maybeSingle();

  if (!data?.document) return buildDefaultDocument(seed);
  const { document } = mergeSubmittedDocument(seed, data.document);
  document.version = data.version ?? 0;
  return document;
}

/** État initial de l'éditeur : brouillon s'il existe, sinon publication, sinon défaut. */
export async function loadDraftState(store: Store): Promise<DraftState> {
  const seed = toStoreSeed(store);
  if (!hasSupabaseConfig()) {
    return {
      document: buildDefaultDocument(seed),
      draftVersion: 0,
      publishedVersion: null,
      publishedAt: null,
      persistence: "local",
    };
  }

  const supabase = await createClient();
  const [draftRes, publicationRes] = await Promise.all([
    supabase.from("store_drafts").select("document, version").eq("store_id", store.id).maybeSingle(),
    supabase.from("store_publications").select("document, version, published_at").eq("store_id", store.id).maybeSingle(),
  ]);

  const source = draftRes.data?.document ?? publicationRes.data?.document ?? null;
  const { document } = mergeSubmittedDocument(seed, source ?? {});
  document.version = draftRes.data?.version ?? 0;

  return {
    document,
    draftVersion: draftRes.data?.version ?? 0,
    publishedVersion: publicationRes.data?.version ?? null,
    publishedAt: publicationRes.data?.published_at ?? null,
    persistence: "supabase",
  };
}
