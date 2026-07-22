import { cn } from "@/lib/utils";

export function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-white/[0.09] text-ink" : "text-ink-3 hover:bg-white/[0.04] hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
