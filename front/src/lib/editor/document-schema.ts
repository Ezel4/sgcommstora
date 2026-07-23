// -----------------------------------------------------------------------------
// Document structuré de boutique — source de vérité de l'éditeur visuel.
//
// La boutique n'est jamais stockée en HTML : elle est décrite par un document
// (pages → sections → blocs → champs). Le rendu React (storefront public et
// canvas de l'éditeur) est généré à partir de cette donnée.
//
// Types purs, sans dépendance serveur : utilisables côté client, serveur et
// dans les tests.
// -----------------------------------------------------------------------------

export type PageType = "home" | "product" | "collection" | "content";

/** Statut d'une page dans l'éditeur (MVP : seule la home est configurée). */
export type PageStatus = "configured" | "not-configured";

export type EditableFieldType = "text" | "textarea" | "buttonLabel" | "image";

export interface EditableValue {
  value: string;
  /** Faux pour les champs affichés mais verrouillés (jamais envoyés à l'IA). */
  editable: boolean;
  fieldType: EditableFieldType;
  maxLength?: number;
}

export interface StoreBlock {
  id: string;
  /** Type déclaré dans la bibliothèque de sections (section-definitions). */
  type: string;
  content: Record<string, EditableValue>;
}

export interface StoreSection {
  id: string;
  type: string;
  position: number;
  /** Une section masquée reste éditable mais n'est pas rendue publiquement. */
  visible: boolean;
  blocks: StoreBlock[];
}

export interface StorePage {
  id: string;
  type: PageType;
  title: string;
  slug: string;
  status: PageStatus;
  sections: StoreSection[];
}

export interface StoreDocument {
  id: string;
  storeId: string;
  /** Version du brouillon, incrémentée à chaque sauvegarde (verrou optimiste). */
  version: number;
  locale: string;
  pages: StorePage[];
}

/**
 * Référence stable vers un élément sélectionnable. Jamais basée sur le texte
 * visible ni sur un sélecteur CSS : uniquement des identifiants du document.
 */
export interface ElementReference {
  pageId: string;
  sectionId: string;
  blockId: string;
  fieldId?: string;
}

// --- Accès en lecture --------------------------------------------------------

export function findPage(doc: StoreDocument, pageId: string): StorePage | null {
  return doc.pages.find((page) => page.id === pageId) ?? null;
}

export function findSection(doc: StoreDocument, pageId: string, sectionId: string): StoreSection | null {
  return findPage(doc, pageId)?.sections.find((section) => section.id === sectionId) ?? null;
}

export function findBlock(doc: StoreDocument, ref: Pick<ElementReference, "pageId" | "sectionId" | "blockId">): StoreBlock | null {
  return findSection(doc, ref.pageId, ref.sectionId)?.blocks.find((block) => block.id === ref.blockId) ?? null;
}

export function getFieldValue(block: StoreBlock, fieldId: string): string {
  return block.content[fieldId]?.value ?? "";
}

// --- Mises à jour immuables --------------------------------------------------

function mapBlock(
  doc: StoreDocument,
  ref: Pick<ElementReference, "pageId" | "sectionId" | "blockId">,
  update: (block: StoreBlock) => StoreBlock,
): StoreDocument {
  return {
    ...doc,
    pages: doc.pages.map((page) =>
      page.id !== ref.pageId
        ? page
        : {
            ...page,
            sections: page.sections.map((section) =>
              section.id !== ref.sectionId
                ? section
                : {
                    ...section,
                    blocks: section.blocks.map((block) => (block.id !== ref.blockId ? block : update(block))),
                  },
            ),
          },
    ),
  };
}

/** Remplace la valeur d'un champ. Ne touche ni ses métadonnées ni les autres blocs. */
export function setFieldValue(
  doc: StoreDocument,
  ref: Pick<ElementReference, "pageId" | "sectionId" | "blockId">,
  fieldId: string,
  value: string,
): StoreDocument {
  return mapBlock(doc, ref, (block) => {
    const field = block.content[fieldId];
    if (!field) return block;
    return { ...block, content: { ...block.content, [fieldId]: { ...field, value } } };
  });
}

