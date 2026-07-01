import Link from "next/link";
import { LogoMark } from "@/components/marketing/Logo";
import { signOut } from "@/app/admin/actions";
import { IconLogout } from "@/components/dashboard/icons";

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-base">
      <header className="sticky top-0 z-30 border-b border-line bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark className="size-6" />
            <span className="text-[1.05rem] font-medium tracking-tight text-ink">
              Sigmood <span className="text-ink-3">· Admin</span>
            </span>
          </Link>

          <span className="pill ml-1">CRM</span>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm text-ink-3 transition hover:text-ink sm:inline">
              Retour au dashboard
            </Link>
            <span className="hidden truncate text-xs text-ink-3 sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Se déconnecter"
                className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition hover:bg-white/[0.05] hover:text-ink"
              >
                <IconLogout className="size-[18px]" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
