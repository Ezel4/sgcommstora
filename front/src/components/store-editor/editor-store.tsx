"use client";

// -----------------------------------------------------------------------------
// État central de l'éditeur (contexte + reducer).
//
// Ne vit ici que l'état réellement partagé : document courant, sélection,
// historique, statuts de sauvegarde/publication, viewport, état IA. Les champs
// de formulaire locaux restent dans leurs composants.
//
// Historique : chaque mutation crée une entrée (une ou plusieurs opérations
// champ par champ). Les frappes successives sur un même champ sont regroupées
// en une seule entrée cohérente (coalescing) au lieu d'un snapshot par frappe.
// -----------------------------------------------------------------------------

import { createContext, useContext, useMemo, useReducer } from "react";
import type { ElementReference, StoreDocument, StoreSection } from "@/lib/editor/document-schema";
import {
  findBlock,
  findPage,
  findSection,
  getFieldValue,
  insertSection,
  moveSection,
  removeSection,
  sectionIndex,
  setFieldValue,
  setSectionVisibility,
} from "@/lib/editor/document-schema";
import type { EditorSelection, ViewportMode } from "@/lib/editor/messaging";
import type { AiEditResponse } from "@/lib/editor/scoped-ai";
import type { ValidatedChange } from "@/lib/editor/validate-ai-changes";
import type { StorefrontProduct, StorefrontStore } from "@/components/storefront/storefront-data";
import type { Store } from "@/types/commerce";

// --- Historique --------------------------------------------------------------

export type OperationSource = "manual" | "ai" | "system";

export interface FieldOperation {
  kind: "field";
  pageId: string;
  sectionId: string;
  blockId: string;
  field: string;
  previousValue: string;
  newValue: string;
}

export interface VisibilityOperation {
  kind: "visibility";
  pageId: string;
  sectionId: string;
  previous: boolean;
  next: boolean;
}

export interface AddSectionOperation {
  kind: "add-section";
  pageId: string;
  section: StoreSection;
  index: number;
}

export interface RemoveSectionOperation {
  kind: "remove-section";
  pageId: string;
  section: StoreSection;
  index: number;
}

export interface MoveSectionOperation {
  kind: "move-section";
  pageId: string;
  sectionId: string;
  fromIndex: number;
  toIndex: number;
}

export type EditorOperation =
  | FieldOperation
  | VisibilityOperation
  | AddSectionOperation
  | RemoveSectionOperation
  | MoveSectionOperation;

export interface HistoryEntry {
  id: string;
  label: string;
  source: OperationSource;
  timestamp: number;
  operations: EditorOperation[];
  /** Présent pour les éditions manuelles d'un champ : permet le regroupement. */
  coalesceKey?: string;
}

/** Fenêtre de regroupement des frappes successives sur un même champ. */
const COALESCE_WINDOW_MS = 2000;

// --- État --------------------------------------------------------------------

export type SaveStatus = "saved" | "dirty" | "saving" | "error" | "offline";

export type AiPanelState =
  | { status: "idle" }
  | { status: "generating"; instruction: string }
  | {
      status: "proposal";
      instruction: string;
      response: AiEditResponse;
      changes: ValidatedChange[];
      rejected: string[];
    }
  | { status: "error"; instruction: string; message: string };

export interface EditorInit {
  store: Store;
  storefrontStore: StorefrontStore;
  products: StorefrontProduct[];
  document: StoreDocument;
  draftVersion: number;
  publishedVersion: number | null;
  publishedAt: string | null;
  persistence: "supabase" | "local";
}

export interface EditorState {
  document: StoreDocument;
  /** Document tel qu'au dernier enregistrement — sert au « Réinitialiser ». */
  savedDocument: StoreDocument;
  pageId: string;
  selection: EditorSelection;
  past: HistoryEntry[];
  future: HistoryEntry[];
  revision: number;
  savedRevision: number;
  draftVersion: number;
  saving: boolean;
  saveError: string | null;
  offline: boolean;
  publishing: boolean;
  publishError: string | null;
  publishedVersion: number | null;
  publishedAt: string | null;
  /** Révision publiée : permet d'afficher « modifications non publiées ». */
  publishedRevision: number | null;
  viewport: ViewportMode;
  previewMode: boolean;
  ai: AiPanelState;
}

