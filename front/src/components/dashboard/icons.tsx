/**
 * Jeu d'icônes "line" du dashboard (SVG inline, sans dépendance).
 * Toutes héritent de `currentColor` et acceptent une className.
 */
type IconProps = { className?: string };

function base(path: React.ReactNode, extra?: React.ReactNode) {
  return function Icon({ className = "size-5" }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {path}
        {extra}
      </svg>
    );
  };
}

export const IconOverview = base(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </>,
);

export const IconStore = base(
  <>
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    <path d="M9 20v-5h6v5" />
  </>,
);

export const IconBox = base(
  <>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </>,
);

export const IconReceipt = base(
  <>
    <path d="M5 3v18l2.5-1.5L10 21l2-1.5L14 21l2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5 5 3Z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </>,
);

export const IconUsers = base(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.6M17 20a5.5 5.5 0 0 0-3-4.9" />
  </>,
);

export const IconSparkles = base(
  <>
    <path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5Z" />
    <path d="M19 13c.2 1.4.6 1.8 2 2-1.4.2-1.8.6-2 2-.2-1.4-.6-1.8-2-2 1.4-.2 1.8-.6 2-2Z" />
  </>,
);

export const IconImage = base(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L18 19" />
  </>,
);

export const IconSettings = base(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </>,
);

export const IconSearch = base(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

export const IconBell = base(
  <>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </>,
);

export const IconPlus = base(<path d="M12 5v14M5 12h14" />);

export const IconMenu = base(<path d="M4 7h16M4 12h16M4 17h16" />);

export const IconClose = base(<path d="M6 6l12 12M18 6 6 18" />);

export const IconChevronDown = base(<path d="m6 9 6 6 6-6" />);

export const IconArrowUpRight = base(<path d="M7 17 17 7M9 7h8v8" />);

export const IconExternal = base(
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </>,
);

export const IconLogout = base(
  <>
    <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
    <path d="M10 12h9M16 8l3 4-3 4" />
  </>,
);

export const IconChartBar = base(
  <>
    <path d="M4 20V10M11 20V4M18 20v-7" />
    <path d="M3 20h18" />
  </>,
);

export const IconLock = base(
  <>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
  </>,
);

export const IconMail = base(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>,
);

export const IconMegaphone = base(
  <>
    <path d="M3 11v2a2 2 0 0 0 2 2h1l2 6h2l-1.5-6H10l9 4V5l-9 4H6a2 2 0 0 0-2 2Z" />
    <path d="M17 9v6" />
  </>,
);
