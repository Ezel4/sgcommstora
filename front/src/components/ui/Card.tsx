import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "flat";

const variantClasses: Record<CardVariant, string> = {
  default:
    "border border-line bg-surface shadow-[var(--elevation-1)]",
  elevated:
    "border border-line bg-elevated shadow-[var(--elevation-2)]",
  flat: "border border-transparent bg-surface-2",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export function Card({
  variant = "default",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[23px] transition-[border-color,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none",
        variantClasses[variant],
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--elevation-2)] motion-reduce:transform-none",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-0 sm:p-6 sm:pb-0", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-medium tracking-tight text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1.5 text-sm leading-relaxed text-ink-2", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 p-5 pt-0 sm:p-6 sm:pt-0",
        className,
      )}
      {...props}
    />
  );
}
