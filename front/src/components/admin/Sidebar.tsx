"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/marketing/Logo";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import {
  IconBox,
  IconLogout,
  IconOverview,
  IconReceipt,
  IconSettings,
  IconSparkles,
  IconStore,
  IconUsers,
} from "@/components/dashboard/icons";

type NavItem = { label: string; href: string; Icon: (p: { className?: string }) => React.ReactElement };

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Vue",
    items: [
      { label: "Vue d'ensemble", href: "/admin", Icon: IconOverview },
      { label: "Tous les contacts", href: "/admin/contacts", Icon: IconUsers },
    ],
  },
  {
    title: "Pipeline",
    items: [
      { label: "Leads", href: "/admin/leads", Icon: IconSparkles },
      { label: "Contactés", href: "/admin/contactes", Icon: IconReceipt },
      { label: "Qualifiés", href: "/admin/qualifies", Icon: IconBox },
      { label: "Clients", href: "/admin/clients", Icon: IconStore },
      { label: "Perdus", href: "/admin/perdus", Icon: IconSettings },
    ],
  },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
        active ? "bg-white/[0.07] text-ink" : "text-ink-3 hover:bg-white/[0.04] hover:text-ink",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-rose" />
      )}
      <item.Icon className={cn("size-[18px] shrink-0", active ? "text-rose" : "text-ink-4 group-hover:text-ink-2")} />
      {item.label}
    </Link>
  );
}

export function Sidebar({ email, onNavigate }: { email: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-2 pt-1">
        <LogoMark className="size-7" />
        <span className="text-[1.05rem] font-medium tracking-tight text-ink">
          Sigmood <span className="text-ink-3">· Admin</span>
        </span>
      </Link>

      <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-ink-4">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm text-ink-2 transition hover:bg-white/[0.04] hover:text-ink"
        >
          <span className="truncate">Retour au dashboard</span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl px-1 py-1">
          <span className="grid size-9 place-items-center rounded-full bg-surface-2 text-sm font-medium text-ink">
            {email.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-3">{email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="grid size-8 place-items-center rounded-lg text-ink-3 transition hover:bg-white/[0.05] hover:text-ink"
            >
              <IconLogout className="size-[18px]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
