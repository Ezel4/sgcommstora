import type {
  AiTask,
  Customer,
  DashboardMetric,
  Order,
  Product,
  Store,
} from "@/types/commerce";

export const activeStore: Store = {
  id: "store_atelier-nival",
  name: "Atelier Nival",
  slug: "atelier-nival",
  niche: "Cosmetiques naturels premium",
  audience: "Femmes urbaines 25-40 ans sensibles au clean beauty",
  visualStyle: "Minimal, editorial, creme et noir",
  status: "needs-review",
  subdomain: "atelier-nival.sigmood.app",
  conversionRate: 3.8,
  generatedAt: "2026-05-01",
};

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Chiffre d'affaires", value: "18 420 EUR", change: "+14,2%", tone: "positive" },
  { label: "Commandes", value: "326", change: "+32 cette semaine", tone: "positive" },
  { label: "Panier moyen", value: "56,50 EUR", change: "+4,10 EUR", tone: "positive" },
  { label: "Stock critique", value: "4 SKU", change: "A traiter", tone: "warning" },
];

export const products: Product[] = [
  {
    id: "prod_001",
    name: "Serum Lumiere C15",
    category: "Soin visage",
    price: 49,
    stock: 42,
    status: "active",
    imagePrompt: "Packshot premium sur pierre claire, lumiere naturelle douce",
    marginRate: 68,
  },
  {
    id: "prod_002",
    name: "Creme Nuit Reparation",
    category: "Soin visage",
    price: 59,
    stock: 13,
    status: "low-stock",
    imagePrompt: "Pot creme dans un decor editorial beige et noir",
    marginRate: 63,
  },
  {
    id: "prod_003",
    name: "Routine Decouverte",
    category: "Bundle",
    price: 119,
    stock: 28,
    status: "active",
    imagePrompt: "Coffret rituel beaute minimaliste, reflet premium",
    marginRate: 71,
  },
  {
    id: "prod_004",
    name: "Huile Corps Satin",
    category: "Corps",
    price: 0,
    stock: 0,
    status: "draft",
    imagePrompt: "Flacon ambre sur fond studio, peau lumineuse en contexte",
    marginRate: 58,
  },
];

export const orders: Order[] = [
  {
    id: "#SG-1048",
    customerName: "Nora Lambert",
    total: 119,
    status: "paid",
    itemsCount: 1,
    createdAt: "Aujourd'hui, 10:24",
  },
  {
    id: "#SG-1047",
    customerName: "Amel R.",
    total: 88,
    status: "processing",
    itemsCount: 2,
    createdAt: "Aujourd'hui, 09:12",
  },
  {
    id: "#SG-1046",
    customerName: "Camille Dumas",
    total: 59,
    status: "shipped",
    itemsCount: 1,
    createdAt: "Hier, 18:40",
  },
  {
    id: "#SG-1045",
    customerName: "Laura Martin",
    total: 158,
    status: "returned",
    itemsCount: 3,
    createdAt: "Hier, 15:05",
  },
];

export const customers: Customer[] = [
  {
    id: "cus_001",
    name: "Nora Lambert",
    email: "nora@example.fr",
    totalSpent: 346,
    ordersCount: 4,
    segment: "loyal",
  },
  {
    id: "cus_002",
    name: "Amel R.",
    email: "amel@example.fr",
    totalSpent: 88,
    ordersCount: 1,
    segment: "new",
  },
  {
    id: "cus_003",
    name: "Camille Dumas",
    email: "camille@example.fr",
    totalSpent: 214,
    ordersCount: 3,
    segment: "loyal",
  },
];

export const aiTasks: AiTask[] = [
  {
    id: "task_001",
    title: "Optimiser la fiche Serum Lumiere C15",
    description: "Le taux d'ajout panier est bon, mais le bloc benefices manque de preuves.",
    impact: "+6% conversion estimee",
    status: "ready",
  },
  {
    id: "task_002",
    title: "Creer 3 visuels ads pour la Routine Decouverte",
    description: "Decliner le bundle en formats Meta Ads avec angle cadeau premium.",
    impact: "Creation image IA",
    status: "draft",
  },
  {
    id: "task_003",
    title: "Relance stock faible Creme Nuit",
    description: "Preparer un message fournisseur et masquer le produit si le stock passe sous 5.",
    impact: "Risque rupture",
    status: "queued",
  },
];
