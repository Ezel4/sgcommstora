// -----------------------------------------------------------------------------
// Validation d'un document soumis par le client (sauvegarde de brouillon).
//
// Approche fail-closed : on ne fait jamais confiance à la structure reçue.
// Le serveur repart du document canonique (squelette par défaut de la boutique)
// puis, page par page, reconstruit la liste de sections À PARTIR de la
// soumission — ce qui permet l'ajout, la suppression et le déplacement de
// sections — sans jamais élargir le périmètre autorisé :
//   • seuls les types de sections/blocs déclarés dans la bibliothèque sont admis ;
//   • pour une section canonique (même id), on ne reporte que la valeur des
//     champs éditables et la visibilité (comportement historique) ;
//   • pour une section ajoutée, on reconstruit ses blocs depuis la soumission,
//     en ne gardant que les champs déclarés, nettoyés et bornés en longueur ;
//   • tout contenu dangereux est rejeté, tout élément inconnu est ignoré et
//     signalé.
// -----------------------------------------------------------------------------

import type { StoreBlock, StoreDocument, StorePage, StoreSection } from "./document-schema";
import { buildDefaultDocument, type StoreSeed } from "./default-document";
import { SECTION_DEFINITIONS, getBlockDefinition } from "./section-definitions";
import { buildBlock, createSectionBlocks, editorUid } from "./section-library";
import { containsDangerousContent, sanitizeText } from "./sanitize";

export interface DocumentMergeResult {
  document: StoreDocument;
  /** Éléments soumis mais ignorés (hors périmètre) — utile au diagnostic. */
  issues: string[];
}

/** Garde-fou : nombre maximal de blocs conservés dans une section reconstruite. */
const MAX_BLOCKS_PER_SECTION = 40;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recopie, dans une section canonique, les valeurs éditables et la visibilité soumises. */
function mergeCanonicalBlocks(
  section: StoreSection,
  submittedBlocks: Record<string, unknown>[],
  issues: string[],
): StoreBlock[] {
  return section.blocks.map((blockItem) => {
    const submittedBlock = submittedBlocks.find((candidate) => candidate.id === blockItem.id);
    if (!submittedBlock || !isRecord(submittedBlock.content)) return blockItem;

    const definition = getBlockDefinition(section.type, blockItem.type);
    const content = { ...blockItem.content };
    for (const [fieldId, fieldValue] of Object.entries(submittedBlock.content)) {
      const fieldDefinition = definition?.editableFields[fieldId];
      const canonicalField = content[fieldId];
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
      content[fieldId] = { ...canonicalField, value: sanitizeText(rawValue, fieldDefinition.maxLength) };
    }
    return { ...blockItem, content };
  });
}

/** Reconstruit les blocs d'une section ajoutée, uniquement à partir du périmètre autorisé. */
function buildAddedSectionBlocks(
  sectionType: string,
  submittedBlocks: Record<string, unknown>[],
  issues: string[],
): StoreBlock[] {
  const definition = SECTION_DEFINITIONS[sectionType];
  const usedIds = new Set<string>();
  const blocks: StoreBlock[] = [];

  for (const submitted of submittedBlocks) {
    if (blocks.length >= MAX_BLOCKS_PER_SECTION) break;
    const blockType = typeof submitted.type === "string" ? submitted.type : undefined;
    const blockDefinition = blockType ? definition.blocks[blockType] : undefined;
    if (!blockType || !blockDefinition) {
      issues.push(`bloc ignoré (type inconnu) : ${sectionType}/${String(submitted.type)}`);
      continue;
    }
    let id = typeof submitted.id === "string" && submitted.id ? submitted.id : editorUid(blockType);
    if (usedIds.has(id)) id = editorUid(blockType);
    usedIds.add(id);

    const submittedContent = isRecord(submitted.content) ? submitted.content : {};
    const values: Record<string, string> = {};
    for (const [fieldId, fieldDefinition] of Object.entries(blockDefinition.editableFields)) {
      const rawEntry = submittedContent[fieldId];
      const rawValue = isRecord(rawEntry) ? rawEntry.value : undefined;
      if (typeof rawValue !== "string") {
        values[fieldId] = "";
        continue;
      }
      if (containsDangerousContent(rawValue)) {
        issues.push(`valeur rejetée (contenu dangereux) : ${sectionType}/${id}/${fieldId}`);
        values[fieldId] = "";
        continue;
      }
      values[fieldId] = sanitizeText(rawValue, fieldDefinition.maxLength);
    }
    blocks.push(buildBlock(sectionType, blockType, id, values));
  }

  // Une section ajoutée sans aucun bloc valide retombe sur son contenu par défaut.
  return blocks.length ? blocks : createSectionBlocks(sectionType);
}

/** Reconstruit la liste de sections d'une page à partir de la soumission. */
function rebuildSections(
  canonicalPage: StorePage,
  submittedSections: Record<string, unknown>[],
  issues: string[],
): StoreSection[] {
  const usedIds = new Set<string>();
  const result: StoreSection[] = [];

  for (const submitted of submittedSections) {
    const canonicalMatch =
      typeof submitted.id === "string"
        ? canonicalPage.sections.find((section) => section.id === submitted.id)
        : undefined;
    const submittedType = typeof submitted.type === "string" ? submitted.type : undefined;
    const type = canonicalMatch?.type ?? (submittedType && SECTION_DEFINITIONS[submittedType] ? submittedType : undefined);
    if (!type || !SECTION_DEFINITIONS[type]) {
      issues.push(`section ignorée (type inconnu) : ${String(submitted.id ?? submitted.type)}`);
      continue;
    }

    let id = typeof submitted.id === "string" && submitted.id ? submitted.id : editorUid(type);
    if (usedIds.has(id)) id = editorUid(type);
    usedIds.add(id);

    const visible = typeof submitted.visible === "boolean" ? submitted.visible : canonicalMatch?.visible ?? true;
    const submittedBlocks = Array.isArray(submitted.blocks) ? submitted.blocks.filter(isRecord) : [];
    const blocks = canonicalMatch
      ? mergeCanonicalBlocks(canonicalMatch, submittedBlocks, issues)
      : buildAddedSectionBlocks(type, submittedBlocks, issues);

    result.push({ id, type, position: result.length, visible, blocks });
  }

  return result;
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

    const rebuilt = rebuildSections(page, submittedPage.sections.filter(isRecord), issues);
    // Ne jamais vider une page par accident : sans section valide reconstruite,
    // on conserve le squelette canonique de la page.
    if (rebuilt.length) page.sections = rebuilt;
  }

  const submittedVersion = typeof submitted.version === "number" ? submitted.version : 0;
  canonical.version = Number.isInteger(submittedVersion) && submittedVersion >= 0 ? submittedVersion : 0;
  return { document: canonical, issues };
}
