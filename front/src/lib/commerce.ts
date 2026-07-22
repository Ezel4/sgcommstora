import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { formatCurrency } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";
import * as mock from "@/data/mock-commerce";
import type {
  AiTask,
  Customer,
  DashboardMetric,
  Order,
  Product,
  Store,
  StoreStatus,
} from "@/types/commerce";

// -----------------------------------------------------------------------------
// Couche d'accès aux données commerce.
//
// Chaque fonction lit la boutique de l'utilisateur connecté depuis Supabase.
// Si Supabase n'est pas configuré, si l'utilisateur n'est pas connecté ou s'il
// n'a pas encore de boutique, on retombe sur le jeu de démonstration local
// (`isDemo: true`) — le dashboard reste ainsi lisible avant d'avoir de vraies
// données, comportement signalé par le bandeau du DashboardShell.
// -----------------------------------------------------------------------------

export type Demoable<T> = T & { isDemo: boolean };

// --- Mappers : lignes Supabase (snake_case) -> types applicatifs -------------

function mapStoreStatus(value: string): StoreStatus {
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

function mapProductStatus(row: Tables<"products">): Product["status"] {
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

function mapCustomerSegment(value: string): Customer["segment"] {
  if (value === "loyal" || value === "fidele") return "loyal";
  if (value === "at-risk" || value === "a-risque") return "at-risk";
  return "new";
}

function mapCustomer(row: Tables<"customers">): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    totalSpent: Number(row.total_spent),
    ordersCount: row.orders_count,
    segment: mapCustomerSegment(row.segment),
  };
}

function mapOrderStatus(value: string): Order["status"] {
  if (value === "paid" || value === "payee") return "paid";
  if (value === "shipped" || value === "expediee") return "shipped";
  if (value === "returned" || value === "retour") return "returned";
  return "processing";
}

function mapOrder(row: Tables<"orders">): Order {
  return {
    id: row.order_number,
    customerName: row.customer_name,
    total: Number(row.total),
    status: mapOrderStatus(row.status),
    itemsCount: row.items_count,
    createdAt: new Date(row.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
  };
}

function mapAiTaskStatus(value: string): AiTask["status"] {
  if (value === "ready") return "ready";
  if (value === "queued") return "queued";
  return "draft";
}

function mapAiTask(row: Tables<"ai_tasks">): AiTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    impact: row.impact ?? "",
    status: mapAiTaskStatus(row.status),
  };
}

// --- Résolution de la boutique active ----------------------------------------

type Resolved =
  | { isDemo: true; supabase: null; store: null }
  | { isDemo: false; supabase: Awaited<ReturnType<typeof createClient>>; store: Tables<"stores"> };

async function resolveStore(): Promise<Resolved> {
  if (!hasSupabaseConfig()) return { isDemo: true, supabase: null, store: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isDemo: true, supabase: null, store: null };

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!store) return { isDemo: true, supabase: null, store: null };
  return { isDemo: false, supabase, store };
}

// --- Métriques dérivées du dashboard -----------------------------------------

function buildMetrics(orders: Order[], products: Product[]): DashboardMetric[] {
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

// --- API publique ------------------------------------------------------------

export interface CommerceOverview {
  store: Store;
  products: Product[];
  orders: Order[];
  aiTasks: AiTask[];
  metrics: DashboardMetric[];
  isDemo: boolean;
}

export async function getCommerceOverview(): Promise<CommerceOverview> {
  const resolved = await resolveStore();

  if (resolved.isDemo) {
    return {
      store: mock.activeStore,
      products: mock.products,
      orders: mock.orders,
      aiTasks: mock.aiTasks,
      metrics: mock.dashboardMetrics,
      isDemo: true,
    };
  }

  const { supabase, store } = resolved;
  const [productsRes, ordersRes, tasksRes] = await Promise.all([
    supabase.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
    supabase.from("orders").select("*").eq("store_id", store.id).order("created_at", { ascending: false }).limit(100),
    supabase.from("ai_tasks").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
  ]);

  const products = (productsRes.data ?? []).map(mapProduct);
  const orders = (ordersRes.data ?? []).map(mapOrder);
  const aiTasks = (tasksRes.data ?? []).map(mapAiTask);

  return {
    store: mapStore(store),
    products,
    orders,
    aiTasks,
    metrics: buildMetrics(orders, products),
    isDemo: false,
  };
}

export async function getActiveStore(): Promise<Demoable<{ store: Store }>> {
  const resolved = await resolveStore();
  if (resolved.isDemo) return { store: mock.activeStore, isDemo: true };
  return { store: mapStore(resolved.store), isDemo: false };
}

export async function getProducts(): Promise<Demoable<{ products: Product[] }>> {
  const resolved = await resolveStore();
  if (resolved.isDemo) return { products: mock.products, isDemo: true };
  const { data } = await resolved.supabase
    .from("products")
    .select("*")
    .eq("store_id", resolved.store.id)
    .order("created_at", { ascending: false });
  return { products: (data ?? []).map(mapProduct), isDemo: false };
}

export async function getOrders(): Promise<Demoable<{ orders: Order[] }>> {
  const resolved = await resolveStore();
  if (resolved.isDemo) return { orders: mock.orders, isDemo: true };
  const { data } = await resolved.supabase
    .from("orders")
    .select("*")
    .eq("store_id", resolved.store.id)
    .order("created_at", { ascending: false })
    .limit(200);
  return { orders: (data ?? []).map(mapOrder), isDemo: false };
}

export async function getCustomers(): Promise<Demoable<{ customers: Customer[] }>> {
  const resolved = await resolveStore();
  if (resolved.isDemo) return { customers: mock.customers, isDemo: true };
  const { data } = await resolved.supabase
    .from("customers")
    .select("*")
    .eq("store_id", resolved.store.id)
    .order("total_spent", { ascending: false });
  return { customers: (data ?? []).map(mapCustomer), isDemo: false };
}
