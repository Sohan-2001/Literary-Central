"use client";

import type { FC, PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { useUser } from "@/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const AppShell: FC<PropsWithChildren> = ({ children }) => {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is still loading, do nothing.
    if (isUserLoading) {
      return;
    }

    // If there's no user and we are not on the landing page, redirect.
    if (!user && pathname !== '/') {
      router.replace('/');
    }
  }, [user, isUserLoading, pathname, router]);

  // While loading, or if no user and on a protected route, show a loading state or nothing.
  if (isUserLoading || (!user && pathname !== '/')) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Don't wrap landing page in the shell
  if (pathname === '/') {
    return <>{children}</>;
  }

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

    