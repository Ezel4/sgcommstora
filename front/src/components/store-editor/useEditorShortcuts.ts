"use client";

// Raccourcis clavier globaux de l'éditeur (§30). Désactivés quand le focus est
// dans un champ de saisie, sauf Échap (désélection) qui reste toujours actif.

import { useEffect } from "react";
import { useEditor } from "./editor-store";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

export function useEditorShortcuts(onSave: () => void) {
  const { state, dispatch } = useEditor();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;

      if (event.key === "Escape") {
        if (state.previewMode) dispatch({ type: "SET_PREVIEW", preview: false });
        else dispatch({ type: "SELECT", selection: null });
        return;
      }

      if (isTypingTarget(event.target)) return;

      if (meta && event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onSave();
        return;
      }
      if (event.key.toLowerCase() === "p") {
        dispatch({ type: "SET_PREVIEW", preview: !state.previewMode });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, onSave, state.previewMode]);
}
