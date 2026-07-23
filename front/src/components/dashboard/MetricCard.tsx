import type { DashboardMetric } from "@/types/commerce";
import { cn } from "@/lib/utils";
import { IconArrowUpRight } from "./icons";

const changeColor: Record<DashboardMetric["tone"], string> = {
  positive: "text-sage-ink",
  neutral: "text-ink-3",
  warning: "text-amber-ink",
};

export function MetricCard({
  metric,
  period,
  className,
}: {
  metric: DashboardMetric;
  period?: string;
  className?: string;
}) {
  return (
    <article className={cn("min-w-0 rounded-[23px] bg-surface-2 px-5 py-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-5 text-ink-3">{metric.label}</p>
        {period && <span className="shrink-0 rounded-full bg-white/55 px-2.5 py-1 text-xs text-ink-3">{period}</span>}
      </div>
      <p className="mt-2 break-words font-manrope text-[clamp(1.65rem,4vw,2rem)] font-normal leading-none tracking-[-0.045em] text-ink tabular-nums">
        {metric.value}
      </p>
      <p className={cn("mt-4 flex items-center gap-1.5 text-sm leading-5", changeColor[metric.tone])}>
        {metric.tone === "positive" && <IconArrowUpRight className="size-3.5" />}
        {metric.change}
      </p>
    </article>
  );
}
