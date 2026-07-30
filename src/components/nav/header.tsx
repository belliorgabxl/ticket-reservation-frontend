"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  async function onLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Ticket<span className="text-accent">Reserve</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/events"
            className="hidden text-muted transition hover:text-foreground sm:inline"
          >
            Events
          </Link>

          <ThemeToggle />

          {loading ? null : user ? (
            <>
              <span className="hidden text-muted sm:inline">
                {user.email}
              </span>
              <Button variant="secondary" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-block">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="inline-block">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
