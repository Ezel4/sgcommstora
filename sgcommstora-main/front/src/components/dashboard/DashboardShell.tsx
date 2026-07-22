"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children, email }: { children: React.ReactNode; email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[66px] border-r border-line bg-[#e6e6e6] lg:block">
        <Sidebar email={email} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-[76px] border-r border-line bg-[#e6e6e6] shadow-2xl">
            <Sidebar email={email} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[66px]">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="px-3 pb-5 sm:px-5">{children}</main>
      </div>
    </div>
  );
}
