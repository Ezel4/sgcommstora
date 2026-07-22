"use client";

// Client de l'éditeur : appels réseau vers les routes /api/editor.
// Chaque fonction renvoie un résultat typé ; les erreurs réseau/HTTP sont
// converties en objets d'erreur exploitables par l'UI (jamais de throw brut
// non géré côté composant).

import type { StoreDocument } from "@/lib/editor/document-schema";
import type { ValidatedChange } from "@/lib/editor/validate-ai-changes";

export interface SaveDraftResult {
  ok: boolean;
  draftVersion?: number;
  conflict?: boolean;
  currentVersion?: number;
  offline?: boolean;
  error?: string;
}

export async function saveDraft(params: {
  storeId: string;
  document: StoreDocument;
  baseVersion: number;
  signal?: AbortSignal;
}): Promise<SaveDraftResult> {
  try {
    const response = await fetch("/api/editor/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId: params.storeId, document: params.document, baseVersion: params.baseVersion }),
      signal: params.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 409) {
      return { ok: false, conflict: true, currentVersion: data.currentVersion, error: data.error };
    }
    if (!response.ok) {
      return { ok: false, error: data.error ?? "Enregistrement impossible." };
    }
    return { ok: true, draftVersion: data.draftVersion };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "Annulé." };
    }
    return { ok: false, offline: true, error: "Connexion indisponible." };
  }
}

export interface PublishResult {
  ok: boolean;
  version?: number;
  publishedAt?: string;
  error?: string;
}

export async function publishStore(storeId: string): Promise<PublishResult> {
  try {
    const response = await fetch("/api/editor/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, error: data.error ?? "Publication impossible." };
    return { ok: true, version: data.version, publishedAt: data.publishedAt };
  } catch {
    return { ok: false, error: "Connexion indisponible." };
  }
}

export interface AiEditResult {
  ok: boolean;
  blockId?: string;
  changes?: ValidatedChange[];
  rejected?: string[];
  explanation?: string;
  simulated?: boolean;
  error?: string;
}

export async function requestAiEdit(params: {
  storeId: string;
  selection: { pageId: string; sectionId: string; blockId: string };
  instruction: string;
  /** Valeurs actuellement affichées dans le canvas pour ce bloc (contexte frais). */
  currentContent: Record<string, string>;
  signal?: AbortSignal;
}): Promise<AiEditResult> {
  try {
    const response = await fetch("/api/editor/ai-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId: params.storeId,
        selection: params.selection,
        instruction: params.instruction,
        currentContent: params.currentContent,
      }),
      signal: params.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, error: data.error ?? "La génération a échoué." };
    return {
      ok: true,
      blockId: data.blockId,
      changes: data.changes,
      rejected: data.rejected,
      explanation: data.explanation,
      simulated: data.simulated,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "Génération annulée." };
    }
    return { ok: false, error: "Connexion indisponible." };
  }
}
