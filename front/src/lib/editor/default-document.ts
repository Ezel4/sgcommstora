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

import type { StoreDocument, StorePage } from "./document-schema";
import { buildBlock as block } from "./section-library";

export interface StoreSeed {
  id: string;
  name: string;
  slug: string;
  niche: string;
  audience: string;
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

/**
 * Gabarit de page produit : le visuel, le nom et le prix proviennent du
 * catalogue (contenu dynamique) ; seuls les textes autour sont éditables.
 * Ce gabarit s'applique à toutes les fiches produit.
 */
export function buildProductPage(store: StoreSeed): StorePage {
  return {
    id: "product-template",
    type: "product",
    title: "Page produit",
    slug: "produit",
    status: "configured",
    sections: [
      {
        id: "product-header",
        type: "header",
        position: 0,
        visible: true,
        blocks: [block("header", "header-content", "product-header-content", { ctaLabel: "Voir la collection" })],
      },
      {
        id: "product-overview-main",
        type: "product-overview",
        position: 1,
        visible: true,
        blocks: [
          block("product-overview", "product-overview-content", "product-overview-content", {
            ctaLabel: "Ajouter au panier",
            reassurance: "Paiement sécurisé et service client à votre écoute.",
            detailsHeading: "Détails du produit",
          }),
        ],
      },
      {
        id: "product-benefits",
        type: "benefits",
        position: 2,
        visible: true,
        blocks: [
          block("benefits", "benefits-intro", "product-benefits-intro", { heading: "Nos engagements" }),
          block("benefits", "benefit-item", "product-benefit-1", {
            title: "Une qualité vérifiée",
            description: "Chaque produit est contrôlé avant expédition.",
          }),
          block("benefits", "benefit-item", "product-benefit-2", {
            title: "Un achat serein",
            description: "Paiement sécurisé et informations claires.",
          }),
          block("benefits", "benefit-item", "product-benefit-3", {
            title: "Un service à l’écoute",
            description: "Une question ? Nous vous répondons avec attention.",
          }),
        ],
      },
      {
        id: "product-footer",
        type: "footer",
        position: 3,
        visible: true,
        blocks: [block("footer", "footer-content", "product-footer-content", { about: `${store.name} — ${store.niche}.` })],
      },
    ],
  };
}

/** Gabarit de page collection : en-tête éditable + grille de produits dynamique. */
export function buildCollectionPage(store: StoreSeed): StorePage {
  return {
    id: "collection-template",
    type: "collection",
    title: "Page collection",
    slug: "collection",
    status: "configured",
    sections: [
      {
        id: "collection-header-nav",
        type: "header",
        position: 0,
        visible: true,
        blocks: [block("header", "header-content", "collection-header-content-nav", { ctaLabel: "Voir la collection" })],
      },
      {
        id: "collection-header-main",
        type: "collection-header",
        position: 1,
        visible: true,
        blocks: [
          block("collection-header", "collection-header-content", "collection-header-content", {
            eyebrow: store.niche,
            heading: "La collection",
            description: "Parcourez l’ensemble de nos produits, sélectionnés avec soin.",
          }),
        ],
      },
      {
        id: "collection-featured",
        type: "featured-products",
        position: 2,
        visible: true,
        blocks: [
          block("featured-products", "featured-intro", "collection-featured-intro", {
            heading: "Tous les produits",
            description: "L’intégralité de la collection, mise à jour au fil des saisons.",
          }),
        ],
      },
      {
        id: "collection-footer",
        type: "footer",
        position: 3,
        visible: true,
        blocks: [block("footer", "footer-content", "collection-footer-content", { about: `${store.name} — ${store.niche}.` })],
      },
    ],
  };
}

/** En-tête + pied de page partagés par les pages de contenu (ids propres à la page). */
function contentPageChrome(store: StoreSeed, prefix: string): { header: StorePage["sections"][number]; footer: StorePage["sections"][number] } {
  return {
    header: {
      id: `${prefix}-header`,
      type: "header",
      position: 0,
      visible: true,
      blocks: [block("header", "header-content", `${prefix}-header-content`, { ctaLabel: "Voir la collection" })],
    },
    footer: {
      id: `${prefix}-footer`,
      type: "footer",
      position: 99,
      visible: true,
      blocks: [block("footer", "footer-content", `${prefix}-footer-content`, { about: `${store.name} — ${store.niche}.` })],
    },
  };
}

/** Page « À propos » : présentation libre de la marque. */
export function buildAboutPage(store: StoreSeed): StorePage {
  const { header, footer } = contentPageChrome(store, "about");
  return {
    id: "about",
    type: "content",
    title: "À propos",
    slug: "a-propos",
    status: "configured",
    sections: [
      header,
      {
        id: "about-content",
        type: "content-section",
        position: 1,
        visible: true,
        blocks: [
          block("content-section", "content-body", "about-body-1", {
            heading: `À propos de ${store.name}`,
            body: `Présentez ici votre marque : votre histoire, ce qui vous distingue et l’attention que vous portez à ${store.audience.toLocaleLowerCase("fr-FR")}.`,
          }),
          block("content-section", "content-body", "about-body-2", {
            heading: "Notre engagement",
            body: "Décrivez vos valeurs et ce que vos clients peuvent attendre de vous, sans promesse chiffrée non vérifiée.",
          }),
        ],
      },
      { ...footer, position: 2 },
    ],
  };
}

/** Page FAQ : questions fréquentes dédiées. */
export function buildFaqPage(store: StoreSeed): StorePage {
  const { header, footer } = contentPageChrome(store, "faq-page");
  return {
    id: "faq-page",
    type: "content",
    title: "FAQ",
    slug: "faq",
    status: "configured",
    sections: [
      header,
      {
        id: "faq-page-main",
        type: "faq",
        position: 1,
        visible: true,
        blocks: [
          block("faq", "faq-intro", "faq-page-intro", { heading: "Questions fréquentes" }),
          block("faq", "faq-item", "faq-page-1", {
            question: "Comment passer commande ?",
            answer: "Parcourez la collection, ajoutez vos articles au panier puis suivez les étapes de commande.",
          }),
          block("faq", "faq-item", "faq-page-2", {
            question: "Comment vous contacter ?",
            answer: "Écrivez-nous depuis la page Contact, nous vous répondrons dès que possible.",
          }),
        ],
      },
      { ...footer, position: 2 },
    ],
  };
}

/** Page Contact : informations de contact rédigées librement. */
export function buildContactPage(store: StoreSeed): StorePage {
  const { header, footer } = contentPageChrome(store, "contact");
  return {
    id: "contact",
    type: "content",
    title: "Contact",
    slug: "contact",
    status: "configured",
    sections: [
      header,
      {
        id: "contact-content",
        type: "content-section",
        position: 1,
        visible: true,
        blocks: [
          block("content-section", "content-body", "contact-body-1", {
            heading: "Nous contacter",
            body: "Indiquez ici comment vos clients peuvent vous joindre : adresse e-mail, réseaux sociaux ou formulaire. Renseignez vos coordonnées réelles avant publication.",
          }),
        ],
      },
      { ...footer, position: 2 },
    ],
  };
}

export function buildDefaultDocument(store: StoreSeed): StoreDocument {
  return {
    id: `doc-${store.id}`,
    storeId: store.id,
    version: 0,
    locale: "fr-FR",
    pages: [
      buildHomePage(store),
      buildProductPage(store),
      buildCollectionPage(store),
      buildAboutPage(store),
      buildFaqPage(store),
      buildContactPage(store),
    ],
  };
}
