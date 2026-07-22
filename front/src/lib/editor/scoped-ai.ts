// -----------------------------------------------------------------------------
// IA contextuelle ciblée — contrat d'échange + moteur SIMULÉ.
//
// Aucune API de génération n'est branchée dans ce dépôt : ce module fournit une
// simulation locale, déterministe et clairement identifiée (`simulated: true`).
// L'interface (AiEditRequest / AiEditResponse) est le contrat qu'une vraie API
// devra respecter : elle reçoit uniquement le bloc sélectionné et ses champs
// autorisés, et renvoie un JSON strict validé par validateScopedAiChanges.
// -----------------------------------------------------------------------------

import type { ElementReference, StoreBlock, StoreDocument } from "./document-schema";
import { findBlock, findSection } from "./document-schema";
import { getBlockDefinition } from "./section-definitions";
import { truncateAtWord } from "./sanitize";

export interface AiEditRequest {
  store: {
    name: string;
    industry: string;
    targetAudience: string;
    locale: string;
  };
  selection: {
    pageId: string;
    sectionId: string;
    blockId: string;
    blockType: string;
    allowedFields: string[];
    currentContent: Record<string, string>;
    maxLengths: Record<string, number>;
  };
  instruction: string;
}

export interface AiEditResponse {
  blockId: string;
  changes: { field: string; newValue: string }[];
  explanation: string;
  /** Toujours vrai tant qu'aucune API réelle n'est branchée. */
  simulated: boolean;
}

/**
 * Construit le contexte minimal envoyé à l'IA : uniquement le bloc sélectionné,
 * ses champs autorisés et l'identité de la boutique — jamais le site entier.
 *
 * `liveContent` (optionnel) laisse le client fournir les valeurs actuellement
 * affichées dans le canvas pour les champs autorisés. Le document serveur (qui
 * peut être une version persistée légèrement en retard sur la frappe en cours,
 * ou même le squelette par défaut en mode démo sans backend) reste la seule
 * source de vérité pour la STRUCTURE (quels champs existent et sont éditables) ;
 * seules les VALEURS de contexte sont rafraîchies par `liveContent`, pour que
 * l'IA parte du texte que le marchand voit vraiment, pas d'une copie obsolète.
 */
export function buildAiEditRequest(params: {
  document: StoreDocument;
  selection: ElementReference;
  store: { name: string; niche: string; audience: string };
  instruction: string;
  liveContent?: Record<string, string>;
}): AiEditRequest | null {
  const { document, selection, store, instruction, liveContent } = params;
  const section = findSection(document, selection.pageId, selection.sectionId);
  const blockItem = findBlock(document, selection);
  if (!section || !blockItem) return null;

  const definition = getBlockDefinition(section.type, blockItem.type);
  if (!definition) return null;

  const allowedFields = Object.keys(definition.editableFields).filter(
    (fieldId) => blockItem.content[fieldId]?.editable,
  );
  const currentContent: Record<string, string> = {};
  const maxLengths: Record<string, number> = {};
  for (const fieldId of allowedFields) {
    const live = liveContent?.[fieldId];
    currentContent[fieldId] = typeof live === "string" ? live : (blockItem.content[fieldId]?.value ?? "");
    maxLengths[fieldId] = definition.editableFields[fieldId].maxLength;
  }

  return {
    store: {
      name: store.name,
      industry: store.niche,
      targetAudience: store.audience,
      locale: document.locale,
    },
    selection: {
      pageId: selection.pageId,
      sectionId: selection.sectionId,
      blockId: blockItem.id,
      blockType: blockItem.type,
      allowedFields,
      currentContent,
      maxLengths,
    },
    instruction,
  };
}

// --- Simulation locale -------------------------------------------------------

type Intent = "premium" | "shorten" | "clarify" | "conversion" | "reassure" | "urgency" | "fix" | "generic";

function detectIntent(instruction: string): Intent {
  const text = instruction.toLowerCase();
  if (/(premium|haut de gamme|luxe|élégan|elegan)/.test(text)) return "premium";
  if (/(raccourci|court|concis|bref)/.test(text)) return "shorten";
  if (/(clair|simple|simplifi|compréhensible)/.test(text)) return "clarify";
  if (/(conversion|convainc|vend|cta|action)/.test(text)) return "conversion";
  if (/(rassur|confiance)/.test(text)) return "reassure";
  if (/(urgence|urgent|maintenant)/.test(text)) return "urgency";
  if (/(faute|orthographe|corrige|grammaire)/.test(text)) return "fix";
  return "generic";
}

