"use client";

// Sauvegarde automatique du brouillon.
//
// - Debounce après inactivité (le brouillon suit les modifications, jamais la
//   publication, qui reste manuelle).
// - En mode démo (persistence "local"), aucune requête réseau : l'état reste
//   en mémoire et l'UI l'indique clairement.
// - Avertissement avant fermeture si des modifications ne sont pas enregistrées.

import { useCallback, useEffect, useRef } from "react";
import { saveDraft } from "./editor-api";
import { useEditor } from "./editor-store";

const AUTOSAVE_DELAY_MS = 1500;

export function useEditorPersistence() {
  const { state, dispatch, init } = useEditor();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<AbortController | null>(null);
  const isLocal = init.persistence === "local";

  const flush = useCallback(async () => {
    if (isLocal) return;
    if (state.revision === state.savedRevision || state.saving) return;
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    const revisionAtSave = state.revision;

    dispatch({ type: "SAVE_START" });
    const result = await saveDraft({
      storeId: init.store.id,
      document: state.document,
      baseVersion: state.draftVersion,
      signal: controller.signal,
    });
    if (controller.signal.aborted) return;

    if (result.ok && result.draftVersion != null) {
      dispatch({ type: "SAVE_SUCCESS", revision: revisionAtSave, draftVersion: result.draftVersion });
    } else if (result.conflict) {
      dispatch({ type: "SAVE_ERROR", message: "Modifié dans un autre onglet. Rechargez la page." });
    } else if (result.error !== "Annulé.") {
      dispatch({ type: "SAVE_ERROR", message: result.error ?? "Enregistrement impossible.", offline: result.offline });
    }
  }, [dispatch, init.store.id, isLocal, state.document, state.draftVersion, state.revision, state.savedRevision, state.saving]);

  // Auto-save debouncé quand l'état est « dirty ».
  useEffect(() => {
    if (isLocal || state.revision === state.savedRevision) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [flush, isLocal, state.revision, state.savedRevision]);

  // Avertissement de fermeture si des changements ne sont pas enregistrés.
  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isLocal && state.revision !== state.savedRevision) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isLocal, state.revision, state.savedRevision]);

  return { flush, isLocal };
}
