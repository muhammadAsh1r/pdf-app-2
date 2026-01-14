"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Moon, Sun, LogOut, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";

type NavbarProps = {
  user: any | null;
  loading: boolean;
};

export function Navbar({ user, loading }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl">PDFKit</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </Button>

          {!loading && (
            user ? (
              <>
                <span className="text-sm">{user.first_name || user.email}</span>
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Start Free</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
