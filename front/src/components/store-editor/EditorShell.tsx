"use client";

// Shell complet de l'éditeur (§3, §38). Compose les quatre zones : barre
// supérieure, panneau gauche (pages/sections), canvas central (iframe), panneau
// contextuel droit. Gère aussi le dialogue de publication, les raccourcis
// clavier et le message desktop-first en dessous de la largeur minimale.

import { useEffect, useState } from "react";
import { EditorProvider, useEditor } from "./editor-store";
import type { EditorInit } from "./editor-store";
import { summarizePublishChanges, PublishDialog } from "./PublishDialog";
import { EditorTopbar } from "./EditorTopbar";
import { EditorSidebar } from "./EditorSidebar";
import { EditorCanvas } from "./EditorCanvas";
import { InspectorPanel } from "./InspectorPanel";
import { useEditorPersistence } from "./useEditorPersistence";
import { useEditorShortcuts } from "./useEditorShortcuts";
import { publishStore } from "./editor-api";

function SmallScreenNotice() {
  return (
    <div className="grid min-h-screen place-items-center bg-base px-6 text-center lg:hidden">
      <div className="max-w-sm">
        <p className="text-lg font-medium text-ink">L’éditeur est conçu pour un ordinateur</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Sur mobile ou tablette, revenez avec un écran plus large (1200 px minimum) pour modifier votre boutique.
          Vous pouvez néanmoins consulter l’aperçu depuis le dashboard.
        </p>
      </div>
    </div>
  );
}

function EditorShellInner({ ownerEmail }: { ownerEmail: string }) {
  const { state, dispatch, init } = useEditor();
  const { flush } = useEditorPersistence();
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  useEditorShortcuts(() => void flush());

  // Offline détecté proactivement (pas seulement après échec d'une requête).
  useEffect(() => {
    function goOffline() {
      dispatch({ type: "SAVE_ERROR", message: "Connexion indisponible.", offline: true });
    }
    window.addEventListener("offline", goOffline);
    return () => window.removeEventListener("offline", goOffline);
  }, [dispatch]);

  async function handlePublish() {
    setPublishError(null);
    dispatch({ type: "PUBLISH_START" });
    await flush();
    const result = await publishStore(init.store.id);
    if (!result.ok || result.version == null || !result.publishedAt) {
      dispatch({ type: "PUBLISH_ERROR", message: result.error ?? "La publication a échoué." });
      setPublishError(result.error ?? "La publication a échoué.");
      return;
    }
    dispatch({ type: "PUBLISH_SUCCESS", version: result.version, publishedAt: result.publishedAt });
    setPublishOpen(false);
  }

  const summary = summarizePublishChanges(state.past);

  return (
    <div className="hidden h-screen flex-col overflow-hidden bg-surface-2 lg:flex">
      <EditorTopbar onSave={() => void flush()} onPublish={() => setPublishOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        {!state.previewMode && <EditorSidebar />}
        <EditorCanvas />
        {!state.previewMode && (
          <aside className="flex w-[340px] shrink-0 flex-col border-l border-line bg-surface/70">
            <InspectorPanel />
          </aside>
        )}
      </div>
      {publishOpen && (
        <PublishDialog
          summary={summary}
          lastPublishedAt={state.publishedAt}
          ownerEmail={ownerEmail}
          pending={state.publishing}
          error={publishError}
          onCancel={() => {
            setPublishOpen(false);
            setPublishError(null);
          }}
          onConfirm={() => void handlePublish()}
        />
      )}
    </div>
  );
}

export function EditorShell({ init, ownerEmail }: { init: EditorInit; ownerEmail: string }) {
  return (
    <>
      <SmallScreenNotice />
      <EditorProvider init={init}>
        <EditorShellInner ownerEmail={ownerEmail} />
      </EditorProvider>
    </>
  );
}
