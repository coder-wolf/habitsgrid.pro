import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { TabPage } from "@/components/tab-page";
import { useAuth } from "@/lib/auth";
import { THEMES, useTheme } from "@/lib/theme";
import { useSimpleHome } from "@/hooks/use-simple-home";
import { isSupabaseConfigured } from "@/lib/supabase";

const THEME_SWATCHES: Record<string, { bg: string; primary: string }> = {
  light: { bg: "oklch(0.985 0.004 90)", primary: "oklch(0.28 0.02 265)" },
  sunset: { bg: "oklch(0.97 0.01 60)", primary: "oklch(0.55 0.18 30)" },
  forest: { bg: "oklch(0.97 0.01 145)", primary: "oklch(0.45 0.14 155)" },
  lavender: { bg: "oklch(0.97 0.008 290)", primary: "oklch(0.55 0.15 280)" },
  pink: { bg: "oklch(0.97 0.01 340)", primary: "oklch(0.6 0.18 345)" },
  midnight: { bg: "oklch(0.11 0.035 270)", primary: "oklch(0.7 0.12 250)" },
  indigo: { bg: "oklch(0.13 0.04 280)", primary: "oklch(0.65 0.18 270)" },
  teal: { bg: "oklch(0.13 0.035 185)", primary: "oklch(0.7 0.15 180)" },
  charcoal: { bg: "oklch(0.14 0.005 50)", primary: "oklch(0.72 0.01 50)" },
  cocoa: { bg: "oklch(0.14 0.025 55)", primary: "oklch(0.7 0.1 50)" },
};

function ThemeSection() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Theme
        </p>
        <Link
          to="/themes"
          className="flex items-center gap-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          All <ChevronRight className="size-3" />
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {THEMES.map((t) => {
          const selected = theme === t;
          const swatch = THEME_SWATCHES[t] ?? THEME_SWATCHES.light!;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              aria-pressed={selected}
              aria-label={`${t} theme`}
              title={t}
              className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-all active:scale-95 ${selected ? "border-foreground bg-foreground/[0.06]" : "border-border/60 bg-surface"}`}
            >
              <span
                aria-hidden
                className="size-7 rounded-full ring-1 ring-inset ring-foreground/20"
                style={{
                  background: `linear-gradient(135deg, ${swatch.bg} 50%, ${swatch.primary} 50%)`,
                }}
              />
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <span className="capitalize">{t}</span>
                {selected && <Check className="size-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomepageSection() {
  const [simple, setSimple] = useSimpleHome();
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Homepage style
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1">
        {(
          [
            { value: false, label: "Full" },
            { value: true, label: "Simple" },
          ] as const
        ).map((o) => (
          <button
            key={o.label}
            onClick={() => setSimple(o.value)}
            aria-pressed={simple === o.value}
            className={`rounded-lg py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${simple === o.value ? "bg-foreground text-background" : "text-muted-foreground"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        {simple
          ? "Simple hides history dots and extras — just the checklist."
          : "Full shows history dots, progress minis and all extras."}
      </p>
    </div>
  );
}

function AccountPage() {
  const { user, isPro, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <TabPage title="Account" subtitle="Sign in to sync your habits across devices.">
        <div className="flex flex-col gap-4">
          <div>
            <button
              onClick={() => void signInWithGoogle()}
              disabled={!isSupabaseConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-[15px] font-semibold text-background transition-all active:scale-[0.98] disabled:opacity-40"
            >
              Sign in with Google
            </button>
            {!isSupabaseConfigured && (
              <p className="mt-2 text-center text-[13px] text-muted-foreground">
                Cloud sync is not configured.
              </p>
            )}
          </div>
          <HomepageSection />
        </div>
      </TabPage>
    );
  }

  return (
    <TabPage title="Account" subtitle={user.email}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
            <span className="text-lg font-semibold text-primary">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold">{user.email}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {isPro ? "Pro plan" : "Free plan"}
            </p>
          </div>
          {isPro ? (
            <span className="rounded bg-primary px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
              Pro
            </span>
          ) : (
            <span className="rounded bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
              Free
            </span>
          )}
        </div>

        {isPro ? (
          <button
            onClick={() => navigate({ to: "/settings/billing" })}
            className="w-full rounded-xl border border-border bg-surface py-3 text-[15px] font-medium transition-all active:scale-[0.98]"
          >
            Manage billing
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/onboarding" })}
            className="w-full rounded-xl bg-foreground py-3 text-[15px] font-semibold text-background transition-all active:scale-[0.98]"
          >
            Upgrade to Pro — $0.99/mo
          </button>
        )}

        <button
          onClick={() => {
            void signOut().then(() =>
              toast.success("Signed out — your habits are safely stored."),
            );
          }}
          className="w-full rounded-xl border border-border bg-surface py-3 text-[15px] font-medium text-muted-foreground transition-all active:scale-[0.98]"
        >
          Sign out
        </button>

        <HomepageSection />

        <ThemeSection />
      </div>
    </TabPage>
  );
}

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Account — HabitsGrid" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/account" }],
  }),
  component: AccountPage,
});
