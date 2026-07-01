export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="storaMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4efe8" />
          <stop offset="1" stopColor="#cd9089" />
        </linearGradient>
      </defs>
      <rect
        x="20"
        y="2"
        width="25.5"
        height="25.5"
        rx="9"
        transform="rotate(45 20 2)"
        fill="url(#storaMark)"
      />
      <rect
        x="20"
        y="11"
        width="12.7"
        height="12.7"
        rx="4.5"
        transform="rotate(45 20 11)"
        fill="#0a0a0c"
        fillOpacity="0.22"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[1.05rem] font-medium tracking-tight text-ink">
        Stora
      </span>
    </a>
  );
}
