// -----------------------------------------------------------------------------
// Protocole de communication éditeur ↔ canvas (iframe).
//
// L'aperçu de la boutique est isolé dans une iframe même-origine : les styles
// de la boutique ne fuient pas dans le dashboard et inversement. Les deux
// côtés n'échangent que des événements typés via postMessage ; l'origine et
// une signature de canal sont vérifiées à la réception. Aucun code reçu n'est
// jamais exécuté : uniquement de la donnée.
// -----------------------------------------------------------------------------

import type { ElementReference, StoreBlock, StoreDocument } from "./document-schema";
import type { StorefrontProduct, StorefrontStore } from "@/components/storefront/storefront-data";

export const SIGMOOD_CHANNEL = "sigmood-editor" as const;

export type ViewportMode = "desktop" | "tablet" | "mobile";

/**
 * Sélection active de l'éditeur.
 * - `block` : un bloc éditable (référencé par identifiants stables) ;
 * - `section` : une section entière (depuis l'arborescence) ;
 * - `dynamic` : un contenu dynamique (produits, nom de boutique) — non éditable
 *   ici, le panneau renvoie vers le module concerné.
 */
export type EditorSelection =
  | { kind: "block"; ref: ElementReference }
  | { kind: "section"; pageId: string; sectionId: string }
  | { kind: "dynamic"; pageId: string; sectionId: string | null; label: string }
  | null;

export type CanvasToEditorEvent =
  | { type: "CANVAS_READY" }
  | { type: "ELEMENT_SELECTED"; payload: ElementReference }
  | { type: "DYNAMIC_CONTENT_SELECTED"; payload: { pageId: string; sectionId: string | null; label: string } }
  | { type: "SELECTION_CLEARED" }
  /** Barre flottante du bloc : ouvrir l'onglet Contenu ou Modifier avec l'IA. */
  | { type: "BLOCK_ACTION"; payload: { action: "content" | "ai"; ref: ElementReference } };

export type EditorToCanvasEvent =
  | {
      type: "LOAD_DOCUMENT";
      payload: { document: StoreDocument; pageId: string; store: StorefrontStore; products: StorefrontProduct[] };
    }
  | { type: "SET_SELECTION"; payload: EditorSelection }
  | { type: "UPDATE_BLOCK"; payload: { pageId: string; sectionId: string; block: StoreBlock } }
  | { type: "SET_SECTION_VISIBILITY"; payload: { pageId: string; sectionId: string; visible: boolean } }
  | { type: "SET_EDIT_MODE"; payload: { editing: boolean } };

interface Envelope<T> {
  channel: typeof SIGMOOD_CHANNEL;
  event: T;
}

export function postToCanvas(frame: HTMLIFrameElement | null, event: EditorToCanvasEvent) {
  frame?.contentWindow?.postMessage(
    { channel: SIGMOOD_CHANNEL, event } satisfies Envelope<EditorToCanvasEvent>,
    window.location.origin,
  );
}

export function postToEditor(event: CanvasToEditorEvent) {
  window.parent?.postMessage(
    { channel: SIGMOOD_CHANNEL, event } satisfies Envelope<CanvasToEditorEvent>,
    window.location.origin,
  );
}

/**
 * Extrait un événement d'un MessageEvent, ou null si le message ne vient pas
 * de notre canal même-origine. Ne jette jamais.
 */
export function readEnvelope<T>(message: MessageEvent): T | null {
  if (message.origin !== window.location.origin) return null;
  const data = message.data as Partial<Envelope<T>> | null;
  if (!data || typeof data !== "object" || data.channel !== SIGMOOD_CHANNEL) return null;
  return (data.event as T) ?? null;
}
