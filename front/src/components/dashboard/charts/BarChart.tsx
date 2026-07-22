export function BarChart({
  items,
  formatValue = (v: number) => String(v),
  ariaLabel = "Comparaison des valeurs",
}: {
  items: { label: string; value: number; meta?: string }[];
  formatValue?: (v: number) => string;
  ariaLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-ink-3">Aucune donnée disponible pour cette période.</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-5" aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-2 flex items-end justify-between gap-4 text-sm">
            <span className="min-w-0 text-ink-2">
              <span className="block truncate font-medium text-ink">{item.label}</span>
              {item.meta && <span className="mt-0.5 block text-xs text-ink-3">{item.meta}</span>}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">{formatValue(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/60" aria-hidden>
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${item.value <= 0 ? 0 : Math.max(2, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
