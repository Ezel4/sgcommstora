// -----------------------------------------------------------------------------
// Bibliothèque de sections — la seule source des champs éditables.
//
// Chaque type de section déclare ses blocs, et chaque bloc ses champs textuels
// autorisés (type, longueur maximale, aide). L'IA et l'édition manuelle ne
// peuvent toucher que les champs déclarés ici : c'est cette liste qui sert de
// périmètre technique, pas les instructions du prompt.
// -----------------------------------------------------------------------------

import type { EditableFieldType } from "./document-schema";

export interface FieldDefinition {
  label: string;
  fieldType: EditableFieldType;
  maxLength: number;
  help?: string;
}

export interface BlockDefinition {
  type: string;
  label: string;
  editableFields: Record<string, FieldDefinition>;
}

export interface SectionDefinition {
  type: string;
  label: string;
  description: string;
  /** Suggestions rapides proposées dans l'onglet « Modifier avec l'IA ». */
  aiSuggestions: string[];
  /** Blocs autorisés dans cette section, indexés par type de bloc. */
  blocks: Record<string, BlockDefinition>;
  /** Contenus affichés dans la section mais gérés ailleurs (produits, prix…). */
  dynamicContent?: string[];
}

const suggestionsCommunes = ["Corriger les fautes", "Raccourcir", "Rendre plus clair"];

