"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, useEffect } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { signOut } from "@/app/(app)/actions";
import {
  IconChevronDown,
  IconLogout,
  IconMail,
  IconReceipt,
  IconSettings,
  IconSparkles,
  IconStore,
  IconUsers,
} from "./icons";

type AccountMenuProps = {
  email: string;
  storeName: string;
  displayName?: string | null;
  planName?: string | null;
  avatarSrc?: string | null;
  needsAttention?: boolean;
};

type FocusTarget = "first" | "last";

const ACCOUNT_LINKS = [
  {
    label: "Mon profil",
    description: "Identité et préférences",
    href: "/dashboard/parametres?section=profil",
    Icon: IconUsers,
  },
  {
    label: "Paramètres",
    description: "Tous les réglages",
    href: "/dashboard/parametres",
    Icon: IconSettings,
  },
  {
    label: "Mon abonnement",
    description: "Formule et utilisation",
    href: "/dashboard/parametres?section=abonnement",
    Icon: IconSparkles,
  },
  {
    label: "Facturation",
    description: "Moyen de paiement et factures",
    href: "/dashboard/parametres?section=facturation",
    Icon: IconReceipt,
  },
  {
    label: "Changer de boutique",
    description: "Espaces et boutiques",
    href: "/dashboard/boutiques",
    Icon: IconStore,
  },
] as const;

const SUPPORT_LINKS = [
  {
    label: "Centre d’aide",
    description: "Guides et ressources",
    href: "/dashboard/parametres?section=support",
    Icon: IconHelpCircle,
  },
  {
    label: "Contacter le support",
    description: "Nous écrire",
    href: "/dashboard/parametres?section=support&action=contact",
    Icon: IconMail,
  },
] as const;

function IconHelpCircle({ className = "size-5" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.7 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.2.9-1.2 1.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function getInitials(email: string) {
  const localPart = email.trim().split("@")[0] ?? "";
  const parts = localPart.split(/[._\-\s]+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase() || "SI";
}

function AccountAvatar({
  src,
  initials,
  size,
}: {
  src?: string | null;
  initials: string;
  size: "button" | "panel";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src && src !== failedSrc);
  const sizeClass = size === "button" ? "size-10" : "size-14";

  return (
    <span
      aria-hidden
      className={`brand-gradient relative grid ${sizeClass} shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white text-xs font-semibold text-ink shadow-sm`}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt=""
          fill
          sizes={size === "button" ? "40px" : "56px"}
          className="object-cover"
          onError={() => setFailedSrc(src as string)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}

function MenuLink({
  item,
  onSelect,
}: {
  item: (typeof ACCOUNT_LINKS)[number] | (typeof SUPPORT_LINKS)[number];
  onSelect: () => void;
}) {
  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={onSelect}
      className="group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 text-left text-ink transition hover:bg-surface-2 focus-visible:bg-surface-2"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-2 transition group-hover:bg-white group-hover:text-ink">
        <item.Icon className="size-[17px]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{item.label}</span>
        <span className="block truncate text-xs text-ink-3">{item.description}</span>
      </span>
    </Link>
  );
}

export function AccountMenu({
  email,
  storeName,
  displayName,
  planName,
  avatarSrc,
  needsAttention = false,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<FocusTarget>("first");
  const reactId = useId();
  const triggerId = `account-trigger-${reactId.replace(/:/g, "")}`;
  const menuId = `account-menu-${reactId.replace(/:/g, "")}`;
  const normalizedEmail = email.trim();
  const accountName = displayName?.trim() || "Compte Sigmood";
  const initials = getInitials(normalizedEmail);

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => {
      const menuItems = panelRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      );
      const item =
        focusTargetRef.current === "last"
          ? menuItems?.[menuItems.length - 1]
          : menuItems?.[0];
      item?.focus({ preventScroll: true });
    });

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const openMenu = (target: FocusTarget = "first") => {
    focusTargetRef.current = target;
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    const menuItems = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    );
    if (menuItems.length === 0) return;

    event.preventDefault();
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
    let nextIndex = 0;

    if (event.key === "End") {
      nextIndex = menuItems.length - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex < 0 || currentIndex === menuItems.length - 1 ? 0 : currentIndex + 1;
    }

    menuItems[nextIndex]?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={`Ouvrir le menu du compte${normalizedEmail ? ` — ${normalizedEmail}` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu("first");
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className="group flex min-h-11 items-center gap-1 rounded-full bg-white/65 p-0.5 pr-1 text-ink-2 shadow-sm ring-1 ring-black/[0.06] transition hover:bg-white hover:text-ink"
      >
        <span className="relative">
          <AccountAvatar src={avatarSrc} initials={initials} size="button" />
          <span
            aria-hidden
            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${needsAttention ? "bg-warning" : "bg-success"}`}
          />
          {needsAttention && (
            <span
              aria-hidden
              className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-warning text-[9px] font-semibold text-white shadow-sm"
            >
              1
            </span>
          )}
        </span>
        <IconChevronDown
          className={`mr-0.5 hidden size-4 transition-transform sm:block ${open ? "rotate-180" : ""}`}
        />
        <span className="sr-only">
          {needsAttention ? "Une action est requise pour la boutique." : "Compte actif."}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 max-h-[calc(100dvh-5.5rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[24px] border border-black/[0.08] bg-white/95 p-2 shadow-[0_24px_70px_-24px_rgba(16,16,16,0.42)] backdrop-blur-xl"
        >
          <div role="presentation" className="p-2 pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <AccountAvatar src={avatarSrc} initials={initials} size="panel" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{accountName}</p>
                <p className="mt-0.5 truncate text-xs text-ink-3">
                  {normalizedEmail || "Adresse e-mail indisponible"}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-surface-2 px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-ink-4">Boutique</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-ink">{storeName}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink-2 ring-1 ring-black/[0.05]">
                  {planName?.trim() || "Formule à connecter"}
                </span>
              </div>
              {needsAttention && (
                <p className="mt-2 flex items-center gap-2 text-xs font-medium text-warning">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-warning" />
                  Configuration à finaliser
                </p>
              )}
            </div>
          </div>

          <div role="group" aria-label="Compte" className="space-y-0.5">
            {ACCOUNT_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onSelect={closeMenu} />
            ))}
          </div>

          <div role="separator" className="mx-3 my-2 h-px bg-black/[0.07]" />

          <div role="group" aria-label="Aide" className="space-y-0.5">
            {SUPPORT_LINKS.map((item) => (
              <MenuLink key={item.label} item={item} onSelect={closeMenu} />
            ))}
          </div>

          <div role="separator" className="mx-3 my-2 h-px bg-black/[0.07]" />

          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              onClick={closeMenu}
              className="group flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-ink transition hover:bg-surface-2 focus-visible:bg-surface-2"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink-2 transition group-hover:bg-white group-hover:text-ink">
                <IconLogout className="size-[17px]" />
              </span>
              <span className="text-sm font-medium">Se déconnecter</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
