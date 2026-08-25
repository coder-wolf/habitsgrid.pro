import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { toast } from "sonner";
import { useState } from "react";

type NavbarProps = {
  cursor: Date;
  today: Date;
  isCurrentMonth: boolean;
  habitCount: number;
  doneToday: number;
  onShiftMonth: (delta: number) => void;
  onToday: () => void;
};

export function Navbar({
  cursor,
  today,
  isCurrentMonth,
  habitCount,
  doneToday,
  onShiftMonth,
  onToday,
}: NavbarProps) {
  const { user, isPro, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const monthLabel = cursor.toLocaleString("en-US", { month: "long" });
  const yearLabel = cursor.getFullYear();

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-8">
        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight text-foreground">Habit Grid</span>
        </Link>

        {/* Center: Month Navigation */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => onShiftMonth(-1)}
            aria-label="Previous month"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={onToday}
            className="rounded-md px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {monthLabel} {yearLabel}
          </button>
          <button
            onClick={() => onShiftMonth(1)}
            aria-label="Next month"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
          {isCurrentMonth && (
            <span className="ml-1 font-mono text-[10px] text-muted-foreground">
              {doneToday}/{habitCount}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile month nav */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={() => onShiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={onToday}
              className="rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {monthLabel.slice(0, 3)} {yearLabel}
            </button>
            <button
              onClick={() => onShiftMonth(1)}
              aria-label="Next month"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <ThemeSwitcher />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 transition-colors hover:bg-secondary"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-[10px] font-medium text-primary">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span
                  title={user.email}
                  className="hidden max-w-[120px] truncate font-mono text-[11px] text-muted-foreground md:block"
                >
                  {user.email}
                </span>
                {!isPro && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                    Free
                  </span>
                )}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-md">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-xs text-foreground">{user.email}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {isPro ? "Pro plan" : "Free plan"}
                      </p>
                    </div>
                    <Link
                      to="/settings/billing"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      Billing
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        void signOut().then(() =>
                          toast.success("Signed out — your habits are safely stored."),
                        );
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => void signInWithGoogle()}
              disabled={!isSupabaseConfigured}
              title={isSupabaseConfigured ? undefined : "Cloud sync is not configured"}
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="size-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
