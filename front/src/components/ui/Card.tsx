import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "flat";

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-cream/70 border border-stroke shadow-[var(--shadow-soft)] hover:border-forest/20 hover:shadow-[var(--shadow-card-hover)]",
  elevated:
    "bg-cream-elevated border border-stroke shadow-[var(--shadow-organic)]",
  flat: "bg-forest-soft border border-stroke",
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
        "rounded-2xl transition-all duration-300 ease-out",
        variantClasses[variant],
        interactive && "cursor-pointer hover:-translate-y-0.5",
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
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-bold tracking-tight text-forest",
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
      className={cn("mt-1 text-sm font-light text-forest/60", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-6 pt-0",
        className,
      )}
      {...props}
    />
  );
}
