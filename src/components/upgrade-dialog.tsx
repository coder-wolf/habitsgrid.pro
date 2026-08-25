import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/checkout";
import { toast } from "sonner";
import { Cloud } from "lucide-react";

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: string;
};

export function UpgradeDialog({ open, onOpenChange, trigger }: UpgradeDialogProps) {
  const { user, isPro } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    setLoading(true);
    try {
      const result = await createCheckoutSession({ data: { userId: user.id, email: user.email } });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (isPro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            {trigger ?? "Unlock cloud sync to access your habits from any device."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Cloud className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Cloud Sync & Backup</p>
              <p className="text-xs text-muted-foreground">
                Access your habits from any device. Data is backed up to the cloud.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirecting to checkout..." : "Upgrade to Pro"}
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Cancel anytime. Powered by LemonSqueezy.
        </p>
      </DialogContent>
    </Dialog>
  );
}
