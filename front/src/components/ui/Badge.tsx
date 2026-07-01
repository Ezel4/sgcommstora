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
  neutral: "border-stroke bg-cream-soft text-forest/70",
  forest: "border-forest/20 bg-forest-soft text-forest",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
  danger: "border-danger/25 bg-danger-soft text-danger",
  ai: "border-forest/20 bg-cream/80 text-forest backdrop-blur-md",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[11px] font-bold uppercase tracking-wider",
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
