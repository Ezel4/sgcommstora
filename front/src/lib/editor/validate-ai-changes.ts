// -----------------------------------------------------------------------------
// Protection du périmètre sélectionné pour les modifications IA.
//
// Quelle que soit la qualité du prompt, une proposition IA n'est JAMAIS
// appliquée sans passer par cette validation :
//   1. la sélection existe dans le document actif ;
//   2. la proposition vise exactement le bloc sélectionné (pas un autre id) ;
//   3. chaque champ proposé est déclaré éditable dans la bibliothèque ;
//   4. les valeurs sont des chaînes, nettoyées et bornées ;
//   5. tout contenu dangereux entraîne le rejet du champ.
// La fonction renvoie uniquement des changements sûrs, prêts à appliquer.
// -----------------------------------------------------------------------------

import type { ElementReference, StoreDocument } from "./document-schema";
import { findBlock, findSection, getFieldValue } from "./document-schema";
import { getBlockDefinition } from "./section-definitions";
import { containsDangerousContent, sanitizeText } from "./sanitize";

export interface ProposedChange {
  field: string;
  newValue: string;
}

export interface ValidatedChange {
  field: string;
  fieldLabel: string;
  previousValue: string;
  newValue: string;
}

export type ScopedValidationResult =
  | { ok: true; blockId: string; changes: ValidatedChange[]; rejected: string[] }
  | { ok: false; error: string };

export function validateScopedAiChanges(params: {
  document: StoreDocument;
  selection: ElementReference;
  /** blockId annoncé par la réponse IA — doit être celui de la sélection. */
  proposalBlockId: string;
  proposedChanges: ProposedChange[];
  /**
   * Valeurs actuellement affichées côté client (champ → texte). Utilisées
   * uniquement pour renseigner `previousValue` dans le diff — jamais pour
   * décider si un champ est autorisé : cette décision reste basée sur la
   * structure du document serveur (getBlockDefinition), pas sur ces valeurs.
   */
  liveContent?: Record<string, string>;
}): ScopedValidationResult {
  const { document, selection, proposalBlockId, proposedChanges, liveContent } = params;

  const section = findSection(document, selection.pageId, selection.sectionId);
  const blockItem = findBlock(document, selection);
  if (!section || !blockItem) {
    return { ok: false, error: "La sélection n’est plus disponible." };
  }

  if (proposalBlockId !== blockItem.id) {
    return { ok: false, error: "La proposition ne concerne pas le bloc sélectionné." };
  }

  const definition = getBlockDefinition(section.type, blockItem.type);
  if (!definition) {
    return { ok: false, error: "Ce bloc ne peut pas être modifié avec l’IA." };
  }

  const changes: ValidatedChange[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();

  for (const proposed of proposedChanges) {
    if (typeof proposed?.field !== "string" || typeof proposed?.newValue !== "string") {
      rejected.push("changement illisible");
      continue;
    }
    if (seen.has(proposed.field)) continue;
    seen.add(proposed.field);

    const fieldDefinition = definition.editableFields[proposed.field];
    const currentField = blockItem.content[proposed.field];
    if (!fieldDefinition || !currentField?.editable) {
      rejected.push(`champ hors périmètre : ${proposed.field}`);
      continue;
    }
    if (containsDangerousContent(proposed.newValue)) {
      rejected.push(`contenu dangereux rejeté : ${proposed.field}`);
      continue;
    }

    const newValue = sanitizeText(proposed.newValue, fieldDefinition.maxLength).trim();
    const live = liveContent?.[proposed.field];
    const previousValue = typeof live === "string" ? live : getFieldValue(blockItem, proposed.field);
    if (!newValue || newValue === previousValue) continue;

    changes.push({
      field: proposed.field,
      fieldLabel: fieldDefinition.label,
      previousValue,
      newValue,
    });
  }

  return { ok: true, blockId: blockItem.id, changes, rejected };
}
