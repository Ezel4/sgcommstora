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

export type EditableFieldType = "text" | "textarea" | "buttonLabel";

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