export function setSectionVisibility(
  doc: StoreDocument,
  pageId: string,
  sectionId: string,
  visible: boolean,
): StoreDocument {
  return {
    ...doc,
    pages: doc.pages.map((page) =>
      page.id !== pageId
        ? page
        : {
            ...page,
            sections: page.sections.map((section) => (section.id !== sectionId ? section : { ...section, visible })),
          },
    ),
  };
}

// --- Structure des sections (ajout / suppression / déplacement) --------------
// `position` est l'ordre de rendu : après chaque opération, les positions sont
// renumérotées 0..n selon l'ordre visuel pour éviter les trous et les doublons.

function reorderPositions(sections: StoreSection[]): StoreSection[] {
  return sections.map((section, index) => (section.position === index ? section : { ...section, position: index }));
}

function withOrderedSections(
  doc: StoreDocument,
  pageId: string,
  transform: (ordered: StoreSection[]) => StoreSection[],
): StoreDocument {
  return {
    ...doc,
    pages: doc.pages.map((page) => {
      if (page.id !== pageId) return page;
      const ordered = [...page.sections].sort((a, b) => a.position - b.position);
      return { ...page, sections: reorderPositions(transform(ordered)) };
    }),
  };
}

/** Index visuel (ordre `position`) d'une section, ou -1 si absente. */
export function sectionIndex(doc: StoreDocument, pageId: string, sectionId: string): number {
  const page = findPage(doc, pageId);
  if (!page) return -1;
  return [...page.sections].sort((a, b) => a.position - b.position).findIndex((section) => section.id === sectionId);
}

/** Insère une section à un index visuel (borné), puis renumérote les positions. */
export function insertSection(doc: StoreDocument, pageId: string, section: StoreSection, index: number): StoreDocument {
  return withOrderedSections(doc, pageId, (ordered) => {
    const clamped = Math.max(0, Math.min(index, ordered.length));
    const next = [...ordered];
    next.splice(clamped, 0, section);
    return next;
  });
}

/** Retire une section par identifiant, puis renumérote les positions. */
export function removeSection(doc: StoreDocument, pageId: string, sectionId: string): StoreDocument {
  return withOrderedSections(doc, pageId, (ordered) => ordered.filter((section) => section.id !== sectionId));
}

/** Déplace une section vers un index visuel (borné), puis renumérote les positions. */
export function moveSection(doc: StoreDocument, pageId: string, sectionId: string, toIndex: number): StoreDocument {
  return withOrderedSections(doc, pageId, (ordered) => {
    const from = ordered.findIndex((section) => section.id === sectionId);
    if (from === -1) return ordered;
    const clamped = Math.max(0, Math.min(toIndex, ordered.length - 1));
    if (from === clamped) return ordered;
    const next = [...ordered];
    const [moved] = next.splice(from, 1);
    next.splice(clamped, 0, moved);
    return next;
  });
}

// --- Structure des blocs (ajout / suppression d'items dans une section) ------

function withSectionBlocks(
  doc: StoreDocument,
  pageId: string,
  sectionId: string,
  transform: (blocks: StoreBlock[]) => StoreBlock[],
): StoreDocument {
  return {
    ...doc,
    pages: doc.pages.map((page) =>
      page.id !== pageId
        ? page
        : {
            ...page,
            sections: page.sections.map((section) =>
              section.id !== sectionId ? section : { ...section, blocks: transform(section.blocks) },
            ),
          },
    ),
  };
}

/** Index d'un bloc dans sa section (ordre du tableau), ou -1 si absent. */
export function blockIndex(doc: StoreDocument, pageId: string, sectionId: string, blockId: string): number {
  return findSection(doc, pageId, sectionId)?.blocks.findIndex((block) => block.id === blockId) ?? -1;
}

/** Insère un bloc à un index (borné) dans une section. */
export function insertBlock(
  doc: StoreDocument,
  pageId: string,
  sectionId: string,
  block: StoreBlock,
  index: number,
): StoreDocument {
  return withSectionBlocks(doc, pageId, sectionId, (blocks) => {
    const clamped = Math.max(0, Math.min(index, blocks.length));
    const next = [...blocks];
    next.splice(clamped, 0, block);
    return next;
  });
}

/** Retire un bloc d'une section par identifiant. */
export function removeBlock(doc: StoreDocument, pageId: string, sectionId: string, blockId: string): StoreDocument {
  return withSectionBlocks(doc, pageId, sectionId, (blocks) => blocks.filter((block) => block.id !== blockId));
}
