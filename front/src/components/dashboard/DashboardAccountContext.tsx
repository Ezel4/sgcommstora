"use client";

import { createContext, useContext } from "react";

type DashboardAccount = {
  email: string;
  demoMode: boolean;
};

const DashboardAccountContext = createContext<DashboardAccount>({
  email: "",
  demoMode: false,
});

export function DashboardAccountProvider({
  children,
  demoMode,
  email,
}: {
  children: React.ReactNode;
  demoMode: boolean;
  email: string;
}) {
  return (
    <DashboardAccountContext.Provider value={{ demoMode, email }}>
      {children}
    </DashboardAccountContext.Provider>
  );
}

export function useDashboardAccount() {
  return useContext(DashboardAccountContext);
}
