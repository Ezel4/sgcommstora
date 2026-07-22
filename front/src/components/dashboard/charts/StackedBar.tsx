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
  if (segments.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-ink-3">Aucune source de trafic disponible pour cette période.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/60" aria-hidden>
        {segments.map((s) => (
          <div key={s.label} className={toneDot[s.tone]} style={{ width: `${s.sharePct}%` }} />
        ))}
      </div>

      <ul className="divide-y divide-line" aria-label="Répartition des sessions par source de trafic">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className={`size-2 shrink-0 rounded-full ${toneDot[s.tone]}`} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm text-ink-2">{s.label}</span>
            <span className="shrink-0 text-sm tabular-nums text-ink-3">{s.sessions.toLocaleString("fr-FR")}</span>
            <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums text-ink">{s.sharePct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
