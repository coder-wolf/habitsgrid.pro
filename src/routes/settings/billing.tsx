import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { useAuth } from "@/lib/auth";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { createCheckoutSession } from "@/lib/checkout";
import { cancelSubscription } from "@/lib/cancel-subscription";
import { toast } from "sonner";
import { Cloud, ArrowLeft, ExternalLink, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/settings/billing")({
  head: () => ({
    meta: [
      { title: "Billing — HabitsGrid" },
      { name: "description", content: "Manage your HabitsGrid subscription and plan." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/settings/billing" }],
  }),
  component: BillingPage,
});

function BillingPage() {
  const { user, subscription, isPro, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const upgraded =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("upgraded") === "true";

  // After payment redirect, poll until subscription is active
  useEffect(() => {
    if (!upgraded || !user) return;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 6;
    const tryRefresh = async () => {
      if (cancelled) return;
      await refresh();
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryRefresh, 2000);
      } else {
        window.history.replaceState({}, "", "/settings/billing");
      }
    };
    const t = setTimeout(tryRefresh, 1500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [upgraded, user]);

  // Once Pro after upgrade, redirect to homepage
  useEffect(() => {
    if (upgraded && isPro) {
      toast.success("Welcome to Pro! Cloud sync is now active.");
      navigate({ to: "/" });
    }
  }, [upgraded, isPro]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to manage your subscription.
          </p>
          <Link
            to="/onboarding"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const result = await createCheckoutSession({ data: { userId: user.id, email: user.email } });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const result = await cancelSubscription({ data: { userId: user.id } });
      await refresh();
      const endsAt = result?.ends_at ? new Date(result.ends_at).toLocaleDateString() : null;
      toast.success(
        endsAt ? `Subscription cancelled. Access until ${endsAt}.` : "Subscription cancelled.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const statusLabel = subscription?.status ?? "inactive";
  const isActive = statusLabel === "active";
  const isCancelled = statusLabel === "cancelled";

  return (
    <div className="min-h-screen bg-background max-md:portrait:pb-32">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to habits
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and plan.</p>

        <div className="mt-8 space-y-6">
          {/* Current Plan */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-foreground">Current Plan</h2>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {isPro ? "Pro" : "Free"}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : isCancelled
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {statusLabel}
              </div>
            </div>

            {isPro && (subscription?.created_at || subscription?.renews_at || subscription?.expires_at) && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {subscription?.created_at && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Billing cycle started</span>
                    <span className="text-foreground">
                      {new Date(subscription.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {subscription?.renews_at && !isCancelled && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Next renewal</span>
                    <span className="text-foreground">
                      {new Date(subscription.renews_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {subscription?.expires_at && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {isCancelled ? "Access expires" : "Current period ends"}
                    </span>
                    <span className="text-foreground">
                      {new Date(subscription.expires_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features Comparison */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-medium text-foreground">Pro Features</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Cloud className="size-4 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">Cloud Sync & Backup</span>
                {isPro ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-muted-foreground/50" />
                )}
              </div>
            </div>
            {!isPro && (
              <p className="mt-4 text-xs text-muted-foreground">$0.99 USD / month</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isPro ? (
              <button
                onClick={handleUpgrade}
                disabled={loadingCheckout}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ExternalLink className="size-4" />
                {loadingCheckout ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            ) : isActive ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={cancelling}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-surface px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Subscription"}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your Pro access will remain until the end of the current billing period
                      {subscription?.expires_at || subscription?.renews_at
                        ? ` (${new Date((subscription.expires_at || subscription.renews_at)!).toLocaleDateString()})`
                        : ""}
                      . It will be cancelled on LemonSqueezy as well.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
            <button
              onClick={() => {
                void refresh().then(() => toast.success("Refreshed subscription status."));
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Refresh billing status
            </button>
          </div>
        </div>
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <MobileTabBar />
    </div>
  );
}
