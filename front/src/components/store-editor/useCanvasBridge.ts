"use client";

// Pont éditeur ↔ canvas (iframe).
//
// - Envoie le document, la sélection, le mode d'édition et les mises à jour de
//   bloc au canvas via postMessage (canal signé même-origine).
// - Reçoit les sélections effectuées dans le canvas et les traduit en actions
//   du store. Valide toujours l'origine (readEnvelope).
//
// Le document complet n'est renvoyé qu'au chargement (CANVAS_READY) et au
// changement de page ; ensuite seules les mises à jour ciblées de bloc sont
// transmises, pour ne pas recharger toute la boutique à chaque frappe.

import { useCallback, useEffect, useRef } from "react";
import { findBlock, findPage } from "@/lib/editor/document-schema";
import type { CanvasToEditorEvent } from "@/lib/editor/messaging";
import { postToCanvas, readEnvelope } from "@/lib/editor/messaging";
import { useEditor } from "./editor-store";

export function useCanvasBridge(frameRef: React.RefObject<HTMLIFrameElement | null>) {
  const { state, dispatch, init } = useEditor();
  const readyRef = useRef(false);
  const lastPageRef = useRef<string | null>(null);

  const loadDocument = useCallback(() => {
    postToCanvas(frameRef.current, {
      type: "LOAD_DOCUMENT",
      payload: {
        document: state.document,
        pageId: state.pageId,
        store: init.storefrontStore,
        products: init.products,
      },
    });
  }, [frameRef, state.document, state.pageId, init.storefrontStore, init.products]);

  // Réception des événements du canvas.
  useEffect(() => {
    function onMessage(message: MessageEvent) {
      const event = readEnvelope<CanvasToEditorEvent>(message);
      if (!event) return;
      switch (event.type) {
        case "CANVAS_READY":
          readyRef.current = true;
          lastPageRef.current = state.pageId;
          loadDocument();
          postToCanvas(frameRef.current, { type: "SET_EDIT_MODE", payload: { editing: !state.previewMode } });
          break;
        case "ELEMENT_SELECTED":
          dispatch({ type: "SELECT", selection: { kind: "block", ref: event.payload } });
          break;
        case "DYNAMIC_CONTENT_SELECTED":
          dispatch({
            type: "SELECT",
            selection: { kind: "dynamic", pageId: event.payload.pageId, sectionId: event.payload.sectionId, label: event.payload.label },
          });
          break;
        case "SELECTION_CLEARED":
          dispatch({ type: "SELECT", selection: null });
          break;
        case "BLOCK_ACTION":
          dispatch({ type: "SELECT", selection: { kind: "block", ref: event.payload.ref } });
          break;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [dispatch, frameRef, loadDocument, state.pageId, state.previewMode]);

  // Changement de page → recharger le document dans le canvas.
  useEffect(() => {
    if (!readyRef.current) return;
    if (lastPageRef.current !== state.pageId) {
      lastPageRef.current = state.pageId;
      loadDocument();
    }
  }, [loadDocument, state.pageId]);

  // Changement structurel (ajout / suppression / déplacement de section) →
  // rechargement complet : la synchro incrémentale par bloc ne peut ni créer
  // ni retirer une section dans le canvas. On ne se déclenche que lorsque la
  // signature d'ordre/identifiants des sections change, pas à chaque frappe.
  const currentPage = findPage(state.document, state.pageId);
  const structureKey = currentPage
    ? [...currentPage.sections].sort((a, b) => a.position - b.position).map((section) => section.id).join("|")
    : "";
  const loadDocumentRef = useRef(loadDocument);
  // La ref est mise à jour dans un effet (jamais pendant le rendu) pour que
  // l'effet structurel, lui, ne dépende que de structureKey.
  useEffect(() => {
    loadDocumentRef.current = loadDocument;
  });
  useEffect(() => {
    if (!readyRef.current) return;
    loadDocumentRef.current();
  }, [structureKey]);

  // Synchroniser la sélection.
  useEffect(() => {
    if (!readyRef.current) return;
    postToCanvas(frameRef.current, { type: "SET_SELECTION", payload: state.selection });
  }, [frameRef, state.selection]);

  // Synchroniser le mode d'édition / prévisualisation.
  useEffect(() => {
    if (!readyRef.current) return;
    postToCanvas(frameRef.current, { type: "SET_EDIT_MODE", payload: { editing: !state.previewMode } });
  }, [frameRef, state.previewMode]);

  // Propager les mises à jour ciblées de bloc (après édition manuelle ou IA)
  // sans recharger tout le document.
  const selectionRef = state.selection?.kind === "block" ? state.selection.ref : null;
  useEffect(() => {
    if (!readyRef.current) return;
    const page = findPage(state.document, state.pageId);
    if (!page) return;
    for (const section of page.sections) {
      for (const block of section.blocks) {
        const current = findBlock(state.document, { pageId: state.pageId, sectionId: section.id, blockId: block.id });
        if (current) {
          postToCanvas(frameRef.current, {
            type: "UPDATE_BLOCK",
            payload: { pageId: state.pageId, sectionId: section.id, block: current },
          });
        }
      }
      postToCanvas(frameRef.current, {
        type: "SET_SECTION_VISIBILITY",
        payload: { pageId: state.pageId, sectionId: section.id, visible: section.visible },
      });
    }
    // On resynchronise à chaque changement de révision du document.
    void selectionRef;
  }, [frameRef, state.document, state.pageId, state.revision, selectionRef]);
}
