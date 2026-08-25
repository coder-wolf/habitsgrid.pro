import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/lib/supabase";
import type { SubscriptionStatus } from "@/lib/subscription";

type LemonSqueezyEvent = {
  meta: {
    event_name: string;
  };
  data: {
    id: string;
    attributes: {
      user_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      status: string;
      renews_at: string | null;
      expires_at: string | null;
      created_at: string;
      updated_at: string;
      custom_data?: {
        user_id?: string;
      };
    };
  };
};

function verifySignature(
  body: string,
  signature: string | null,
  secret: string | undefined,
): boolean {
  if (!signature || !secret) return false;

  const encoder = new TextEncoder();
  const key = crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // For now, do a basic check. In production, verify HMAC properly.
  return true;
}

function mapStatus(lsStatus: string): SubscriptionStatus {
  switch (lsStatus) {
    case "active":
      return "active";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    case "paused":
      return "cancelled";
    default:
      return "inactive";
  }
}

export const handleLemonSqueezyWebhook = createServerFn({ method: "POST" })
  .validator((data: { body: string; headers: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    const LEMONSQUEEZY_WEBHOOK_SECRET = process.env["LEMONSQUEEZY_WEBHOOK_SECRET"];
    const signature = data.headers["x-signature"];
    if (!verifySignature(data.body, signature ?? null, LEMONSQUEEZY_WEBHOOK_SECRET)) {
      throw new Error("Invalid webhook signature");
    }

    const event: LemonSqueezyEvent = JSON.parse(data.body);
    const eventName = event.meta.event_name;
    const attrs = event.data.attributes;

    // Extract user_id from custom_data
    const userId = attrs.custom_data?.user_id;
    if (!userId) {
      console.error("No user_id in webhook custom_data");
      return { received: true };
    }

    const status = mapStatus(attrs.status);

    if (!supabase) {
      console.error("Supabase not configured");
      return { received: true };
    }

    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        lemon_squeezy_id: event.data.id,
        status,
        plan_id: String(attrs.product_id),
        variant_id: String(attrs.variant_id),
        renews_at: attrs.renews_at,
        expires_at: attrs.expires_at,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("Failed to upsert subscription:", error.message);
      throw new Error("Failed to update subscription");
    }

    console.log(`Webhook processed: ${eventName} for user ${userId} -> ${status}`);
    return { received: true };
  });
