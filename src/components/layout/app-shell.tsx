"use client";

import type { FC, PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";

export const AppShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="group/sidebar-wrapper grid min-h-screen w-full grid-cols-1 md:grid-cols-[auto_1fr]">
        <SidebarNav />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4 transition-all duration-300 ease-in-out md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
