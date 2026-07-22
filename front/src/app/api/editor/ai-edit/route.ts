// -----------------------------------------------------------------------------
// POST /api/editor/ai-edit — modification IA ciblée d'un bloc.
//
// Aucune API de génération réelle n'est branchée : la route utilise le moteur
// SIMULÉ (scoped-ai) et le signale (`simulated: true`). Elle applique malgré
// tout tout le pipeline de sécurité, pour que le remplacement par une vraie
// API ne change que l'étape de génération :
//   1. auth + propriété de la boutique ;
//   2. reconstruction du document serveur (jamais le payload client) ;
//   3. contexte minimal : uniquement le bloc sélectionné et ses champs ;
//   4. validation stricte du périmètre sur la réponse (validate-ai-changes).
// -----------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { loadDraftState, toStoreSeed } from "@/lib/editor/documents-server";
import { buildAiEditRequest, isBlockAiEditable, simulateScopedAiEdit } from "@/lib/editor/scoped-ai";
import { validateScopedAiChanges } from "@/lib/editor/validate-ai-changes";
import type { ElementReference } from "@/lib/editor/document-schema";
import { buildDefaultDocument } from "@/lib/editor/default-document";
import { mapStore } from "@/lib/commerce-mappers";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { activeStore as demoStore } from "@/data/mock-commerce";

interface AiEditBody {
  storeId?: unknown;
  selection?: Partial<ElementReference>;
  instruction?: unknown;
  /** Valeurs actuellement affichées côté client — voir buildAiEditRequest. */
  currentContent?: unknown;
}

function readSelection(input: Partial<ElementReference> | undefined): ElementReference | null {
  if (!input || typeof input.pageId !== "string" || typeof input.sectionId !== "string" || typeof input.blockId !== "string") {
    return null;
  }
  return { pageId: input.pageId, sectionId: input.sectionId, blockId: input.blockId };
}

function readLiveContent(input: unknown): Record<string, string> | undefined {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return undefined;
  const entries = Object.entries(input as Record<string, unknown>).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export async function POST(request: Request) {
  let body: AiEditBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const selection = readSelection(body.selection);
  const instruction = typeof body.instruction === "string" ? body.instruction.trim() : "";
  if (!selection) {
    return NextResponse.json({ error: "Sélection invalide." }, { status: 400 });
  }
  if (instruction.length < 3) {
    return NextResponse.json({ error: "Décrivez la modification souhaitée." }, { status: 400 });
  }
  if (instruction.length > 500) {
    return NextResponse.json({ error: "La demande est trop longue." }, { status: 400 });
  }

  // Résolution du document et de la boutique — côté serveur, jamais le client.
  let document;
  let store;
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const storeId = typeof body.storeId === "string" ? body.storeId : null;
    if (!storeId) return NextResponse.json({ error: "storeId manquant." }, { status: 400 });

    const { data: storeRow } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!storeRow) return NextResponse.json({ error: "Boutique introuvable ou accès refusé." }, { status: 404 });

    store = mapStore(storeRow);
    document = (await loadDraftState(store)).document;
  } else {
    // Mode démo local : boutique de démonstration + document par défaut.
    store = demoStore;
    document = buildDefaultDocument(toStoreSeed(store));
  }

  if (!isBlockAiEditable(document, selection)) {
    return NextResponse.json({ error: "Ce bloc ne peut pas être modifié avec l’IA." }, { status: 422 });
  }

  const liveContent = readLiveContent(body.currentContent);
  const aiRequest = buildAiEditRequest({ document, selection, store, instruction, liveContent });
  if (!aiRequest) {
    return NextResponse.json({ error: "La sélection n’est plus disponible." }, { status: 422 });
  }

  // >>> Étape à remplacer par un appel LLM réel. Le reste du pipeline est prêt.
  const response = simulateScopedAiEdit(aiRequest);

  const validation = validateScopedAiChanges({
    document,
    selection,
    proposalBlockId: response.blockId,
    proposedChanges: response.changes,
    liveContent,
  });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  return NextResponse.json({
    blockId: validation.blockId,
    changes: validation.changes,
    rejected: validation.rejected,
    explanation: response.explanation,
    simulated: response.simulated,
  });
}
