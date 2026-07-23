// -----------------------------------------------------------------------------
// Bibliothèque de sections ajoutables + fabrique de sections/blocs.
//
// Complète section-definitions.ts (qui déclare les champs éditables) avec :
//   • les constructeurs immuables de blocs (buildBlock/buildField), partagés
//     par le document par défaut, l'ajout de section et la validation serveur ;
//   • le catalogue des sections proposées dans le drawer « Ajouter une section »
//     et leur contenu par défaut ;
//   • la notion de section « singleton » (header, footer…) qui ne se duplique
//     pas et reste fixe dans la mise en page.
//
// Une section n'existe que si son type est déclaré ici ET dans la bibliothèque
// de champs : c'est le seul périmètre autorisé, côté client comme serveur.
// -----------------------------------------------------------------------------

import type { EditableFieldType, EditableValue, StoreBlock, StoreSection } from "./document-schema";
import { SECTION_DEFINITIONS, getBlockDefinition } from "./section-definitions";

/** Identifiant unique et lisible pour une section ou un bloc nouvellement créé. */
export function editorUid(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

/**
 * Fabrique un champ éditable en héritant type et longueur de la bibliothèque.
 * Un champ hors bibliothèque est marqué non éditable (jamais envoyé à l'IA).
 */
export function buildField(
  sectionType: string,
  blockType: string,
  fieldId: string,
  value: string,
): Record<string, EditableValue> {
  const definition = getBlockDefinition(sectionType, blockType)?.editableFields[fieldId];
  return {
    [fieldId]: {
      value,
      editable: Boolean(definition),
      fieldType: (definition?.fieldType ?? "text") as EditableFieldType,
      maxLength: definition?.maxLength,
    },
  };
}

/** Fabrique un bloc à partir de valeurs brutes, en s'appuyant sur la bibliothèque. */
export function buildBlock(
  sectionType: string,
  blockType: string,
  id: string,
  values: Record<string, string>,
): StoreBlock {
  return {
    id,
    type: blockType,
    content: Object.assign(
      {},
      ...Object.entries(values).map(([fieldId, value]) => buildField(sectionType, blockType, fieldId, value)),
    ),
  };
}

// --- Contenu par défaut des sections ajoutables ------------------------------
// Volontairement générique (sans données inventées) : le contenu invite le
// marchand à le remplir. Aucun avis, aucune promotion, aucun délai fictif.

const SECTION_BLOCK_TEMPLATES: Record<string, () => StoreBlock[]> = {
  benefits: () => [
    buildBlock("benefits", "benefits-intro", editorUid("benefits-intro"), { heading: "Pourquoi nous choisir" }),
    buildBlock("benefits", "benefit-item", editorUid("benefit"), {
      title: "Un premier atout",
      description: "Décrivez ici un bénéfice concret pour vos clients.",
    }),
    buildBlock("benefits", "benefit-item", editorUid("benefit"), {
      title: "Un deuxième atout",
      description: "Mettez en avant ce qui distingue votre boutique.",
    }),
    buildBlock("benefits", "benefit-item", editorUid("benefit"), {
      title: "Un troisième atout",
      description: "Rassurez le visiteur sur un point important.",
    }),
  ],
  "featured-products": () => [
    buildBlock("featured-products", "featured-intro", editorUid("featured-intro"), {
      heading: "La collection",
      description: "Présentez ici votre sélection de produits.",
    }),
  ],
  testimonials: () => [
    buildBlock("testimonials", "testimonials-intro", editorUid("testimonials-intro"), {
      heading: "Ils nous font confiance",
    }),
    buildBlock("testimonials", "testimonial-item", editorUid("testimonial"), {
      quote: "Ajoutez ici le témoignage réel d’un client.",
      author: "Prénom N.",
    }),
    buildBlock("testimonials", "testimonial-item", editorUid("testimonial"), {
      quote: "Ajoutez ici le témoignage réel d’un autre client.",
      author: "Prénom N.",
    }),
  ],
  faq: () => [
    buildBlock("faq", "faq-intro", editorUid("faq-intro"), { heading: "Questions fréquentes" }),
    buildBlock("faq", "faq-item", editorUid("faq"), {
      question: "Une première question fréquente ?",
      answer: "Rédigez ici une réponse claire et rassurante.",
    }),
    buildBlock("faq", "faq-item", editorUid("faq"), {
      question: "Une deuxième question ?",
      answer: "Ajoutez les informations utiles à vos clients.",
    }),
  ],
  newsletter: () => [
    buildBlock("newsletter", "newsletter-content", editorUid("newsletter"), {
      heading: "Restez informé·e",
      description: "Recevez les nouveautés et l’actualité de la boutique.",
      buttonLabel: "S’inscrire",
    }),
  ],
  "content-section": () => [
    buildBlock("content-section", "content-body", editorUid("content"), {
      heading: "Titre de section",
      body: "Rédigez ici votre texte. Ce bloc convient aux pages À propos, Contact ou à toute présentation libre.",
    }),
  ],
};

/** Blocs par défaut d'un type de section (vide si le type n'est pas ajoutable). */
export function createSectionBlocks(type: string): StoreBlock[] {
  return SECTION_BLOCK_TEMPLATES[type]?.() ?? [];
}

// Valeurs par défaut d'un bloc ajouté à la volée dans une section (items répétables).
const BLOCK_DEFAULTS: Record<string, Record<string, string>> = {
  "benefit-item": { title: "Nouvel atout", description: "Décrivez ici un bénéfice concret pour vos clients." },
  "faq-item": { question: "Nouvelle question ?", answer: "Ajoutez ici une réponse claire." },
  "testimonial-item": { quote: "Ajoutez ici le témoignage réel d’un client.", author: "Prénom N." },
};

/** Fabrique un bloc prêt à insérer dans une section, ou null si le type est inconnu. */
export function createBlock(sectionType: string, blockType: string): StoreBlock | null {
  const definition = getBlockDefinition(sectionType, blockType);
  if (!definition) return null;
  const values =
    BLOCK_DEFAULTS[blockType] ??
    Object.fromEntries(Object.keys(definition.editableFields).map((fieldId) => [fieldId, ""]));
  return buildBlock(sectionType, blockType, editorUid(blockType), values);
}

/** Fabrique une nouvelle section prête à insérer, ou null si le type est inconnu. */
export function createSection(type: string): StoreSection | null {
  if (!SECTION_DEFINITIONS[type] || !SECTION_BLOCK_TEMPLATES[type]) return null;
  return { id: editorUid(type), type, position: 0, visible: true, blocks: createSectionBlocks(type) };
}

// --- Catalogue du drawer -----------------------------------------------------

export interface AddableSection {
  type: string;
  label: string;
  description: string;
}

/** Sections proposées dans le drawer « Ajouter une section » (ordre d'affichage). */
export const ADDABLE_SECTIONS: AddableSection[] = [
  { type: "benefits", label: "Avantages", description: "Trois arguments courts qui rassurent le visiteur." },
  { type: "featured-products", label: "Produits vedettes", description: "Mettez en avant une sélection de produits." },
  { type: "faq", label: "FAQ", description: "Questions fréquentes et réponses courtes." },
  { type: "testimonials", label: "Témoignages", description: "Avis de clients réels, à renseigner vous-même." },
  { type: "newsletter", label: "Newsletter", description: "Invitation à s’inscrire à votre liste e-mail." },
  { type: "content-section", label: "Bloc de texte", description: "Un ou plusieurs blocs titre + paragraphe libres." },
];

/** Sections structurelles uniques : ni dupliquées, ni déplaçables, ni supprimables. */
export const SINGLETON_SECTION_TYPES = new Set(["announcement-bar", "header", "hero", "footer"]);

export function isSingletonSection(type: string): boolean {
  return SINGLETON_SECTION_TYPES.has(type);
}
