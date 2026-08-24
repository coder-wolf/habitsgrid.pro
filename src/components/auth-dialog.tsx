import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    if (mode === "signin") {
      const err = await signIn(email.trim(), password);
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      toast.success("Signed in — your habits are syncing.");
      onOpenChange(false);
    } else {
      const res = await signUp(email.trim(), password);
      setBusy(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.needsConfirmation) {
        toast.info("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        toast.success("Account created — your habits are syncing.");
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            {mode === "signin" ? "Sign in" : "Create account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {mode === "signin"
              ? "Sign in to sync your habits across devices."
              : "Create an account to sync your habits across devices."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex rounded-md border border-border p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              mode === "signin"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              mode === "signup"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </span>
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Password
            </span>
            <Input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-md bg-primary px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
