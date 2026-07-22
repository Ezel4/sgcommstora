import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedClasses = {
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const;

export function Skeleton({
  rounded = "md",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton-shimmer",
        roundedClasses[rounded],
        className,
      )}
      {...props}
    />
  );
}

/** Bloc de carte squelette prêt à l'emploi pour les états de chargement. */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-stroke bg-cream/50 p-6">
      <div className="flex items-center gap-3">
        <Skeleton rounded="full" className="size-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton rounded="lg" className="mt-5 h-24 w-full" />
    </div>
  );
}
