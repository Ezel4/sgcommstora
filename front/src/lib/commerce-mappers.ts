import type { Tables } from "@/lib/supabase/database.types";
import type {
  AiTask,
  Customer,
  DashboardMetric,
  Order,
  Product,
  Store,
  StoreStatus,
} from "@/types/commerce";
import { formatCurrency } from "@/lib/format";

// Mappers purs : lignes Supabase (snake_case) -> types applicatifs.
// Aucune dépendance serveur ici, ce module est directement testable.

export function mapStoreStatus(value: string): StoreStatus {
  if (value === "published") return "published";
  if (value === "draft") return "draft";
  return "needs-review";
}

export function mapStore(row: Tables<"stores">): Store {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    niche: row.niche ?? "",
    audience: row.audience ?? "",
    visualStyle: row.visual_style ?? "",
    status: mapStoreStatus(row.status),
    subdomain: row.subdomain ?? "",
    conversionRate: Number(row.conversion_rate),
    generatedAt: row.generated_at,
  };
}

export function mapProductStatus(row: Tables<"products">): Product["status"] {
  if (row.status === "draft") return "draft";
  if (row.status === "low-stock" || row.stock <= 5) return "low-stock";
  return "active";
}

export function mapProduct(row: Tables<"products">): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? "",
    price: Number(row.price),
    stock: row.stock,
    status: mapProductStatus(row),
    imagePrompt: row.image_prompt ?? "",
    marginRate: Number(row.margin_rate ?? 0),
  };
}

export function mapCustomerSegment(value: string): Customer["segment"] {
  if (value === "loyal" || value === "fidele") return "loyal";
  if (value === "at-risk" || value === "a-risque") return "at-risk";
  return "new";
}

export function mapCustomer(row: Tables<"customers">): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    totalSpent: Number(row.total_spent),
    ordersCount: row.orders_count,
    segment: mapCustomerSegment(row.segment),
  };
}

export function mapOrderStatus(value: string): Order["status"] {
  if (value === "paid" || value === "payee") return "paid";
  if (value === "shipped" || value === "expediee") return "shipped";
  if (value === "returned" || value === "retour") return "returned";
  return "processing";
}

export function mapOrder(row: Tables<"orders">): Order {
  return {
    id: row.order_number,
    customerName: row.customer_name,
    total: Number(row.total),
    status: mapOrderStatus(row.status),
    itemsCount: row.items_count,
    createdAt: new Date(row.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
  };
}

export function mapAiTaskStatus(value: string): AiTask["status"] {
  if (value === "ready") return "ready";
  if (value === "queued") return "queued";
  return "draft";
}

export function mapAiTask(row: Tables<"ai_tasks">): AiTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    impact: row.impact ?? "",
    status: mapAiTaskStatus(row.status),
  };
}

// Métriques du dashboard dérivées des commandes et produits.
export function buildMetrics(orders: Order[], products: Product[]): DashboardMetric[] {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageBasket = orders.length > 0 ? revenue / orders.length : 0;
  const lowStock = products.filter((product) => product.status === "low-stock").length;

  return [
    { label: "Chiffre d'affaires", value: formatCurrency(revenue), change: `${orders.length} commande${orders.length > 1 ? "s" : ""}`, tone: "positive" },
    { label: "Commandes", value: String(orders.length), change: "sur la période", tone: "neutral" },
    { label: "Panier moyen", value: formatCurrency(averageBasket), change: "toutes commandes", tone: "positive" },
    { label: "Stock critique", value: `${lowStock} SKU`, change: lowStock > 0 ? "À traiter" : "Stock maîtrisé", tone: lowStock > 0 ? "warning" : "neutral" },
  ];
}
