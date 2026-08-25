import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

type LemonSqueezyEvent = {
  meta: {
    event_name: string;
    custom_data?: Record<string, string>;
  };
  data: {
    id: string;
    attributes: {
      user_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      subscription_id: number | null;
      status: string;
      renews_at: string | null;
      expires_at: string | null;
      created_at: string;
      updated_at: string;
      custom_data?: Record<string, string>;
    };
  };
};

function mapStatus(lsStatus: string): string {
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

async function fetchCustomerEmail(
  apiKey: string,
  subscriptionId: string,
): Promise<string | null> {
  try {
    // Get subscription to find customer_id
    const subRes = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } },
    );
    if (!subRes.ok) return null;
    const subJson = await subRes.json();
    const customerId = subJson.data?.attributes?.customer_id;
    if (!customerId) return null;

    // Get customer email
    const custRes = await fetch(
      `https://api.lemonsqueezy.com/v1/customers/${customerId}`,
      { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } },
    );
    if (!custRes.ok) return null;
    const custJson = await custRes.json();
    return custJson.data?.attributes?.email ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/webhooks/lemonsqueezy")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          const event: LemonSqueezyEvent = JSON.parse(body);
          const eventName = event.meta?.event_name;
          const attrs = event.data?.attributes;

          console.log(`[Webhook] Event: ${eventName}, id: ${event.data?.id}`);
          console.log(`[Webhook] meta.custom_data:`, JSON.stringify((event.meta as unknown as Record<string, unknown>)?.custom_data));
          console.log(`[Webhook] attrs.custom_data:`, JSON.stringify(attrs?.custom_data));
          console.log(`[Webhook] attrs.status:`, attrs?.status, `subscription_id:`, attrs?.subscription_id);

          if (!supabase) {
            console.error("[Webhook] Supabase not configured");
            return new Response(JSON.stringify({ error: "Supabase not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Step 1: Try custom_data from meta (LemonSqueezy puts checkout custom there) - user_id based, email-independent
          let userId =
            (event.meta as unknown as { custom_data?: Record<string, string> })?.custom_data?.user_id ??
            attrs?.custom_data?.user_id;

          if (userId) {
            console.log(`[Webhook] Found user_id from custom_data: ${userId}`);
          }

          // Step 2: Fallback - look up pending subscription by email from LemonSqueezy API
          if (!userId) {
            const apiKey = process.env["LEMONSQUEEZY_API_KEY"];
            if (apiKey) {
              const subId = String(attrs?.subscription_id || event.data.id);
              const email = await fetchCustomerEmail(apiKey, subId);
              console.log(`[Webhook] Customer email from API: ${email}`);

              if (email) {
                const { data: pending } = await supabase
                  .from("subscriptions")
                  .select("user_id")
                  .eq("email", email)
                  .eq("status", "pending")
                  .maybeSingle();
                userId = pending?.user_id;
                console.log(`[Webhook] Found user_id from email fallback: ${userId ?? "NONE"}`);
              }
            }
          }

          if (!userId) {
            console.error("[Webhook] No user_id found — skipping");
            return new Response(JSON.stringify({ received: true, reason: "no user_id" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // subscription_payment_success carries invoice status (e.g. "paid"), not subscription status — treat as active
          let rawStatus = attrs.status;
          if (eventName === "subscription_payment_success" && rawStatus !== "active") {
            rawStatus = "active";
            console.log(`[Webhook] Overriding status for ${eventName} to active`);
          }
          const status = mapStatus(rawStatus);
          const lemonSqueezyId = String(attrs?.subscription_id || event.data.id);

          const { error } = await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              lemon_squeezy_id: lemonSqueezyId,
              email: null,
              status,
              plan_id: String(attrs.product_id),
              variant_id: String(attrs.variant_id),
              renews_at: attrs.renews_at,
              expires_at: attrs.expires_at,
            },
            { onConflict: "user_id" },
          );

          if (error) {
            console.error("[Webhook] Supabase error:", error.message, error.code);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log(`[Webhook] Saved: user ${userId} -> ${status}`);
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("[Webhook] Error:", error);
          return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
