// Palette organique unique - voir DESIGN_SYSTEM.md.
function AiSpark() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden>
      <path d="M8 0c.4 2.8 1.2 3.6 4 4-2.8.4-3.6 1.2-4 4-.4-2.8-1.2-3.6-4-4 2.8-.4 3.6-1.2 4-4Z" />
    </svg>
  );
}

const toneClasses = {
  positive: "border-success/25 bg-success-soft text-success",
  neutral: "border-stroke bg-cream-soft text-forest/70",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  ai: "border-forest/20 bg-forest-soft text-forest",
};

export default function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
}) {
  const classes =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-tight " +
    toneClasses[tone];

  return (
    <span className={classes}>
      {tone === "ai" && <AiSpark />}
      {children}
    </span>
  );
}
