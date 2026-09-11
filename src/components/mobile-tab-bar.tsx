import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Crown, Palette, Share2, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useHideOnScrollDown } from "@/hooks/use-hide-on-scroll";

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
  const hidden = useHideOnScrollDown();

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
      className={`fixed bottom-4 left-4 right-4 z-30 mx-auto hidden w-auto max-w-sm rounded-[28px] border border-foreground/10 bg-background/[0.03] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.3),0_16px_48px_-16px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-300 [padding-bottom:env(safe-area-inset-bottom)] max-md:portrait:block ${hidden ? "translate-y-[150%] opacity-0" : ""}`}
    >
      <div className="flex items-stretch gap-1 px-3 pb-1.5 pt-2">
        <Link
          to="/"
          aria-label="Today"
          className={`${tab} ${active === "today" ? "text-foreground" : "text-foreground/70"}`}
        >
          <TabIcon on={active === "today"}>
            <CalendarCheck className="size-5" />
          </TabIcon>
          <span>Today</span>
        </Link>
        <Link
          to="/share"
          aria-label="Share"
          className={`${tab} ${active === "share" ? "text-foreground" : "text-foreground/70"}`}
        >
          <TabIcon on={active === "share"}>
            <Share2 className="size-5" />
          </TabIcon>
          <span>Share</span>
        </Link>
        <Link
          to="/themes"
          aria-label="Theme"
          className={`${tab} ${active === "theme" ? "text-foreground" : "text-foreground/70"}`}
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
            className={`${tab} ${active === "pro" ? "text-foreground" : "text-foreground/70"}`}
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
            className={`${tab} ${active === "pro" ? "text-foreground" : "text-foreground/70"}`}
          >
            <TabIcon on={active === "pro"}>
              <Crown className="size-5" />
            </TabIcon>
            <span>Pro</span>
          </Link>
        )}
        <Link
          to="/account"
          aria-label="Account"
          className={`${tab} ${active === "account" ? "text-foreground" : "text-foreground/70"}`}
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
