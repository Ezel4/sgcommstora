import type { Tone } from "@/components/dashboard/StatusPill";
import type { Order, Product, Store } from "@/types/commerce";

type Entry = { tone: Tone; label: string };

export const orderStatus: Record<Order["status"], Entry> = {
  paid: { tone: "info", label: "Payée" },
  processing: { tone: "warning", label: "Traitement" },
  shipped: { tone: "positive", label: "Expédiée" },
  returned: { tone: "danger", label: "Retour" },
};

export const productStatus: Record<Product["status"], Entry> = {
  active: { tone: "positive", label: "Actif" },
  "low-stock": { tone: "warning", label: "Stock faible" },
  draft: { tone: "neutral", label: "Brouillon" },
};

export const storeStatus: Record<Store["status"], Entry> = {
  published: { tone: "positive", label: "En ligne" },
  "needs-review": { tone: "warning", label: "À valider" },
  draft: { tone: "neutral", label: "Brouillon" },
};

export const customerSegment: Record<"new" | "loyal" | "at-risk", Entry> = {
  new: { tone: "info", label: "Nouveau" },
  loyal: { tone: "positive", label: "Fidèle" },
  "at-risk": { tone: "danger", label: "À risque" },
};

export const metricTone: Record<"positive" | "neutral" | "warning", Tone> = {
  positive: "positive",
  neutral: "neutral",
  warning: "warning",
};
