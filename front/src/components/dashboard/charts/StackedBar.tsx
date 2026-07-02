import type { Tone } from "@/components/dashboard/StatusPill";

const toneDot: Record<Tone, string> = {
  positive: "bg-sage",
  info: "bg-accent",
  warning: "bg-amber",
  danger: "bg-rose",
  neutral: "bg-ink-3",
};

export function StackedBar({
  segments,
}: {
  segments: { label: string; sessions: number; sharePct: number; tone: Tone }[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {segments.map((s) => (
          <div key={s.label} className={toneDot[s.tone]} style={{ width: `${s.sharePct}%` }} />
        ))}
      </div>

      <div className="divide-y divide-line">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className={`size-2 shrink-0 rounded-full ${toneDot[s.tone]}`} />
            <span className="min-w-0 flex-1 truncate text-sm text-ink-2">{s.label}</span>
            <span className="shrink-0 text-sm tabular-nums text-ink-3">{s.sessions.toLocaleString("fr-FR")}</span>
            <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums text-ink">{s.sharePct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
