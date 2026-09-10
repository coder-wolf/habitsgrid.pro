import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Crown, Palette, Share2, User, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

const tab =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors active:bg-secondary";

function TabIcon({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span
      className={`transition-all active:scale-90 ${on ? "text-primary" : ""}`}
    >
      {children}
    </span>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPro } = useAuth();

  const active =
    pathname === "/"
      ? "today"
      : pathname === "/share"
        ? "share"
        : pathname === "/themes"
          ? "theme"
          : pathname === "/account"
            ? "account"
            : pathname === "/onboarding" || pathname === "/settings/billing"
              ? "pro"
              : null;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-4 right-4 z-30 hidden rounded-[28px] border border-foreground/15 bg-background/60 bg-gradient-to-b from-foreground/[0.12] to-foreground/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_16px_48px_-12px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 [padding-bottom:env(safe-area-inset-bottom)] max-md:portrait:block"
    >
      <div className="flex items-stretch gap-1 px-3 pb-1.5 pt-2">
        <Link
          to="/"
          aria-label="Today"
          className={`${tab} ${active === "today" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <TabIcon on={active === "today"}>
            <CalendarCheck className="size-5" />
          </TabIcon>
          <span>Today</span>
        </Link>
        <Link
          to="/share"
          aria-label="Share"
          className={`${tab} ${active === "share" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <TabIcon on={active === "share"}>
            <Share2 className="size-5" />
          </TabIcon>
          <span>Share</span>
        </Link>
        <Link
          to="/themes"
          aria-label="Theme"
          className={`${tab} ${active === "theme" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <TabIcon on={active === "theme"}>
            <Palette className="size-5" />
          </TabIcon>
          <span>Theme</span>
        </Link>
        {isPro ? (
          <Link
            to="/settings/billing"
            aria-label="Billing"
            className={`${tab} ${active === "pro" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <TabIcon on={active === "pro"}>
              <Crown className="size-5" />
            </TabIcon>
            <span>Pro</span>
          </Link>
        ) : (
          <Link
            to="/onboarding"
            aria-label="Upgrade to Pro"
            className={`${tab} ${active === "pro" ? "text-foreground" : "text-muted-foreground"}`}
          >
            <TabIcon on={active === "pro"}>
              <Zap className="size-5" />
            </TabIcon>
            <span>Pro</span>
          </Link>
        )}
        <Link
          to="/account"
          aria-label="Account"
          className={`${tab} ${active === "account" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <TabIcon on={active === "account"}>
            {user ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                <span className="text-[10px] font-medium text-primary">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </span>
            ) : (
              <User className="size-5" />
            )}
          </TabIcon>
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}
