import type { SettingsIconName } from "./types";

type Props = {
  name: SettingsIconName;
  className?: string;
};

export function SettingsIcon({ name, className = "size-5" }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "appearance":
      return <svg {...common}><path d="M12 3a9 9 0 1 0 9 9c0-1.2-1-2-2.1-1.7l-2.1.6a2 2 0 0 1-2.5-2.5l.7-2.1C15.3 4.5 14 3 12 3Z" /><circle cx="7.5" cy="11" r=".7" fill="currentColor" /><circle cx="10" cy="7.5" r=".7" fill="currentColor" /><circle cx="8.5" cy="15" r=".7" fill="currentColor" /></svg>;
    case "bell":
      return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6Z" /><path d="M10 19h4" /></svg>;
    case "lock":
      return <svg {...common}><rect x="4.5" y="10" width="15" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg>;
    case "device":
      return <svg {...common}><rect x="4" y="3" width="16" height="12" rx="2" /><path d="M8 21h8M12 15v6" /></svg>;
    case "store":
      return <svg {...common}><path d="m4 9 1-5h14l1 5M5 9v11h14V9" /><path d="M3.5 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 2-1" /></svg>;
    case "palette":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="8" cy="9" r="1" fill="currentColor" /><circle cx="12" cy="7" r="1" fill="currentColor" /><circle cx="16" cy="10" r="1" fill="currentColor" /><path d="M15 16c0 1.2-1 2-2.2 2H11a2 2 0 0 1 0-4h2a2 2 0 0 1 2 2Z" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>;
    case "locale":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.7 3.2 2.7 14.8 0 18M7 6h10M7 18h10" /></svg>;
    case "checkout":
      return <svg {...common}><path d="M3 5h2l2 11h10l2-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /><path d="M10 11h5M12.5 8.5v5" /></svg>;
    case "card":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18M7 15h3" /></svg>;
    case "truck":
      return <svg {...common}><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
    case "tax":
      return <svg {...common}><path d="m5 19 14-14M7.5 5.5h.01M16.5 18.5h.01" /><circle cx="7.5" cy="5.5" r="2.5" /><circle cx="16.5" cy="18.5" r="2.5" /></svg>;
    case "document":
      return <svg {...common}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
    case "team":
      return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 6a3 3 0 0 1 0 5M17 20a5 5 0 0 0-3-4.5" /></svg>;
    case "role":
      return <svg {...common}><path d="M12 3 4 7v5c0 4.5 3.3 7.6 8 9 4.7-1.4 8-4.5 8-9V7Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "history":
      return <svg {...common}><path d="M4 6v5h5M5.5 17a8 8 0 1 0-.8-8" /><path d="M12 7v5l3 2" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="M12 3c.6 3.5 1.5 4.4 5 5-3.5.6-4.4 1.5-5 5-.6-3.5-1.5-4.4-5-5 3.5-.6 4.4-1.5 5-5ZM18.5 14c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5Z" /></svg>;
    case "image":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L18 19" /></svg>;
    case "plan":
      return <svg {...common}><path d="M12 3 5 7v5c0 4.5 2.8 7.5 7 9 4.2-1.5 7-4.5 7-9V7Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "invoice":
      return <svg {...common}><path d="M6 3v18l3-2 3 2 3-2 3 2V3l-3 2-3-2-3 2Z" /><path d="M9 9h6M9 13h6" /></svg>;
    case "usage":
      return <svg {...common}><path d="M4 20V11M10 20V6M16 20v-4M3 20h18" /></svg>;
    case "integration":
      return <svg {...common}><path d="M8 3v4M16 3v4M6 7h12v3a6 6 0 0 1-6 6v5M8 12h8" /></svg>;
    case "privacy":
      return <svg {...common}><path d="M12 3 4 7v5c0 4.5 3.3 7.6 8 9 4.7-1.4 8-4.5 8-9V7Z" /><circle cx="12" cy="11" r="2" /><path d="M9 17c.7-2 1.7-3 3-3s2.3 1 3 3" /></svg>;
    case "support":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3 2.5c-.5.2-.5.8-.5 1.5M12 17h.01" /></svg>;
    case "danger":
      return <svg {...common}><path d="M12 3 2.8 19h18.4Z" /><path d="M12 9v4M12 17h.01" /></svg>;
  }
}
