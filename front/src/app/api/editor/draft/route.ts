// -----------------------------------------------------------------------------
// PUT /api/editor/draft — enregistre le brouillon de l'éditeur.
//
// Sécurité :
//   • utilisateur authentifié + boutique appartenant à cet utilisateur ;
//   • le document reçu n'est jamais stocké tel quel : il est reconstruit
//     depuis le squelette canonique (mergeSubmittedDocument) — structure,
//     champs verrouillés et longueurs garantis côté serveur ;
//   • verrou optimiste sur `version` : un brouillon modifié dans un autre
//     onglet renvoie 409 au lieu d'être écrasé silencieusement.
// -----------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { toStoreSeed } from "@/lib/editor/documents-server";
import { mergeSubmittedDocument } from "@/lib/editor/validate-document";
import { mapStore } from "@/lib/commerce-mappers";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "Sauvegarde serveur indisponible : Supabase n’est pas configuré." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let body: { storeId?: unknown; document?: unknown; baseVersion?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const storeId = typeof body.storeId === "string" ? body.storeId : null;
  const baseVersion = Number.isInteger(body.baseVersion) ? (body.baseVersion as number) : 0;
  if (!storeId) {
    return NextResponse.json({ error: "storeId manquant." }, { status: 400 });
  }

  // Contrôle de propriété explicite (en plus de la RLS).
  const { data: storeRow } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!storeRow) {
    return NextResponse.json({ error: "Boutique introuvable ou accès refusé." }, { status: 404 });
  }

  const { document, issues } = mergeSubmittedDocument(toStoreSeed(mapStore(storeRow)), body.document);

  const { data: existing } = await supabase
    .from("store_drafts")
    .select("version")
    .eq("store_id", storeId)
    .maybeSingle();

  if (existing && existing.version !== baseVersion) {
    return NextResponse.json(
      { error: "La boutique a été modifiée dans un autre onglet.", conflict: true, currentVersion: existing.version },
      { status: 409 },
    );
  }

  const nextVersion = baseVersion + 1;
  document.version = nextVersion;
  const { error } = await supabase.from("store_drafts").upsert({
    store_id: storeId,
    document: JSON.parse(JSON.stringify(document)),
    version: nextVersion,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: "L’enregistrement du brouillon a échoué." }, { status: 500 });
  }

  return NextResponse.json({ draftVersion: nextVersion, issues });
}