const PREMIUM_SWAPS: [RegExp, string][] = [
  [/\bdécouvrez\b/gi, "explorez"],
  [/\bproduits\b/gi, "créations"],
  [/\bchoisi\b/gi, "sélectionné"],
  [/\bbien\b/gi, "avec soin"],
];

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function transformValue(intent: Intent, fieldId: string, value: string, maxLength: number, storeName: string): string {
  const isButton = /button/i.test(fieldId);
  const isLong = value.length > 80;
  let next = value.trim();
  if (!next) return next;

  switch (intent) {
    case "premium": {
      for (const [pattern, replacement] of PREMIUM_SWAPS) next = next.replace(pattern, replacement);
      if (isButton) next = "Explorer la collection";
      else if (fieldId === "eyebrow") next = `${storeName} — Maison de sélection`;
      else if (isLong || /description|answer|quote|about/.test(fieldId)) {
        next = `${ensureSentence(next)} Une attention portée à chaque détail.`;
      }
      break;
    }
    case "shorten": {
      const firstSentence = next.split(/(?<=[.!?])\s+/)[0] ?? next;
      next = truncateAtWord(firstSentence, Math.max(24, Math.round(next.length * 0.6)));
      break;
    }
    case "clarify": {
      next = next.replace(/\b(vraiment|tout simplement|absolument|assez|plutôt)\b\s*/gi, "");
      next = next.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
      break;
    }
    case "conversion": {
      if (isButton) next = "Je découvre";
      else if (/heading|title|question/.test(fieldId)) next = ensureSentence(next).replace(/\.$/, "");
      else next = `${ensureSentence(next)} Faites le premier pas dès aujourd’hui.`;
      break;
    }
    case "reassure": {
      if (!isButton) next = `${ensureSentence(next)} Nous vous accompagnons à chaque étape.`;
      break;
    }
    case "urgency": {
      // Urgence sans inventer de rareté, de promotion ni de date.
      if (isButton) next = "J’en profite maintenant";
      else next = `${ensureSentence(next)} C’est le moment de vous lancer.`;
      break;
    }
    case "fix": {
      next = next.replace(/\s{2,}/g, " ").trim();
      next = next.charAt(0).toUpperCase() + next.slice(1);
      break;
    }
    case "generic": {
      next = ensureSentence(next);
      break;
    }
  }

  return truncateAtWord(next, maxLength);
}

const INTENT_EXPLANATIONS: Record<Intent, string> = {
  premium: "Vocabulaire élevé et ton plus exclusif, sans modifier les faits.",
  shorten: "Textes resserrés sur l’essentiel.",
  clarify: "Formulations directes, mots de remplissage supprimés.",
  conversion: "Bénéfice mis en avant et appel à l’action plus engageant.",
  reassure: "Ton plus rassurant et accompagnant.",
  urgency: "Invitation à agir maintenant, sans inventer de rareté ni de promotion.",
  fix: "Nettoyage typographique et orthographique léger.",
  generic: "Reformulation légère en respectant le message d’origine.",
};

/**
 * Simule une réponse IA pour le bloc sélectionné. Déterministe : mêmes
 * entrées, même proposition. Ne touche que `selection.allowedFields`.
 */
export function simulateScopedAiEdit(request: AiEditRequest): AiEditResponse {
  const intent = detectIntent(request.instruction);
  const changes: AiEditResponse["changes"] = [];

  for (const fieldId of request.selection.allowedFields) {
    const current = request.selection.currentContent[fieldId] ?? "";
    const maxLength = request.selection.maxLengths[fieldId] ?? 200;
    const next = transformValue(intent, fieldId, current, maxLength, request.store.name);
    if (next && next !== current) {
      changes.push({ field: fieldId, newValue: next });
    }
  }

  return {
    blockId: request.selection.blockId,
    changes,
    explanation: INTENT_EXPLANATIONS[intent],
    simulated: true,
  };
}

/** Latence artificielle : montre les états de chargement + annulation. */
export function simulateLatency(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 900);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Génération annulée", "AbortError"));
    });
  });
}

export function isBlockAiEditable(document: StoreDocument, selection: ElementReference): boolean {
  const section = findSection(document, selection.pageId, selection.sectionId);
  const blockItem: StoreBlock | null = findBlock(document, selection);
  if (!section || !blockItem) return false;
  const definition = getBlockDefinition(section.type, blockItem.type);
  if (!definition) return false;
  return Object.keys(definition.editableFields).some((fieldId) => blockItem.content[fieldId]?.editable);
}