export const SECTION_DEFINITIONS: Record<string, SectionDefinition> = {
  "announcement-bar": {
    type: "announcement-bar",
    label: "Barre d’annonce",
    description: "Message court affiché tout en haut de la boutique.",
    aiSuggestions: [...suggestionsCommunes, "Ajouter un sentiment d’urgence"],
    blocks: {
      announcement: {
        type: "announcement",
        label: "Message d’annonce",
        editableFields: {
          text: { label: "Message", fieldType: "text", maxLength: 90, help: "Une seule phrase courte." },
        },
      },
    },
  },
  header: {
    type: "header",
    label: "Header",
    description: "Navigation principale de la boutique.",
    aiSuggestions: suggestionsCommunes,
    dynamicContent: ["Le nom de la boutique provient des réglages de la boutique."],
    blocks: {
      "header-content": {
        type: "header-content",
        label: "Navigation",
        editableFields: {
          ctaLabel: { label: "Bouton de navigation", fieldType: "buttonLabel", maxLength: 30 },
        },
      },
    },
  },
  hero: {
    type: "hero",
    label: "Hero",
    description: "Bannière principale : proposition de valeur et appel à l’action.",
    aiSuggestions: [
      "Créer une proposition de valeur plus forte",
      "Rendre le titre plus premium",
      "Clarifier le bénéfice principal",
      "Améliorer le CTA",
      "Proposer trois variantes",
    ],
    blocks: {
      "hero-content": {
        type: "hero-content",
        label: "Contenu principal",
        editableFields: {
          eyebrow: { label: "Surtitre", fieldType: "text", maxLength: 50 },
          heading: { label: "Titre principal", fieldType: "text", maxLength: 120 },
          description: { label: "Description", fieldType: "textarea", maxLength: 300 },
          primaryButtonLabel: { label: "Bouton principal", fieldType: "buttonLabel", maxLength: 30 },
          secondaryButtonLabel: { label: "Bouton secondaire", fieldType: "buttonLabel", maxLength: 30 },
        },
      },
    },
  },
  benefits: {
    type: "benefits",
    label: "Avantages",
    description: "Trois arguments courts qui rassurent le visiteur.",
    aiSuggestions: [
      "Transformer les caractéristiques en bénéfices",
      "Raccourcir chaque avantage",
      "Rendre les arguments plus rassurants",
    ],
    blocks: {
      "benefits-intro": {
        type: "benefits-intro",
        label: "Introduction",
        editableFields: {
          heading: { label: "Titre de section", fieldType: "text", maxLength: 80 },
        },
      },
      "benefit-item": {
        type: "benefit-item",
        label: "Avantage",
        editableFields: {
          title: { label: "Titre", fieldType: "text", maxLength: 60 },
          description: { label: "Description", fieldType: "textarea", maxLength: 160 },
        },
      },
    },
  },
  "featured-products": {
    type: "featured-products",
    label: "Produits vedettes",
    description: "Sélection de produits mis en avant sur la page.",
    aiSuggestions: [
      "Améliorer le titre de section",
      "Ajouter une introduction commerciale",
      "Renforcer la découverte produit",
    ],
    dynamicContent: [
      "Les produits, prix et stocks proviennent du module Produits.",
      "Modifiez-les depuis Dashboard > Produits.",
    ],
    blocks: {
      "featured-intro": {
        type: "featured-intro",
        label: "Introduction",
        editableFields: {
          heading: { label: "Titre de section", fieldType: "text", maxLength: 80 },
          description: { label: "Introduction", fieldType: "textarea", maxLength: 220 },
        },
      },
    },
  },
  testimonials: {
    type: "testimonials",
    label: "Témoignages",
    description: "Avis de clients réels. Masquée tant qu’aucun témoignage réel n’est renseigné.",
    aiSuggestions: ["Corriger les fautes", "Améliorer la lisibilité"],
    blocks: {
      "testimonials-intro": {
        type: "testimonials-intro",
        label: "Introduction",
        editableFields: {
          heading: { label: "Titre de section", fieldType: "text", maxLength: 80 },
        },
      },
      "testimonial-item": {
        type: "testimonial-item",
        label: "Témoignage",
        editableFields: {
          quote: { label: "Citation", fieldType: "textarea", maxLength: 280, help: "Uniquement un témoignage réel d’un client." },
          author: { label: "Auteur", fieldType: "text", maxLength: 60 },
        },
      },
    },
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Questions fréquentes et réponses courtes.",
    aiSuggestions: [
      "Simplifier les réponses",
      "Réduire les hésitations",
      "Corriger les fautes",
    ],
    blocks: {
      "faq-intro": {
        type: "faq-intro",
        label: "Introduction",
        editableFields: {
          heading: { label: "Titre de section", fieldType: "text", maxLength: 80 },
        },
      },
      "faq-item": {
        type: "faq-item",
        label: "Question",
        editableFields: {
          question: { label: "Question", fieldType: "text", maxLength: 120 },
          answer: { label: "Réponse", fieldType: "textarea", maxLength: 400 },
        },
      },
    },
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter",
    description: "Invitation à s’inscrire. Masquée tant que la collecte d’e-mails n’est pas branchée.",
    aiSuggestions: [
      "Donner une raison claire de s’inscrire",
      "Améliorer le texte du bouton",
      "Rendre la promesse plus attractive",
    ],
    blocks: {
      "newsletter-content": {
        type: "newsletter-content",
        label: "Contenu",
        editableFields: {
          heading: { label: "Titre", fieldType: "text", maxLength: 80 },
          description: { label: "Description", fieldType: "textarea", maxLength: 200 },
          buttonLabel: { label: "Bouton d’inscription", fieldType: "buttonLabel", maxLength: 30 },
        },
      },
    },
  },
  "collection-header": {
    type: "collection-header",
    label: "En-tête de collection",
    description: "Titre et introduction en haut d’une page collection.",
    aiSuggestions: [
      "Rendre le titre plus accrocheur",
      "Clarifier ce que contient la collection",
      "Raccourcir l’introduction",
    ],
    blocks: {
      "collection-header-content": {
        type: "collection-header-content",
        label: "Contenu de l’en-tête",
        editableFields: {
          eyebrow: { label: "Surtitre", fieldType: "text", maxLength: 50 },
          heading: { label: "Titre de la collection", fieldType: "text", maxLength: 80 },
          description: { label: "Introduction", fieldType: "textarea", maxLength: 240 },
        },
      },
    },
  },
  "product-overview": {
    type: "product-overview",
    label: "Aperçu produit",
    description: "Gabarit d’une fiche produit : visuel, nom et prix proviennent du catalogue ; les textes autour sont éditables.",
    aiSuggestions: [
      "Améliorer le texte du bouton d’achat",
      "Renforcer la réassurance",
      "Clarifier le titre des détails",
    ],
    dynamicContent: [
      "Le nom, le prix et le visuel du produit proviennent du module Produits.",
      "Ce gabarit s’applique à toutes les fiches produit.",
    ],
    blocks: {
      "product-overview-content": {
        type: "product-overview-content",
        label: "Gabarit de fiche",
        editableFields: {
          ctaLabel: { label: "Bouton d’achat", fieldType: "buttonLabel", maxLength: 30 },
          reassurance: { label: "Réassurance", fieldType: "text", maxLength: 120, help: "Une ligne rassurante, sans promesse chiffrée." },
          detailsHeading: { label: "Titre des détails", fieldType: "text", maxLength: 60 },
        },
      },
    },
  },
  footer: {
    type: "footer",
    label: "Footer",
    description: "Pied de page : présentation courte de la marque.",
    aiSuggestions: ["Clarifier la présentation de la marque", "Raccourcir", "Corriger les fautes"],
    dynamicContent: ["La mention « Boutique générée avec Sigmood IA » n’est pas modifiable."],
    blocks: {
      "footer-content": {
        type: "footer-content",
        label: "Présentation",
        editableFields: {
          about: { label: "Présentation de la marque", fieldType: "textarea", maxLength: 240 },
        },
      },
    },
  },
};

export function getSectionDefinition(sectionType: string): SectionDefinition | null {
  return SECTION_DEFINITIONS[sectionType] ?? null;
}

export function getBlockDefinition(sectionType: string, blockType: string): BlockDefinition | null {
  return SECTION_DEFINITIONS[sectionType]?.blocks[blockType] ?? null;
}

/** Champs autorisés pour un bloc — la liste envoyée à l'IA et validée au retour. */
export function getAllowedFields(sectionType: string, blockType: string): string[] {
  const block = getBlockDefinition(sectionType, blockType);
  return block ? Object.keys(block.editableFields) : [];
}
