// -----------------------------------------------------------------------------
// POST /api/editor/publish — publie le brouillon courant.
//
// La publication est une action explicite et distincte de la sauvegarde :
// elle copie le document (revalidé) dans store_publications, seule table lue
// par la boutique publique. Le brouillon n'est jamais visible du public tant
// que cette route n'a pas été appelée.
// -----------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { toStoreSeed } from "@/lib/editor/documents-server";
import { mergeSubmittedDocument } from "@/lib/editor/validate-document";
import { mapStore } from "@/lib/commerce-mappers";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "Publication indisponible : Supabase n’est pas configuré." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let body: { storeId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }
  const storeId = typeof body.storeId === "string" ? body.storeId : null;
  if (!storeId) {
    return NextResponse.json({ error: "storeId manquant." }, { status: 400 });
  }

  const { data: storeRow } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!storeRow) {
    return NextResponse.json({ error: "Boutique introuvable ou accès refusé." }, { status: 404 });
  }

  // On publie le brouillon serveur (source de vérité), pas un payload client.
  const { data: draft } = await supabase
    .from("store_drafts")
    .select("document, version")
    .eq("store_id", storeId)
    .maybeSingle();
  if (!draft?.document) {
    return NextResponse.json({ error: "Aucun brouillon à publier. Enregistrez d’abord vos modifications." }, { status: 409 });
  }

  const store = mapStore(storeRow);
  const { document } = mergeSubmittedDocument(toStoreSeed(store), draft.document);

  const { data: existingPublication } = await supabase
    .from("store_publications")
    .select("version")
    .eq("store_id", storeId)
    .maybeSingle();
  const nextVersion = (existingPublication?.version ?? 0) + 1;
  const publishedAt = new Date().toISOString();
  document.version = nextVersion;

  const { error } = await supabase.from("store_publications").upsert({
    store_id: storeId,
    document: JSON.parse(JSON.stringify(document)),
    version: nextVersion,
    published_at: publishedAt,
    published_by: user.id,
  });
  if (error) {
    return NextResponse.json({ error: "La publication a échoué." }, { status: 500 });
  }

  // La boutique publique n'est plus fraîche : on invalide son cache.
  revalidatePath(`/boutique/${store.slug}`);

  return NextResponse.json({ version: nextVersion, publishedAt });
}
