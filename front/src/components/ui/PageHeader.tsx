import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  aside,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b border-line px-1 pb-6 pt-2 sm:px-4 lg:flex-row lg:items-end lg:justify-between lg:px-12",
        className,
      )}
    >
      <div className="min-w-0 max-w-3xl">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d’Ariane" className="mb-3">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-4">
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden>/</span>}
                  {item.href ? (
                    <Link href={item.href} className="rounded-sm transition hover:text-ink">
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink-3">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="mb-2 text-xs font-medium text-ink-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-[Manrope] text-[clamp(2rem,3.5vw,2.75rem)] font-normal leading-none tracking-[-0.055em] text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-3 sm:text-[0.95rem]">
            {description}
          </p>
        )}
      </div>

      {(actions || aside) && (
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          {aside}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
    </header>
  );
}
