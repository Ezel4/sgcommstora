export type StoreStatus = "draft" | "published" | "needs-review";

export interface Store {
  id: string;
  name: string;
  slug: string;
  niche: string;
  audience: string;
  visualStyle: string;
  status: StoreStatus;
  subdomain: string;
  conversionRate: number;
  generatedAt: string;
}

// Sous-ensemble sérialisable de Store passé aux composants du shell (client).
export type StoreSummary = Pick<Store, "name" | "slug" | "status">;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "low-stock";
  imagePrompt: string;
  marginRate: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  segment: "new" | "loyal" | "at-risk";
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "paid" | "processing" | "shipped" | "returned";
  itemsCount: number;
  createdAt: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "warning";
}

export interface AiTask {
  id: string;
  title: string;
  description: string;
  impact: string;
  status: "ready" | "queued" | "draft";
}
