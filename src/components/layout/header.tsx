"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft, BookMarked, LayoutDashboard, BookOpen, UserCircle, Users, Library, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/authors", label: "Authors", icon: UserCircle },
  { href: "/users", label: "Users", icon: Users },
  { href: "/borrowed", label: "Borrowed Books", icon: Library },
];

export function Header() {
  const pathname = usePathname();
  const pageTitle = links.find(link => link.href === pathname)?.label || 'Literary Central';
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  // Do not render the header on the landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <BookMarked className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Literary Central</span>
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-2.5 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
       <h1 className="text-xl font-semibold font-headline hidden md:block">{pageTitle}</h1>
       <div className="ml-auto">
        {!isUserLoading && (
          user ? (
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )
        )}
       </div>
    </header>
  );
}
