import { cn } from "@/lib/utils";

function AiSpark() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden>
      <path d="M8 0c.4 2.8 1.2 3.6 4 4-2.8.4-3.6 1.2-4 4-.4-2.8-1.2-3.6-4-4 2.8-.4 3.6-1.2 4-4Z" />
    </svg>
  );
}

export type BadgeTone =
  | "neutral"
  | "forest"
  | "success"
  | "warning"
  | "danger"
  | "ai";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line bg-surface-2 text-ink-2",
  forest: "border-ink bg-ink text-pill-ink",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  ai: "border-accent/25 bg-accent-soft text-accent-ink",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-medium leading-none tracking-tight",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {tone === "ai" && <AiSpark />}
      {children}
    </span>
  );
}
