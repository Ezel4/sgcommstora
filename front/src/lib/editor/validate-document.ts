// -----------------------------------------------------------------------------
// Validation d'un document soumis par le client (sauvegarde de brouillon).
//
// Approche fail-closed : on ne fait jamais confiance à la structure reçue.
// Le serveur reconstruit le document canonique (squelette par défaut de la
// boutique) puis n'y reporte que ce que le client a le droit de modifier :
//   • la valeur des champs déclarés éditables dans la bibliothèque de sections ;
//   • la visibilité des sections.
// Toute section, bloc ou champ inconnu est ignoré et signalé. Les valeurs sont
// nettoyées (sanitize) et bornées aux longueurs de la bibliothèque.
// -----------------------------------------------------------------------------

import type { StoreDocument } from "./document-schema";
import { buildDefaultDocument, type StoreSeed } from "./default-document";
import { getBlockDefinition } from "./section-definitions";
import { containsDangerousContent, sanitizeText } from "./sanitize";

export interface DocumentMergeResult {
  document: StoreDocument;
  /** Éléments soumis mais ignorés (hors périmètre) — utile au diagnostic. */
  issues: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reconstruit un document sûr à partir d'une soumission non fiable.
 * `store` est la boutique authentifiée côté serveur — jamais celle du payload.
 */
export function mergeSubmittedDocument(store: StoreSeed, submitted: unknown): DocumentMergeResult {
  const canonical = buildDefaultDocument(store);
  const issues: string[] = [];

  if (!isRecord(submitted) || !Array.isArray(submitted.pages)) {
    issues.push("document illisible : structure attendue { pages: [...] }");
    return { document: canonical, issues };
  }

  const submittedPages = submitted.pages.filter(isRecord);

  for (const page of canonical.pages) {
    const submittedPage = submittedPages.find((candidate) => candidate.id === page.id);
    if (!submittedPage || !Array.isArray(submittedPage.sections)) continue;
    const submittedSections = submittedPage.sections.filter(isRecord);

    for (const section of page.sections) {
      const submittedSection = submittedSections.find((candidate) => candidate.id === section.id);
      if (!submittedSection) continue;

      if (typeof submittedSection.visible === "boolean") {
        section.visible = submittedSection.visible;
      }

      const submittedBlocks = Array.isArray(submittedSection.blocks) ? submittedSection.blocks.filter(isRecord) : [];
      for (const blockItem of section.blocks) {
        const submittedBlock = submittedBlocks.find((candidate) => candidate.id === blockItem.id);
        if (!submittedBlock || !isRecord(submittedBlock.content)) continue;

        const definition = getBlockDefinition(section.type, blockItem.type);
        for (const [fieldId, fieldValue] of Object.entries(submittedBlock.content)) {
          const fieldDefinition = definition?.editableFields[fieldId];
          const canonicalField = blockItem.content[fieldId];
          if (!fieldDefinition || !canonicalField?.editable) {
            issues.push(`champ ignoré (non éditable) : ${section.id}/${blockItem.id}/${fieldId}`);
            continue;
          }
          const rawValue = isRecord(fieldValue) ? fieldValue.value : undefined;
          if (typeof rawValue !== "string") {
            issues.push(`valeur invalide : ${section.id}/${blockItem.id}/${fieldId}`);
            continue;
          }
          if (containsDangerousContent(rawValue)) {
            issues.push(`valeur rejetée (contenu dangereux) : ${section.id}/${blockItem.id}/${fieldId}`);
            continue;
          }
          canonicalField.value = sanitizeText(rawValue, fieldDefinition.maxLength);
        }
      }
    }
  }

  const submittedVersion = typeof submitted.version === "number" ? submitted.version : 0;
  canonical.version = Number.isInteger(submittedVersion) && submittedVersion >= 0 ? submittedVersion : 0;
  return { document: canonical, issues };
}
