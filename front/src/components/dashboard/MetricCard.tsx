import type { DashboardMetric } from "@/types/commerce";
import { cn } from "@/lib/utils";
import { IconArrowUpRight } from "./icons";

const changeColor: Record<DashboardMetric["tone"], string> = {
  positive: "text-sage",
  neutral: "text-ink-3",
  warning: "text-amber",
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong">
      <p className="text-sm text-ink-3">{metric.label}</p>
      <p className="mt-2 text-[1.7rem] font-light leading-none tracking-tight text-ink">
        {metric.value}
      </p>
      <p className={cn("mt-3 flex items-center gap-1 text-xs", changeColor[metric.tone])}>
        {metric.tone === "positive" && <IconArrowUpRight className="size-3.5" />}
        {metric.change}
      </p>
    </div>
  );
}
