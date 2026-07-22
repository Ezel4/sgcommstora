import type {
  SettingsGroupDefinition,
  SettingsSectionId,
} from "./types";

export const SETTINGS_GROUPS: SettingsGroupDefinition[] = [
  {
    id: "account",
    label: "Compte personnel",
    sections: [
      {
        id: "profile",
        title: "Profil",
        description: "Avatar, coordonnées et préférences régionales personnelles.",
        icon: "user",
        keywords: ["prénom", "nom", "email", "téléphone", "avatar", "pays", "fuseau horaire"],
      },
      {
        id: "appearance",
        title: "Apparence",
        description: "Thème de l’interface et réduction des animations.",
        icon: "appearance",
        keywords: ["clair", "sombre", "système", "contraste", "animations"],
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "Canaux et alertes importantes de votre activité.",
        icon: "bell",
        keywords: ["email", "navigateur", "commandes", "stocks", "paiements", "alertes"],
      },
      {
        id: "security",
        title: "Sécurité",
        description: "Mot de passe, double authentification et appareils.",
        icon: "lock",
        keywords: ["mot de passe", "2fa", "double authentification", "connexion", "appareils"],
      },
      {
        id: "sessions",
        title: "Sessions et appareils",
        description: "Historique détaillé des connexions et sessions actives.",
        icon: "device",
        keywords: ["sessions", "appareils", "navigateur", "connexion"],
        status: "soon",
      },
    ],
  },
  {
    id: "store",
    label: "Boutique",
    sections: [
      {
        id: "store-general",
        title: "Informations générales",
        description: "Identité, contact et informations publiques de la boutique.",
        icon: "store",
        keywords: ["boutique", "raison sociale", "adresse", "TVA", "entreprise", "contact"],
      },
      {
        id: "visual-identity",
        title: "Identité visuelle",
        description: "Logo, couleurs, typographies et ton de marque.",
        icon: "palette",
        keywords: ["logo", "favicon", "couleurs", "police", "marque"],
        status: "visual",
      },
      {
        id: "domains",
        title: "Domaines",
        description: "Sous-domaine Sigmood, domaine personnalisé et DNS.",
        icon: "globe",
        keywords: ["domaine", "DNS", "SSL", "URL", "sous-domaine"],
      },
      {
        id: "locale",
        title: "Langue, région et devise",
        description: "Marché principal, devise, fuseau horaire et unités.",
        icon: "locale",
        keywords: ["langue", "pays", "devise", "euro", "poids", "région", "format"],
      },
      {
        id: "checkout",
        title: "Checkout",
        description: "Informations client, consentements et confirmation de commande.",
        icon: "checkout",
        keywords: ["commande", "panier", "newsletter", "paiement", "adresse", "checkout"],
      },
      {
        id: "payments",
        title: "Paiements boutique",
        description: "Moyens de paiement reçus par votre boutique.",
        icon: "card",
        keywords: ["Stripe", "carte bancaire", "Apple Pay", "Google Pay", "versements"],
      },
      {
        id: "shipping",
        title: "Livraison",
        description: "Zones, tarifs, livraison gratuite et retrait sur place.",
        icon: "truck",
        keywords: ["livraison", "expédition", "tarif", "transporteur", "retrait", "colis"],
      },
      {
        id: "taxes",
        title: "Taxes",
        description: "TVA, collecte des taxes et affichage TTC ou HT.",
        icon: "tax",
        keywords: ["taxes", "TVA", "TTC", "HT", "taux", "fiscal"],
      },
      {
        id: "legal",
        title: "Politiques et documents légaux",
        description: "CGV, confidentialité, retours et mentions légales.",
        icon: "document",
        keywords: ["CGV", "mentions légales", "confidentialité", "retour", "cookies"],
        status: "visual",
      },
    ],
  },
  {
    id: "team",
    label: "Équipe",
    sections: [
      {
        id: "team",
        title: "Membres",
        description: "Membres, rôles prédéfinis et accès à la boutique.",
        icon: "team",
        keywords: ["membres", "équipe", "utilisateurs", "accès", "inviter"],
      },
      {
        id: "invitations",
        title: "Invitations",
        description: "Invitations envoyées, expirées ou en attente.",
        icon: "team",
        keywords: ["invitation", "email", "renvoyer", "révoquer"],
        status: "soon",
      },
      {
        id: "roles",
        title: "Rôles et permissions",
        description: "Rôles prédéfinis et périmètres d’accès.",
        icon: "role",
        keywords: ["rôle", "permissions", "administrateur", "lecture seule", "marketing"],
        status: "visual",
      },
      {
        id: "activity",
        title: "Historique d’activité",
        description: "Journal vérifiable des actions importantes.",
        icon: "history",
        keywords: ["historique", "activité", "journal", "audit"],
        status: "soon",
      },
    ],
  },
  {
    id: "ai",
    label: "Intelligence artificielle",
    sections: [
      {
        id: "ai-preferences",
        title: "Préférences IA",
        description: "Ton, créativité, audience et validation des générations.",
        icon: "sparkles",
        keywords: ["IA", "ton", "créativité", "public cible", "tutoiement", "preset"],
      },
      {
        id: "store-generation",
        title: "Génération de boutique",
        description: "Style visuel et niveau d’automatisation souhaité.",
        icon: "sparkles",
        keywords: ["homepage", "génération", "automatisation", "style"],
        status: "visual",
      },
      {
        id: "content-generation",
        title: "Génération de contenu",
        description: "Préférences éditoriales des contenus produits.",
        icon: "document",
        keywords: ["contenu", "description produit", "CTA", "texte"],
        status: "visual",
      },
      {
        id: "ai-images",
        title: "Images IA",
        description: "Formats, ratios et validation manuelle des images.",
        icon: "image",
        keywords: ["image", "ratio", "packshot", "résolution", "compression"],
        status: "visual",
      },
      {
        id: "ai-history",
        title: "Historique et utilisation",
        description: "Traçabilité et volume des générations IA.",
        icon: "history",
        keywords: ["historique IA", "générations", "crédits"],
        status: "soon",
      },
    ],
  },
  {
    id: "sigmood",
    label: "Sigmood IA",
    sections: [
      {
        id: "subscription",
        title: "Abonnement",
        description: "Formule, renouvellement, limites et crédits inclus.",
        icon: "plan",
        keywords: ["abonnement", "formule", "plan", "renouvellement", "annuler"],
      },
      {
        id: "billing",
        title: "Facturation Sigmood IA",
        description: "Coordonnées de facturation et factures du SaaS.",
        icon: "invoice",
        keywords: ["facturation", "factures", "TVA", "moyen de paiement", "télécharger"],
      },
      {
        id: "usage",
        title: "Utilisation et crédits",
        description: "Crédits IA, stockage et limites du plan.",
        icon: "usage",
        keywords: ["crédits", "stockage", "utilisation", "limite"],
        status: "visual",
      },
      {
        id: "integrations",
        title: "Intégrations",
        description: "Services tiers disponibles ou à venir.",
        icon: "integration",
        keywords: ["intégrations", "Analytics", "Meta", "Klaviyo", "Zapier"],
        status: "soon",
      },
      {
        id: "privacy",
        title: "Données et confidentialité",
        description: "Export, consentements, historique IA et demandes RGPD.",
        icon: "privacy",
        keywords: ["données", "confidentialité", "RGPD", "export", "cookies", "consentement"],
      },
      {
        id: "support",
        title: "Support",
        description: "Aide, documentation et demande de support.",
        icon: "support",
        keywords: ["support", "aide", "documentation", "bug", "contact"],
      },
    ],
  },
  {
    id: "sensitive",
    label: "Zone sensible",
    sections: [
      {
        id: "danger",
        title: "Actions sensibles",
        description: "Transfert, désactivation et suppression avec confirmation.",
        icon: "danger",
        keywords: ["transfert", "désactiver", "dépublier", "supprimer", "compte", "boutique"],
      },
    ],
  },
];

