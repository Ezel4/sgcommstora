import { cn } from "@/lib/utils";

export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-[22px] bg-surface-2", className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="min-w-0">
            {typeof title === "string" ? (
              <h2 className="font-[Manrope] text-[17px] font-medium tracking-[-.035em] text-ink">{title}</h2>
            ) : (
              title
            )}
            {description && <p className="mt-1 text-sm leading-6 text-ink-3">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
