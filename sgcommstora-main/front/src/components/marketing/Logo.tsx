import { useId } from "react";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  const gradientId = useId().replaceAll(":", "");

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#82a99e" />
          <stop offset="0.55" stopColor="#1fc5be" />
          <stop offset="1" stopColor="#2498c8" />
        </linearGradient>
      </defs>
      <rect
        x="20"
        y="2"
        width="25.5"
        height="25.5"
        rx="9"
        transform="rotate(45 20 2)"
        fill={`url(#${gradientId})`}
      />
      <rect
        x="20"
        y="11"
        width="12.7"
        height="12.7"
        rx="4.5"
        transform="rotate(45 20 11)"
        fill="#ffffff"
        fillOpacity="0.72"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <a href="#top" aria-label="Retour à l’accueil" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[1.05rem] font-medium tracking-tight text-ink max-[340px]:hidden">
        Stora
      </span>
    </a>
  );
}