export type EditorAction =
  | { type: "SELECT"; selection: EditorSelection }
  | { type: "SET_PAGE"; pageId: string }
  | { type: "UPDATE_FIELD"; ref: Omit<ElementReference, "fieldId">; field: string; value: string; source?: OperationSource }
  | { type: "TOGGLE_SECTION_VISIBILITY"; pageId: string; sectionId: string }
  | { type: "ADD_SECTION"; pageId: string; section: StoreSection; index: number }
  | { type: "REMOVE_SECTION"; pageId: string; sectionId: string }
  | { type: "MOVE_SECTION"; pageId: string; sectionId: string; direction: "up" | "down" }
  | { type: "APPLY_AI_CHANGES"; ref: Omit<ElementReference, "fieldId">; changes: ValidatedChange[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_VIEWPORT"; viewport: ViewportMode }
  | { type: "SET_PREVIEW"; preview: boolean }
  | { type: "AI_START"; instruction: string }
  | { type: "AI_PROPOSAL"; instruction: string; response: AiEditResponse; changes: ValidatedChange[]; rejected: string[] }
  | { type: "AI_ERROR"; instruction: string; message: string }
  | { type: "AI_RESET" }
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS"; revision: number; draftVersion: number }
  | { type: "SAVE_ERROR"; message: string; offline?: boolean }
  | { type: "PUBLISH_START" }
  | { type: "PUBLISH_SUCCESS"; version: number; publishedAt: string }
  | { type: "PUBLISH_ERROR"; message: string }
  | { type: "REPLACE_DOCUMENT"; document: StoreDocument; draftVersion: number };

function operationId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `op-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createInitialState(init: EditorInit): EditorState {
  return {
    document: init.document,
    savedDocument: init.document,
    pageId: "home",
    selection: null,
    past: [],
    future: [],
    revision: 0,
    savedRevision: 0,
    draftVersion: init.draftVersion,
    saving: false,
    saveError: null,
    offline: false,
    publishing: false,
    publishError: null,
    publishedVersion: init.publishedVersion,
    publishedAt: init.publishedAt,
    publishedRevision: init.publishedVersion != null ? 0 : null,
    viewport: "desktop",
    previewMode: false,
    ai: { status: "idle" },
  };
}

// --- Application des opérations ----------------------------------------------

function applyOperation(document: StoreDocument, op: EditorOperation, direction: "do" | "undo"): StoreDocument {
  switch (op.kind) {
    case "field": {
      const value = direction === "do" ? op.newValue : op.previousValue;
      return setFieldValue(document, op, op.field, value);
    }
    case "visibility": {
      const visible = direction === "do" ? op.next : op.previous;
      return setSectionVisibility(document, op.pageId, op.sectionId, visible);
    }
    case "add-section":
      return direction === "do"
        ? insertSection(document, op.pageId, op.section, op.index)
        : removeSection(document, op.pageId, op.section.id);
    case "remove-section":
      return direction === "do"
        ? removeSection(document, op.pageId, op.section.id)
        : insertSection(document, op.pageId, op.section, op.index);
    case "move-section":
      return direction === "do"
        ? moveSection(document, op.pageId, op.sectionId, op.toIndex)
        : moveSection(document, op.pageId, op.sectionId, op.fromIndex);
  }
}

function applyEntry(document: StoreDocument, entry: HistoryEntry, direction: "do" | "undo"): StoreDocument {
  const operations = direction === "do" ? entry.operations : [...entry.operations].reverse();
  return operations.reduce((doc, op) => applyOperation(doc, op, direction), document);
}

// --- Reducer -----------------------------------------------------------------

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SELECT": {
      // Changer de sélection abandonne une proposition IA non appliquée.
      const keepAi =
        action.selection?.kind === "block" &&
        state.selection?.kind === "block" &&
        action.selection.ref.blockId === state.selection.ref.blockId;
      return { ...state, selection: action.selection, ai: keepAi ? state.ai : { status: "idle" } };
    }

    case "SET_PAGE": {
      if (action.pageId === state.pageId) return state;
      const page = findPage(state.document, action.pageId);
      // Navigation uniquement vers une page configurée ; jamais dans l'historique.
      if (!page || page.status !== "configured") return state;
      return { ...state, pageId: action.pageId, selection: null, ai: { status: "idle" } };
    }

    case "UPDATE_FIELD": {
      const { ref, field, value } = action;
      const blockItem = findBlock(state.document, ref);
      const fieldMeta = blockItem?.content[field];
      if (!blockItem || !fieldMeta?.editable) return state;
      const previousValue = getFieldValue(blockItem, field);
      if (previousValue === value) return state;

      const source = action.source ?? "manual";
      const coalesceKey = source === "manual" ? `${ref.blockId}:${field}` : undefined;
      const document = setFieldValue(state.document, ref, field, value);

      const last = state.past[state.past.length - 1];
      const now = Date.now();
      if (
        coalesceKey &&
        last?.coalesceKey === coalesceKey &&
        now - last.timestamp < COALESCE_WINDOW_MS &&
        state.future.length === 0
      ) {
        const mergedOp = { ...(last.operations[0] as FieldOperation), newValue: value };
        const merged: HistoryEntry = { ...last, timestamp: now, operations: [mergedOp] };
        return { ...state, document, past: [...state.past.slice(0, -1), merged], revision: state.revision + 1 };
      }

      const entry: HistoryEntry = {
        id: operationId(),
        label: `Modification de « ${field} »`,
        source,
        timestamp: now,
        coalesceKey,
        operations: [{ kind: "field", ...ref, field, previousValue, newValue: value }],
      };
      return { ...state, document, past: [...state.past, entry], future: [], revision: state.revision + 1 };
    }

    case "TOGGLE_SECTION_VISIBILITY": {
      const section = findSection(state.document, action.pageId, action.sectionId);
      if (!section) return state;
      const entry: HistoryEntry = {
        id: operationId(),
        label: section.visible ? "Section masquée" : "Section affichée",
        source: "manual",
        timestamp: Date.now(),
        operations: [
          { kind: "visibility", pageId: action.pageId, sectionId: action.sectionId, previous: section.visible, next: !section.visible },
        ],
      };
      const document = setSectionVisibility(state.document, action.pageId, action.sectionId, !section.visible);
      return { ...state, document, past: [...state.past, entry], future: [], revision: state.revision + 1 };
    }

    case "ADD_SECTION": {
      const entry: HistoryEntry = {
        id: operationId(),
        label: "Section ajoutée",
        source: "manual",
        timestamp: Date.now(),
        operations: [{ kind: "add-section", pageId: action.pageId, section: action.section, index: action.index }],
      };
      const document = applyEntry(state.document, entry, "do");
      // On sélectionne la nouvelle section pour la faire apparaître dans le panneau.
      return {
        ...state,
        document,
        past: [...state.past, entry],
        future: [],
        revision: state.revision + 1,
        selection: { kind: "section", pageId: action.pageId, sectionId: action.section.id },
      };
    }

    case "REMOVE_SECTION": {
      const index = sectionIndex(state.document, action.pageId, action.sectionId);
      const section = findSection(state.document, action.pageId, action.sectionId);
      if (!section || index === -1) return state;
      const entry: HistoryEntry = {
        id: operationId(),
        label: "Section supprimée",
        source: "manual",
        timestamp: Date.now(),
        operations: [{ kind: "remove-section", pageId: action.pageId, section, index }],
      };
      const document = applyEntry(state.document, entry, "do");
      const selectionHitsSection =
        (state.selection?.kind === "section" && state.selection.sectionId === action.sectionId) ||
        (state.selection?.kind === "block" && state.selection.ref.sectionId === action.sectionId) ||
        (state.selection?.kind === "dynamic" && state.selection.sectionId === action.sectionId);
      return {
        ...state,
        document,
        past: [...state.past, entry],
        future: [],
        revision: state.revision + 1,
        selection: selectionHitsSection ? null : state.selection,
      };
    }

    case "MOVE_SECTION": {
      const from = sectionIndex(state.document, action.pageId, action.sectionId);
      if (from === -1) return state;
      const to = action.direction === "up" ? from - 1 : from + 1;
      const page = findPage(state.document, action.pageId);
      if (!page || to < 0 || to >= page.sections.length) return state;
      const entry: HistoryEntry = {
        id: operationId(),
        label: "Section déplacée",
        source: "manual",
        timestamp: Date.now(),
        operations: [{ kind: "move-section", pageId: action.pageId, sectionId: action.sectionId, fromIndex: from, toIndex: to }],
      };
      const document = applyEntry(state.document, entry, "do");
      return { ...state, document, past: [...state.past, entry], future: [], revision: state.revision + 1 };
    }

    case "APPLY_AI_CHANGES": {
      if (action.changes.length === 0) return { ...state, ai: { status: "idle" } };
      const operations: EditorOperation[] = action.changes.map((change) => ({
        kind: "field",
        ...action.ref,
        field: change.field,
        previousValue: change.previousValue,
        newValue: change.newValue,
      }));
      const entry: HistoryEntry = {
        id: operationId(),
        label: "Modification IA",
        source: "ai",
        timestamp: Date.now(),
        operations,
      };
      const document = applyEntry(state.document, entry, "do");
      return {
        ...state,
        document,
        past: [...state.past, entry],
        future: [],
        revision: state.revision + 1,
        ai: { status: "idle" },
      };
    }

    case "UNDO": {
      const entry = state.past[state.past.length - 1];
      if (!entry) return state;
      return {
        ...state,
        document: applyEntry(state.document, entry, "undo"),
        past: state.past.slice(0, -1),
        future: [entry, ...state.future],
        revision: state.revision + 1,
      };
    }

    case "REDO": {
      const [entry, ...rest] = state.future;
      if (!entry) return state;
      return {
        ...state,
        document: applyEntry(state.document, entry, "do"),
        past: [...state.past, entry],
        future: rest,
        revision: state.revision + 1,
      };
    }

    case "SET_VIEWPORT":
      return { ...state, viewport: action.viewport };

    case "SET_PREVIEW":
      return { ...state, previewMode: action.preview, selection: action.preview ? null : state.selection };

    case "AI_START":
      return { ...state, ai: { status: "generating", instruction: action.instruction } };
    case "AI_PROPOSAL":
      return {
        ...state,
        ai: {
          status: "proposal",
          instruction: action.instruction,
          response: action.response,
          changes: action.changes,
          rejected: action.rejected,
        },
      };
    case "AI_ERROR":
      return { ...state, ai: { status: "error", instruction: action.instruction, message: action.message } };
    case "AI_RESET":
      return { ...state, ai: { status: "idle" } };

    case "SAVE_START":
      return { ...state, saving: true, saveError: null, offline: false };
    case "SAVE_SUCCESS":
      return {
        ...state,
        saving: false,
        saveError: null,
        offline: false,
        savedRevision: action.revision,
        draftVersion: action.draftVersion,
        savedDocument: state.document,
      };
    case "SAVE_ERROR":
      return { ...state, saving: false, saveError: action.message, offline: Boolean(action.offline) };

    case "PUBLISH_START":
      return { ...state, publishing: true, publishError: null };
    case "PUBLISH_SUCCESS":
      return {
        ...state,
        publishing: false,
        publishedVersion: action.version,
        publishedAt: action.publishedAt,
        publishedRevision: state.revision,
      };
    case "PUBLISH_ERROR":
      return { ...state, publishing: false, publishError: action.message };

    case "REPLACE_DOCUMENT":
      return {
        ...state,
        document: action.document,
        savedDocument: action.document,
        draftVersion: action.draftVersion,
        past: [],
        future: [],
        selection: null,
        revision: state.revision + 1,
        savedRevision: state.revision + 1,
      };

    default:
      return state;
  }
}

// --- Sélecteurs --------------------------------------------------------------

export function getSaveStatus(state: EditorState, persistence: "supabase" | "local"): SaveStatus {
  if (state.offline) return "offline";
  if (state.saveError) return "error";
  if (state.saving) return "saving";
  if (state.revision !== state.savedRevision) return "dirty";
  void persistence;
  return "saved";
}

export function hasUnpublishedChanges(state: EditorState): boolean {
  if (state.publishedRevision == null) return state.revision > 0 || state.past.length > 0 || state.savedRevision > 0;
  return state.revision !== state.publishedRevision;
}

// --- Contexte ----------------------------------------------------------------

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  init: EditorInit;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ init, children }: { init: EditorInit; children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, init, createInitialState);
  const value = useMemo(() => ({ state, dispatch, init }), [state, init]);
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor doit être utilisé sous <EditorProvider>");
  return context;
}
