import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-ink bg-ink text-pill-ink shadow-[var(--elevation-2)] hover:bg-ink/90 hover:shadow-[var(--elevation-3)]",
  secondary:
    "border border-line-strong bg-elevated text-ink shadow-[var(--elevation-1)] hover:border-ink/20 hover:bg-surface-2",
  ghost:
    "border border-transparent bg-transparent text-ink-2 hover:border-line hover:bg-surface hover:text-ink",
  danger:
    "border border-danger bg-danger text-white shadow-[var(--elevation-1)] hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
};

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight",
          "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "enabled:active:translate-y-px enabled:hover:-translate-y-px motion-reduce:transform-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