export const SETTINGS_SECTIONS = SETTINGS_GROUPS.flatMap((group) =>
  group.sections.map((section) => ({ ...section, group: group.label })),
);

export const SETTINGS_SECTION_BY_ID = Object.fromEntries(
  SETTINGS_SECTIONS.map((section) => [section.id, section]),
) as Record<SettingsSectionId, (typeof SETTINGS_SECTIONS)[number]>;

export const SECTION_URL_SLUGS: Record<SettingsSectionId, string> = {
  profile: "profil",
  appearance: "apparence",
  notifications: "notifications",
  security: "securite",
  sessions: "sessions",
  "store-general": "boutique",
  "visual-identity": "identite-visuelle",
  domains: "domaines",
  locale: "langue-devise",
  checkout: "checkout",
  payments: "paiements",
  shipping: "livraison",
  taxes: "taxes",
  legal: "documents-legaux",
  team: "equipe",
  invitations: "invitations",
  roles: "roles",
  activity: "activite",
  "ai-preferences": "preferences-ia",
  "store-generation": "generation-boutique",
  "content-generation": "generation-contenu",
  "ai-images": "images-ia",
  "ai-history": "historique-ia",
  subscription: "abonnement",
  billing: "facturation",
  usage: "utilisation",
  integrations: "integrations",
  privacy: "confidentialite",
  support: "support",
  danger: "zone-sensible",
};

const SECTION_ID_BY_URL = Object.fromEntries(
  Object.entries(SECTION_URL_SLUGS).map(([id, slug]) => [slug, id]),
) as Record<string, SettingsSectionId>;

export function resolveSettingsSection(
  value: string | null | undefined,
  action?: string | null,
): SettingsSectionId {
  if (action === "contact") return "support";
  if (!value) return "profile";
  if (value in SECTION_ID_BY_URL) return SECTION_ID_BY_URL[value];
  if (value in SETTINGS_SECTION_BY_ID) return value as SettingsSectionId;
  return "profile";
}
