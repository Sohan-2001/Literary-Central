"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, BookOpen, Library, LayoutDashboard, UserCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@/firebase";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/authors", label: "Authors", icon: UserCircle },
  { href: "/users", label: "Users", icon: Users },
  { href: "/borrowed", label: "Borrowed Books", icon: Library },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline text-lg group-data-[collapsible=icon]:hidden">
          <BookMarked className="h-6 w-6 text-sidebar-primary" />
          <span>Literary Central</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                as="a"
                href={link.href}
                isActive={pathname === link.href}
                tooltip={{ children: link.label }}
                className="justify-start"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
