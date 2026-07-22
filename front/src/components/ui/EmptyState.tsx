import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  /** Icône / illustration. Une illustration organique par défaut si absent. */
  icon?: React.ReactNode;
  /** Bouton(s) d'action — généralement un <Button>. */
  action?: React.ReactNode;
}

function DefaultIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-9" aria-hidden>
      <path
        d="M12 26c0-1.1.9-2 2-2h36a2 2 0 0 1 2 2v22a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V26Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 24v-4a8 8 0 0 1 16 0v4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="38" r="3" fill="currentColor" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-stroke-strong",
        "bg-gradient-to-br from-white/70 via-cream/70 to-accent-soft/50 px-6 py-14 text-center sm:py-16",
        className,
      )}
      {...props}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-amber/10 blur-3xl" />
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-[20px] border border-line bg-white/80 text-accent-ink shadow-[var(--shadow-soft)]">
        {icon ?? <DefaultIllustration />}
      </div>
      <h3 className="relative text-lg font-semibold tracking-tight text-forest">{title}</h3>
      {description && (
        <p className="relative mt-2 max-w-md text-sm leading-6 text-forest/65">
          {description}
        </p>
      )}
      {action && <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
