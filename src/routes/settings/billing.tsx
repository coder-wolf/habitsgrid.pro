import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { createCheckoutSession } from "@/lib/checkout";
import { toast } from "sonner";
import { Cloud, ArrowLeft, ExternalLink, Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Habit Grid" },
      { name: "description", content: "Manage your Habit Grid subscription and plan." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const { user, subscription, isPro, loading, refresh } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
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
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel = subscription?.status ?? "inactive";
  const isActive = statusLabel === "active";
  const isCancelled = statusLabel === "cancelled";

  return (
    <div className="min-h-screen bg-background">
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

            {subscription?.expires_at && (
              <p className="mt-2 text-xs text-muted-foreground">
                {isCancelled ? "Expires" : "Renews"}:{" "}
                {new Date(subscription.expires_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Features Comparison */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-medium text-foreground">Plan Features</h2>
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
            ) : (
              <button
                onClick={() => {
                  toast.info("Contact support to manage your subscription.");
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
