import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cloud, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/checkout";
import { toast } from "sonner";

export function OnboardingFlow({ onDemo }: { onDemo?: () => void }) {
  const navigate = useNavigate();
  const { user, loading: authLoading, isPro, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  // If already pro, go to homepage
  useEffect(() => {
    if (!authLoading && isPro) {
      navigate({ to: "/" });
    }
  }, [authLoading, isPro, navigate]);

  // If already signed in, advance to step 2
  useEffect(() => {
    if (!authLoading && user && step === 1) {
      setStep(2);
    }
  }, [user, authLoading, step]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-xs text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    if (googleBusy) return;
    setGoogleBusy(true);
    const err = await signInWithGoogle();
    if (err) {
      toast.error(err);
      setGoogleBusy(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user || checkoutBusy) return;
    setCheckoutBusy(true);
    try {
      const result = await createCheckoutSession({ data: { userId: user.id, email: user.email } });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start checkout.");
      setCheckoutBusy(false);
    }
  };

  const handleTryDemo = () => {
    if (onDemo) {
      onDemo();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? "w-8 bg-primary" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Login */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                Sign in
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to sync your habits across devices.
              </p>
            </div>

            <button
              type="button"
              disabled={googleBusy || !isSupabaseConfigured}
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24">
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
              {googleBusy ? "Working..." : "Sign in with Google"}
            </button>

            <button
              onClick={handleTryDemo}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip — try demo
            </button>
          </div>
        )}

        {/* Step 2: Upgrade */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                Upgrade
              </h1>
              <p className="text-sm text-muted-foreground">
                Unlock cloud sync to access your habits from any device.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 text-left">
              <div className="flex items-start gap-3">
                <Cloud className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">Cloud Sync & Backup</p>
                  <p className="text-xs text-muted-foreground">
                    Your habits are backed up and synced across all your devices.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={checkoutBusy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutBusy ? "Redirecting to checkout..." : "Upgrade to Pro"}
              {!checkoutBusy && <ArrowRight className="size-4" />}
            </button>

            <button
              onClick={handleTryDemo}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip — try demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
