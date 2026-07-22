/**
 * Icônes de l'éditeur (SVG inline, sans dépendance). Héritent de currentColor.
 */
type IconProps = { className?: string };

function base(path: React.ReactNode) {
  return function Icon({ className = "size-4" }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {path}
      </svg>
    );
  };
}

export const IconBack = base(<path d="M15 18l-6-6 6-6" />);
export const IconUndo = base(
  <>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 0 10h-1" />
  </>,
);
export const IconRedo = base(
  <>
    <path d="M15 14l5-5-5-5" />
    <path d="M20 9H9a5 5 0 0 0 0 10h1" />
  </>,
);
export const IconEye = base(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const IconDesktop = base(
  <>
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </>,
);
export const IconTablet = base(
  <>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
  </>,
);
export const IconMobile = base(
  <>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </>,
);
export const IconSparkles = base(
  <>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="M19 14l.7 1.9L21.6 17l-1.9.7L19 19.6 18.3 17l-1.9-.7L18.3 15l.7-1Z" />
  </>,
);
export const IconChevron = base(<path d="M9 6l6 6-6 6" />);
export const IconCheck = base(<path d="M20 6L9 17l-5-5" />);
export const IconText = base(
  <>
    <path d="M4 7V5h16v2" />
    <path d="M9 5v14M12 19H6" />
    <path d="M15 19h3" />
  </>,
);
export const IconLock = base(
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);
export const IconLayers = base(
  <>
    <path d="M12 2l9 5-9 5-9-5 9-5Z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 17l9 5 9-5" />
  </>,
);
export const IconFile = base(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </>,
);
export const IconBox = base(
  <>
    <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </>,
);
export const IconRefresh = base(
  <>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 3v6h-6" />
  </>,
);
export const IconClose = base(<path d="M18 6L6 18M6 6l12 12" />);
export const IconEyeOff = base(
  <>
    <path d="M9.9 4.2A9.6 9.6 0 0 1 12 4c6.5 0 10 7 10 7a15.4 15.4 0 0 1-3.1 3.9" />
    <path d="M6.6 6.6A15.5 15.5 0 0 0 2 11s3.5 7 10 7a9.3 9.3 0 0 0 4.5-1.1" />
    <path d="M14 14a3 3 0 0 1-4-4" />
    <path d="M2 2l20 20" />
  </>,
);
