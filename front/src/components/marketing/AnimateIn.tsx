import type { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

/**
 * Marque le bloc pour le reveal au scroll piloté par GSAP (voir SmoothScroll).
 * Si GSAP/JS est indisponible, le contenu reste visible (fallback).
 */
export default function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimateInProps) {
  return (
    <div
      data-reveal={direction}
      data-reveal-delay={delay || undefined}
      className={className}
    >
      {children}
    </div>
  );
}
