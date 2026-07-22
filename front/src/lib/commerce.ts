import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import type { Tables } from "@/lib/supabase/database.types";
import * as mock from "@/data/mock-commerce";
import {
  buildMetrics,
  mapAiTask,
  mapCustomer,
  mapOrder,
  mapProduct,
  mapStore,
} from "@/lib/commerce-mappers";
import type {
  AiTask,
  Customer,
  DashboardMetric,
  Order,
  Product,
  Store,
} from "@/types/commerce";

// -----------------------------------------------------------------------------
// Couche d'accès aux données commerce.
//
// Chaque fonction lit la boutique de l'utilisateur connecté depuis Supabase.
// Si Supabase n'est pas configuré, si l'utilisateur n'est pas connecté ou s'il
// n'a pas encore de boutique, on retombe sur le jeu de démonstration local
// (`isDemo: true`) — le dashboard reste ainsi lisible avant d'avoir de vraies
// données, comportement signalé par le bandeau du DashboardShell.
//
// Les mappers purs vivent dans `commerce-mappers.ts` (sans dépendance serveur).
// -----------------------------------------------------------------------------

export type Demoable<T> = T & { isDemo: boolean };

// Ré-export pour les modules qui consomment les mappers (ex. lib/stores.ts).
export { mapStore, mapProduct } from "@/lib/commerce-mappers";

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
