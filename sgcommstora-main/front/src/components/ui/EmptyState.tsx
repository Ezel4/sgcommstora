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
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-stroke-strong",
        "bg-cream/40 px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-forest-soft text-forest">
        {icon ?? <DefaultIllustration />}
      </div>
      <h3 className="text-base font-bold tracking-tight text-forest">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-forest/55">
          {description}
        </p>
      )}
      {action && <div className="mt-6 flex items-center gap-3">{action}</div>}
    </div>
  );
}
