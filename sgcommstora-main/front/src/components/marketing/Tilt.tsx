"use client";

import { useRef, type ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Amplitude maximale de rotation en degrés (défaut 9). */
  max?: number;
  /** Affiche un reflet lumineux qui suit le curseur. */
  glare?: boolean;
}

/**
 * Carte 3D : suit le curseur avec une rotation perspective + reflet de lumière.
 * Effet purement CSS/JS (aucune dépendance), respecte prefers-reduced-motion via la
 * désactivation au niveau du conteneur si besoin.
 */
export function Tilt({ children, className = "", max = 9, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 → 1
    const py = (e.clientY - rect.top) / rect.height; // 0 → 1
    const rotateY = (px - 0.5) * (max * 2);
    const rotateX = (0.5 - py) * (max * 2);

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-o", glare ? "0.18" : "0");
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare-o", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`tilt-card ${className}`}
    >
      <div className="tilt-card__inner">
        {children}
        {glare && <span aria-hidden className="tilt-card__glare" />}
      </div>
    </div>
  );
}
