import { cn } from "@/lib/utils";

export type Tone = "positive" | "info" | "warning" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  positive: "border-success/25 bg-success-soft text-success",
  info: "border-accent/25 bg-accent-soft text-accent-ink",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "text-danger border-danger/25 bg-danger-soft",
  neutral: "border-line bg-white/55 text-ink-3",
};

export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold tracking-tight",
        toneClasses[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
