import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TabPage } from "@/components/tab-page";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

function AccountPage() {
  const { user, isPro, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <TabPage title="Account" subtitle="Sign in to sync your habits across devices.">
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
