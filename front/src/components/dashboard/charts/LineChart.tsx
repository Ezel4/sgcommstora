import { useId } from "react";

export function LineChart({
  data,
  labels = [],
  color = "#1fc5be",
  height = 190,
  formatValue = (value: number) => value.toLocaleString("fr-FR"),
  ariaLabel = "Évolution de la valeur sur la période",
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
}) {
  const instanceId = useId().replace(/:/g, "");

  if (data.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line px-5 py-12 text-center text-sm text-ink-3">Aucune donnée disponible pour cette période.</p>;
  }

  const w = 100;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const current = data[data.length - 1];
  const gradientId = `line-chart-${color.replace("#", "")}-${instanceId}`;

  const pts = data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * w;
    const y = max === min ? h / 2 : h - ((v - min) / (max - min)) * (h - 24) - 12;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const firstLabel = labels[0] ?? "Début";
  const lastLabel = labels[labels.length - 1] ?? "Aujourd’hui";

  return (
    <figure aria-label={ariaLabel}>
      <figcaption className="sr-only">
        Minimum {formatValue(min)}, maximum {formatValue(max)}, dernière valeur {formatValue(current)}, de {firstLabel} à {lastLabel}.
      </figcaption>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-3" aria-hidden>
        <span>Dernière valeur <strong className="ml-1 font-semibold text-ink">{formatValue(current)}</strong></span>
        <span>Minimum <strong className="ml-1 font-medium text-ink-2">{formatValue(min)}</strong></span>
        <span>Maximum <strong className="ml-1 font-medium text-ink-2">{formatValue(max)}</strong></span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.3" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1="0" x2={w} y1={h * ratio} y2={h * ratio} stroke="rgba(20,20,20,.08)" strokeWidth="0.45" />
        ))}
        <polygon points={area} fill={`url(#${gradientId})`} />
        <polyline points={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-ink-3" aria-hidden>
        <span>{firstLabel}</span>
        <span>{lastLabel}</span>
      </div>
    </figure>
  );
}
