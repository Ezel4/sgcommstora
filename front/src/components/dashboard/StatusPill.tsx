import { cn } from "@/lib/utils";

export type Tone = "positive" | "info" | "warning" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  positive: "text-sage border-[rgba(118,145,111,0.32)] bg-[rgba(118,145,111,0.12)]",
  info: "text-accent border-[rgba(84,184,168,0.32)] bg-accent-soft",
  warning: "text-amber border-[rgba(208,160,107,0.32)] bg-[rgba(208,160,107,0.12)]",
  danger: "text-rose border-[rgba(205,144,137,0.34)] bg-[rgba(205,144,137,0.12)]",
  neutral: "text-ink-3 border-line bg-white/[0.04]",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-tight",
        toneClasses[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
