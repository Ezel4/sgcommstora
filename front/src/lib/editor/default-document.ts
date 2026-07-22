// -----------------------------------------------------------------------------
// Document homepage pilote.
//
// Construit le document structuré par défaut d'une boutique à partir de ses
// données réelles (nom, niche, audience). C'est la couche d'adaptation du
// storefront existant : tant qu'aucun brouillon n'est enregistré, le rendu
// public et l'éditeur partent de ce document.
//
// Règles de contenu par défaut (voir Interdictions IA) : aucune promotion,
// aucun délai de livraison, aucune certification ni aucun avis inventé.
// Les sections qui exigeraient des données réelles absentes (témoignages,
// newsletter) existent dans le document mais sont masquées par défaut.
// -----------------------------------------------------------------------------

import type { EditableFieldType, StoreBlock, StoreDocument, StorePage } from "./document-schema";
import { getBlockDefinition } from "./section-definitions";

export interface StoreSeed {
  id: string;
  name: string;
  slug: string;
  niche: string;
  audience: string;
}

/** Fabrique un champ éditable en héritant type et longueur de la bibliothèque. */
function field(sectionType: string, blockType: string, fieldId: string, value: string) {
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

function block(sectionType: string, blockType: string, id: string, values: Record<string, string>): StoreBlock {
  return {
    id,
    type: blockType,
    content: Object.assign({}, ...Object.entries(values).map(([fieldId, value]) => field(sectionType, blockType, fieldId, value))),
  };
}

export function buildHomePage(store: StoreSeed): StorePage {
  return {
    id: "home",
    type: "home",
    title: "Accueil",
    slug: "",
    status: "configured",
    sections: [
      {
        id: "announcement-main",
        type: "announcement-bar",
        position: 0,
        visible: true,
        blocks: [
          block("announcement-bar", "announcement", "announcement-text", {
            text: `Bienvenue chez ${store.name} — découvrez la collection`,
          }),
        ],
      },
      {
        id: "header-main",
        type: "header",
        position: 1,
        visible: true,
        blocks: [
          block("header", "header-content", "header-content", {
            ctaLabel: "Voir la collection",
          }),
        ],
      },
      {
        id: "hero-main",
        type: "hero",
        position: 2,
        visible: true,
        blocks: [
          block("hero", "hero-content", "hero-content", {
            eyebrow: store.niche,
            heading: store.name,
            description: store.audience,
            primaryButtonLabel: "Découvrir la collection",
            secondaryButtonLabel: "En savoir plus",
          }),
        ],
      },
      {
        id: "benefits-main",
        type: "benefits",
        position: 3,
        visible: true,
        blocks: [
          block("benefits", "benefits-intro", "benefits-intro", {
            heading: "Pourquoi nous choisir",
          }),
          block("benefits", "benefit-item", "benefit-1", {
            title: "Une sélection soignée",
            description: "Chaque produit est choisi avec exigence pour sa qualité.",
          }),
          block("benefits", "benefit-item", "benefit-2", {
            title: "Une expérience simple",
            description: "Parcourez, choisissez, commandez : rien de superflu.",
          }),
          block("benefits", "benefit-item", "benefit-3", {
            title: "Une marque à l’écoute",
            description: "Une question ? Nous vous répondons avec attention.",
          }),
        ],
      },
      {
        id: "featured-main",
        type: "featured-products",
        position: 4,
        visible: true,
        blocks: [
          block("featured-products", "featured-intro", "featured-intro", {
            heading: "La collection",
            description: "Nos produits du moment, sélectionnés pour vous.",
          }),
        ],
      },
      {
        // Masquée par défaut : ne jamais publier de témoignages inventés.
        id: "testimonials-main",
        type: "testimonials",
        position: 5,
        visible: false,
        blocks: [
          block("testimonials", "testimonials-intro", "testimonials-intro", {
            heading: "Ils nous font confiance",
          }),
          block("testimonials", "testimonial-item", "testimonial-1", {
            quote: "Ajoutez ici le témoignage réel d’un client.",
            author: "Prénom N.",
          }),
          block("testimonials", "testimonial-item", "testimonial-2", {
            quote: "Ajoutez ici le témoignage réel d’un autre client.",
            author: "Prénom N.",
          }),
        ],
      },
      {
        id: "faq-main",
        type: "faq",
        position: 6,
        visible: true,
        blocks: [
          block("faq", "faq-intro", "faq-intro", { heading: "Questions fréquentes" }),
          block("faq", "faq-item", "faq-1", {
            question: "Comment passer commande ?",
            answer: "Parcourez la collection, ajoutez vos articles au panier puis suivez les étapes de commande.",
          }),
          block("faq", "faq-item", "faq-2", {
            question: "Comment suivre les nouveautés ?",
            answer: "Revenez régulièrement sur la boutique : la collection évolue au fil des saisons.",
          }),
          block("faq", "faq-item", "faq-3", {
            question: "Comment nous contacter ?",
            answer: "Écrivez-nous, nous vous répondrons dès que possible.",
          }),
        ],
      },
      {
        // Masquée par défaut : la collecte d'e-mails n'est pas encore branchée.
        id: "newsletter-main",
        type: "newsletter",
        position: 7,
        visible: false,
        blocks: [
          block("newsletter", "newsletter-content", "newsletter-content", {
            heading: "Restez informé·e",
            description: `Recevez les nouveautés et l’actualité de ${store.name}.`,
            buttonLabel: "S’inscrire",
          }),
        ],
      },
      {
        id: "footer-main",
        type: "footer",
        position: 8,
        visible: true,
        blocks: [
          block("footer", "footer-content", "footer-content", {
            about: `${store.name} — ${store.niche}.`,
          }),
        ],
      },
    ],
  };
}

/** Pages non configurées dans le MVP : listées, sélectionnables plus tard. */
function placeholderPage(id: string, type: StorePage["type"], title: string, slug: string): StorePage {
  return { id, type, title, slug, status: "not-configured", sections: [] };
}

export function buildDefaultDocument(store: StoreSeed): StoreDocument {
  return {
    id: `doc-${store.id}`,
    storeId: store.id,
    version: 0,
    locale: "fr-FR",
    pages: [
      buildHomePage(store),
      placeholderPage("product-template", "product", "Page produit", "produit"),
      placeholderPage("collection-template", "collection", "Page collection", "collection"),
      placeholderPage("about", "content", "À propos", "a-propos"),
      placeholderPage("faq-page", "content", "FAQ", "faq"),
      placeholderPage("contact", "content", "Contact", "contact"),
    ],
  };
}
