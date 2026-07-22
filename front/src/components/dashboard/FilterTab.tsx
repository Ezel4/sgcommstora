import { cn } from "@/lib/utils";

export function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white/35 text-ink-3 hover:border-line-strong hover:bg-white/70 hover:text-ink",
      )}
    >
      {label}
      {typeof count === "number" && (
        <span className={cn("text-xs tabular-nums", active ? "text-white/70" : "text-ink-4")}>{count}</span>
      )}
    </button>
  );
}
